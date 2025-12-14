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

    return {
      tours,
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

    return tour;
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

    return tours;
  }

  async getPopularTours(limit: number = 6): Promise<ITour[]> {
    const tours = await Tour.find({ isActive: true })
      .sort('-ratingsQuantity -rating')
      .limit(limit)
      .populate('guides', 'fullName email avatar');

    return tours;
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

    return tours;
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
}

export default new TourService();
