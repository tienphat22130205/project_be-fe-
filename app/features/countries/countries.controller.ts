import { Request, Response, NextFunction } from 'express';
import { Country } from '../../entities/Country';
import { Tour } from '../../entities/Tour';

export class CountriesController {
    // GET /api/countries - Lấy tất cả countries
    async getAllCountries(_req: Request, res: Response, next: NextFunction) {
        try {
            const countries = await Country.find({ isActive: true })
                .sort({ name: 1 });

            // Đếm số tours cho mỗi country
            const countriesWithTourCount = await Promise.all(
                countries.map(async (country) => {
                    const tourCount = await Tour.countDocuments({
                        country: country._id,
                        isActive: true
                    });
                    return {
                        ...country.toObject(),
                        tourCount
                    };
                })
            );

            res.status(200).json({
                status: 'success',
                data: {
                    countries: countriesWithTourCount,
                    total: countriesWithTourCount.length
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/countries/:slug - Lấy country theo slug
    async getCountryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slug } = req.params;

            const country = await Country.findOne({ slug, isActive: true });

            if (!country) {
                res.status(404).json({
                    status: 'fail',
                    message: 'Không tìm thấy quốc gia'
                });
                return;
            }

            // Đếm số tours
            const tourCount = await Tour.countDocuments({
                country: country._id,
                isActive: true
            });

            res.status(200).json({
                status: 'success',
                data: {
                    country: {
                        ...country.toObject(),
                        tourCount
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/countries/:slug/tours - Lấy tất cả tours của 1 country
    async getToursByCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slug } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            // Tìm country
            const country = await Country.findOne({ slug, isActive: true });

            if (!country) {
                res.status(404).json({
                    status: 'fail',
                    message: 'Không tìm thấy quốc gia'
                });
                return;
            }

            // Lấy tours
            const tours = await Tour.find({
                country: country._id,
                isActive: true
            })
                .populate('country', 'name slug image')
                .sort({ featured: -1, price: 1 })
                .skip(skip)
                .limit(limit);

            const total = await Tour.countDocuments({
                country: country._id,
                isActive: true
            });

            res.status(200).json({
                status: 'success',
                data: {
                    country: {
                        _id: country._id,
                        name: country.name,
                        slug: country.slug,
                        image: country.image,
                        description: country.description
                    },
                    tours,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/countries/continent/:continent - Lấy countries theo châu lục
    async getCountriesByContinent(req: Request, res: Response, next: NextFunction) {
        try {
            const { continent } = req.params;

            const countries = await Country.find({
                continent,
                isActive: true
            }).sort({ name: 1 });

            // Đếm số tours cho mỗi country
            const countriesWithTourCount = await Promise.all(
                countries.map(async (country) => {
                    const tourCount = await Tour.countDocuments({
                        country: country._id,
                        isActive: true
                    });
                    return {
                        ...country.toObject(),
                        tourCount
                    };
                })
            );

            res.status(200).json({
                status: 'success',
                data: {
                    continent,
                    countries: countriesWithTourCount,
                    total: countriesWithTourCount.length
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
