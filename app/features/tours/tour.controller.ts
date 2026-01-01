import { Request, Response, NextFunction } from 'express';
import tourService from './tour.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class TourController {
  async createTour(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tour = await tourService.createTour(req.body);

      res.status(201).json({
        status: 'success',
        data: { tour },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sort: req.query.sort as string,
        search: req.query.search as string,
        destination: req.query.destination as string,
        difficulty: req.query.difficulty as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        category: req.query.category as string,
        featured: req.query.featured === 'true' ? true : undefined,
        isInternational: req.query.isInternational === 'true' ? true : req.query.isInternational === 'false' ? false : undefined,
        minDuration: req.query.minDuration ? parseInt(req.query.minDuration as string) : undefined,
        maxDuration: req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined,
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        region: req.query.region as string,
        province: req.query.province as string,
        country: req.query.country as string,
      };

      const result = await tourService.getTours(query);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTourById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tour = await tourService.getTourById(req.params.id);

      res.status(200).json({
        status: 'success',
        data: { tour },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTour(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tour = await tourService.updateTour(req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        data: { tour },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTour(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await tourService.deleteTour(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const tours = await tourService.getFeaturedTours(limit);

      res.status(200).json({
        status: 'success',
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPopularTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const tours = await tourService.getPopularTours(limit);

      res.status(200).json({
        status: 'success',
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTourStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await tourService.getTourStats();

      res.status(200).json({
        status: 'success',
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRelatedTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 4;
      const tours = await tourService.getRelatedTours(id, limit);

      res.status(200).json({
        status: 'success',
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPromotionalTours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as 'domestic' | 'international' | undefined;
      const limit = parseInt(req.query.limit as string) || 6;

      const tours = await tourService.getPromotionalTours(type, limit);

      res.status(200).json({
        status: 'success',
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const regions = await tourService.getRegions();

      res.status(200).json({
        status: 'success',
        data: { regions },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProvincesByRegion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { region } = req.params;
      const provinces = await tourService.getProvincesByRegion(region);

      res.status(200).json({
        status: 'success',
        data: { provinces },
      });
    } catch (error) {
      next(error);
    }
  }

  async getToursByRegion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { region } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const tours = await tourService.getToursByRegion(region, limit);

      res.status(200).json({
        status: 'success',
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }

  async getToursByProvince(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { province } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const tours = await tourService.getToursByProvince(province, limit);

      res.status(200).json({
        status: 'success',
        data: { tours },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TourController();
