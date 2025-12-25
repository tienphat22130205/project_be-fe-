import { Router } from 'express';
import {
  getServicesByTour,
  createService,
  updateService,
  deleteService,
} from './additionalService.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * GET /api/tours/:tourId/additional-services
 * Lấy danh sách dịch vụ cộng thêm của tour
 * Public route
 */
router.get('/tours/:tourId/additional-services', getServicesByTour);

/**
 * POST /api/additional-services
 * Tạo dịch vụ cộng thêm mới
 * Admin only
 */
router.post('/', authenticate, authorize('admin'), createService);

/**
 * PUT /api/additional-services/:id
 * Cập nhật dịch vụ cộng thêm
 * Admin only
 */
router.put('/:id', authenticate, authorize('admin'), updateService);

/**
 * DELETE /api/additional-services/:id
 * Xóa (deactivate) dịch vụ cộng thêm
 * Admin only
 */
router.delete('/:id', authenticate, authorize('admin'), deleteService);

export default router;
