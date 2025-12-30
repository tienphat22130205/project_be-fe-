import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import favoriteController from './favorites.controller';

const router = Router();

router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.post('/:tourId', favoriteController.addFavorite);
router.delete('/:tourId', favoriteController.removeFavorite);
router.get('/:tourId/is-favorite', favoriteController.checkFavorite);

export default router;
