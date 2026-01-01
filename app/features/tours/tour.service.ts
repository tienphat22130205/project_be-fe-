import { Tour, ITour } from '../../entities/Tour';
import { Region } from '../../entities/Region';
import { Province } from '../../entities/Province';
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
  isInternational?: boolean;
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
  region?: string;
  province?: string;
  country?: string;
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
      isInternational,
      minDuration,
      maxDuration,
      minRating,
      region,
      province,
      country,
    } = query;

    // Build filter
    const filter: any = { isActive: true };

    // Advanced search: tìm theo nhiều trường
    if (search) {
      // Nếu có search, tìm trong nhiều collections
      const searchRegex = { $regex: search, $options: 'i' };
      
      // Tìm regions matching
      const regions = await Region.find({ 
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).select('_id');
      const regionIds = regions.map(r => r._id);

      // Tìm provinces matching
      const provinces = await Province.find({ 
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).select('_id');
      const provinceIds = provinces.map(p => p._id);

      // Tìm countries matching (nếu có Country model)
      let countryIds: any[] = [];
      try {
        const { Country } = await import('../../entities/Country');
        const countries = await Country.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex }
          ]
        }).select('_id');
        countryIds = countries.map(c => c._id);
      } catch (e) {
        // Country model không tồn tại
      }

      // Build search filter
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { destination: searchRegex },
        { category: searchRegex },
        { highlights: searchRegex },
        { included: searchRegex },
        { excluded: searchRegex },
      ];

      // Thêm search theo region, province, country IDs
      if (regionIds.length > 0) {
        filter.$or.push({ region: { $in: regionIds } });
      }
      if (provinceIds.length > 0) {
        filter.$or.push({ province: { $in: provinceIds } });
      }
      if (countryIds.length > 0) {
        filter.$or.push({ country: { $in: countryIds } });
      }
    }

    // Filter cụ thể theo region (slug hoặc name)
    if (region) {
      const regionDoc = await Region.findOne({
        $or: [
          { slug: region },
          { name: { $regex: region, $options: 'i' } }
        ]
      });
      if (regionDoc) {
        filter.region = regionDoc._id;
      }
    }

    // Filter cụ thể theo province (slug hoặc name)
    if (province) {
      const provinceDoc = await Province.findOne({
        $or: [
          { slug: province },
          { name: { $regex: province, $options: 'i' } }
        ]
      });
      if (provinceDoc) {
        filter.province = provinceDoc._id;
      }
    }

    // Filter cụ thể theo country (slug hoặc name)
    if (country) {
      try {
        const { Country } = await import('../../entities/Country');
        const countryDoc = await Country.findOne({
          $or: [
            { slug: country },
            { name: { $regex: country, $options: 'i' } }
          ]
        });
        if (countryDoc) {
          filter.country = countryDoc._id;
        }
      } catch (e) {
        // Country model không tồn tại
      }
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

    if (isInternational !== undefined) {
      filter.isInternational = isInternational;
    }

    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) filter.duration.$gte = minDuration;
      if (maxDuration) filter.duration.$lte = maxDuration;
    }

    if (minRating) {
      filter.rating = { $gte: minRating };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [tours, total] = await Promise.all([
      Tour.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('guides', 'fullName email avatar')
        .populate('region', 'name slug image')
        .populate('province', 'name slug image thumbnailImage')
        .populate('country', 'name slug image'),
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
    const tour = await Tour.findById(tourId)
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug description image')
      .populate('province', 'name slug description image thumbnailImage');

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
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug image')
      .populate('province', 'name slug image thumbnailImage');

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }

  async getPopularTours(limit: number = 6): Promise<ITour[]> {
    const tours = await Tour.find({ isActive: true })
      .sort('-ratingsQuantity -rating')
      .limit(limit)
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug image')
      .populate('province', 'name slug image thumbnailImage');

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
    })
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug image')
      .populate('province', 'name slug image thumbnailImage');

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
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug image')
      .populate('province', 'name slug image thumbnailImage');

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }

  /**
   * Get list of all regions with images
   */
  async getRegions(): Promise<any[]> {
    const regions = await Region.find({ isActive: true })
      .sort('order')
      .lean();

    // Get tour count for each region
    const regionsWithCount = await Promise.all(
      regions.map(async (region) => {
        const tourCount = await Tour.countDocuments({
          isActive: true,
          isInternational: false,
          region: region._id
        });

        return {
          _id: region._id,
          name: region.name,
          slug: region.slug,
          description: region.description,
          image: region.image,
          order: region.order,
          tourCount
        };
      })
    );

    return regionsWithCount;
  }

  /**
   * Get list of provinces by region with images
   */
  async getProvincesByRegion(regionSlug: string): Promise<any[]> {
    // Find region by slug
    const region = await Region.findOne({ slug: regionSlug, isActive: true });
    
    if (!region) {
      throw new NotFoundError('Region not found');
    }

    // Get provinces in this region
    const provinces = await Province.find({ 
      region: region._id,
      isActive: true 
    })
      .sort('order')
      .lean();

    // Get tour count for each province
    const provincesWithCount = await Promise.all(
      provinces.map(async (province) => {
        const tourCount = await Tour.countDocuments({
          isActive: true,
          isInternational: false,
          province: province._id
        });

        return {
          _id: province._id,
          name: province.name,
          slug: province.slug,
          description: province.description,
          image: province.image,
          thumbnailImage: province.thumbnailImage,
          order: province.order,
          tourCount
        };
      })
    );

    return provincesWithCount;
  }

  /**
   * Get tours by region slug
   */
  async getToursByRegion(regionSlug: string, limit?: number): Promise<ITour[]> {
    // Find region by slug
    const region = await Region.findOne({ slug: regionSlug, isActive: true });
    
    if (!region) {
      throw new NotFoundError('Region not found');
    }

    const query = Tour.find({
      isActive: true,
      isInternational: false,
      region: region._id
    })
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug image')
      .populate('province', 'name slug image thumbnailImage')
      .sort('-rating -ratingsQuantity');

    if (limit) {
      query.limit(limit);
    }

    const tours = await query;

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }

  /**
   * Get tours by province slug
   */
  async getToursByProvince(provinceSlug: string, limit?: number): Promise<ITour[]> {
    // Find province by slug
    const province = await Province.findOne({ slug: provinceSlug, isActive: true });
    
    if (!province) {
      throw new NotFoundError('Province not found');
    }

    const query = Tour.find({
      isActive: true,
      isInternational: false,
      province: province._id
    })
      .populate('guides', 'fullName email avatar')
      .populate('region', 'name slug image')
      .populate('province', 'name slug image thumbnailImage')
      .sort('-rating -ratingsQuantity');

    if (limit) {
      query.limit(limit);
    }

    const tours = await query;

    // Adjust dates to future
    const adjustedTours = this.adjustToursDatesToFuture(tours.map(t => t.toObject()));

    return adjustedTours as ITour[];
  }
}

export default new TourService();
