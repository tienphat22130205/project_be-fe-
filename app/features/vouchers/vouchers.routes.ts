import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import voucherController from './vouchers.controller';

const router = Router();

// Public routes (none for now, validation happens with auth usually)

// Protected routes
router.use(authenticate);

router.get('/my-vouchers', voucherController.getMyVouchers);
router.post('/apply', voucherController.applyVoucher);

// Admin only
router.post('/', authorize('admin'), voucherController.createVoucher);

export default router;
