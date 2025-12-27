import { Tour, ITour } from '../../entities/Tour';
import { NotFoundError } from '../../exceptions';

export interface TourQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  destination?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  featured?: boolean;
}

export class TourService {
  /**
   * Helper function to adjust tour dates to future dates
   * Moves dates to current or next year automatically
   */
  private adjustTourDatesToFuture(tour: any): any {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Adjust startDates array
    if (tour.startDates && Array.isArray(tour.startDates)) {
      tour.startDates = tour.startDates.map((date: Date) => {
        const originalDate = new Date(date);
        const originalMonth = originalDate.getMonth();
        const originalDay = originalDate.getDate();

        // Create new date with current/next year
        let newDate = new Date(currentYear, originalMonth, originalDay);

        // If the date has passed this year, move to next year
        if (newDate < now) {
          newDate = new Date(currentYear + 1, originalMonth, originalDay);
        }

        return newDate;
      });
    }

    // Adjust departures array
    if (tour.departures && Array.isArray(tour.departures)) {
      tour.departures = tour.departures.map((departure: any) => {
        const startDate = new Date(departure.startDate);
        const endDate = new Date(departure.endDate);

        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();
        const endMonth = endDate.getMonth();
        const endDay = endDate.getDate();

        // Adjust start date
        let newStartDate = new Date(currentYear, startMonth, startDay);
        if (newStartDate < now) {
          newStartDate = new Date(currentYear + 1, startMonth, startDay);
        }

        // Adjust end date (same year as start date)
        const yearToUse = newStartDate.getFullYear();
        let newEndDate = new Date(yearToUse, endMonth, endDay);

        // If end date is before start date, it means it crosses year boundary
        if (newEndDate < newStartDate) {
          newEndDate = new Date(yearToUse + 1, endMonth, endDay);
        }

        return {
          ...departure,
          startDate: newStartDate,
          endDate: newEndDate,
        };
      });

      // Filter out departures that have passed and no available seats
      tour.departures = tour.departures.filter((dep: any) => {
        return new Date(dep.startDate) >= now || dep.availableSeats > 0;
      });
    }

    return tour;
  }

  /**
   * Apply date adjustment to array of tours
   */
  private adjustToursDatesToFuture(tours: any[]): any[] {
    return tours.map(tour => this.adjustTourDatesToFuture(tour));
  }
  async createTour(data: Partial<ITour>): Promise<ITour> {
    const tour = await Tour.create(data);
    return tour;
  }

  async getTours(query: TourQuery): Promise<{
    tours: ITour[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      destination,
      difficulty,
      minPrice,
      maxPrice,
      category,
      featured,
    } = query;

    // Build filter
    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [tours, total] = await Promise.all([
      Tour.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('guides', 'fullName email avatar'),
      Tour.countDocuments(filter),
    ]);

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return {
      tours: adjustedTours,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTourById(tourId: string): Promise<ITour> {
    const tour = await Tour.findById(tourId).populate('guides', 'fullName email avatar');

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    // Adjust dates to future
    const adjustedTour = this.adjustTourDatesToFuture(tour.toObject());

    return adjustedTour as ITour;
  }

  async updateTour(tourId: string, data: Partial<ITour>): Promise<ITour> {
    const tour = await Tour.findByIdAndUpdate(tourId, data, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }

    return tour;
  }

  async deleteTour(tourId: string): Promise<void> {
    const tour = await Tour.findByIdAndUpdate(
      tourId,
      { isActive: false },
      { new: true }
    );

    if (!tour) {
      throw new NotFoundError('Tour not found');
    }
  }

  async getFeaturedTours(limit: number = 6): Promise<ITour[]> {
    const tours = await Tour.find({ isActive: true, featured: true })
      .sort('-rating')
      .limit(limit)
      .populate('guides', 'fullName email avatar');

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }

  async getPopularTours(limit: number = 6): Promise<ITour[]> {
    const tours = await Tour.find({ isActive: true })
      .sort('-ratingsQuantity -rating')
      .limit(limit)
      .populate('guides', 'fullName email avatar');

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }

  async searchToursByLocation(
    latitude: number,
    longitude: number,
    distance: number = 100
  ): Promise<ITour[]> {
    // distance in kilometers
    const radiusInRadians = distance / 6378.1; // Earth radius in km

    const tours = await Tour.find({
      isActive: true,
      'startLocation.coordinates': {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    }).populate('guides', 'fullName email avatar');

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }

  async getTourStats(): Promise<any> {
    const stats = await Tour.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    return stats;
  }

  async getRelatedTours(tourId: string, limit: number = 4): Promise<ITour[]> {
    // Get the current tour
    const currentTour = await Tour.findById(tourId);

    if (!currentTour) {
      throw new NotFoundError('Tour not found');
    }

    // Calculate price range (±30%)
    const priceRange = currentTour.price * 0.3;
    const minPrice = currentTour.price - priceRange;
    const maxPrice = currentTour.price + priceRange;

    // Find related tours based on:
    // 1. Same destination (highest priority)
    // 2. Same category
    // 3. Similar price range
    // 4. Exclude the current tour
    const relatedTours = await Tour.aggregate([
      {
        $match: {
          _id: { $ne: currentTour._id },
          isActive: true,
        },
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              // Same destination: +3 points
              {
                $cond: [
                  { $eq: ['$destination', currentTour.destination] },
                  3,
                  0,
                ],
              },
              // Same category: +2 points
              {
                $cond: [
                  { $eq: ['$category', currentTour.category] },
                  2,
                  0,
                ],
              },
              // Similar price: +1 point
              {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$price', minPrice] },
                      { $lte: ['$price', maxPrice] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $match: {
          relevanceScore: { $gte: 1 }, // At least one matching criterion
        },
      },
      {
        $sort: {
          relevanceScore: -1,
          rating: -1,
          ratingsQuantity: -1,
        },
      },
      {
        $limit: limit,
      },
    ]);

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(relatedTours);

    return adjustedTours as ITour[];
  }

  async getPromotionalTours(type?: 'domestic' | 'international', limit: number = 6): Promise<ITour[]> {
    const filter: any = {
      isActive: true,
      isPromotional: true,
    };

    if (type === 'domestic') {
      filter.isInternational = false;
    } else if (type === 'international') {
      filter.isInternational = true;
    }

    const tours = await Tour.find(filter)
      .sort('-createdAt')
      .limit(limit)
      .populate('guides', 'fullName email avatar');

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }
}

export default new TourService();
