import { User } from '../../entities/User';
import { Tour } from '../../entities/Tour';
import { AppError } from '../../exceptions';

class FavoriteService {
    async addFavorite(userId: string, tourId: string) {
        const tour = await Tour.findById(tourId);
        if (!tour) {
            throw new AppError('Tour not found', 404);
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check if already in favorites
        if (user.favoriteTours.includes(tour._id)) {
            throw new AppError('Tour already in favorites', 400);
        }

        user.favoriteTours.push(tour._id);
        await user.save();

        return user.favoriteTours;
    }

    async removeFavorite(userId: string, tourId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        user.favoriteTours = user.favoriteTours.filter(
            (id) => id.toString() !== tourId
        );
        await user.save();

        return user.favoriteTours;
    }

    async getFavorites(userId: string) {
        const user = await User.findById(userId).populate('favoriteTours');
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user.favoriteTours;
    }

    async checkFavorite(userId: string, tourId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const isFavorite = user.favoriteTours.some(
            (id) => id.toString() === tourId
        );

        return isFavorite;
    }
}

export default new FavoriteService();
