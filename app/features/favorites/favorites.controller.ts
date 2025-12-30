import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import favoriteService from './favorites.service';

class FavoriteController {
    async addFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { tourId } = req.params;

            const favorites = await favoriteService.addFavorite(userId, tourId);

            res.status(200).json({
                status: 'success',
                data: favorites,
            });
        } catch (error) {
            next(error);
        }
    }

    async removeFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { tourId } = req.params;

            const favorites = await favoriteService.removeFavorite(userId, tourId);

            res.status(200).json({
                status: 'success',
                data: favorites,
            });
        } catch (error) {
            next(error);
        }
    }

    async getFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();

            const favorites = await favoriteService.getFavorites(userId);

            res.status(200).json({
                status: 'success',
                data: favorites,
            });
        } catch (error) {
            next(error);
        }
    }

    async checkFavorite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { tourId } = req.params;

            const isFavorite = await favoriteService.checkFavorite(userId, tourId);

            res.status(200).json({
                status: 'success',
                data: { isFavorite },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new FavoriteController();
