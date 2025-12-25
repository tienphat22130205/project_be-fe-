import { Router } from 'express';
import {
  initiatePayment,
  momoCallback,
  momoReturn,
  vnpayCallback,
  confirmManualPayment,
  getPayment,
} from './payment.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import {
  initiatePaymentValidation,
  confirmManualPaymentValidation,
} from './payment.validation';

const router = Router();

/**
 * POST /api/payments/initiate
 * Khởi tạo thanh toán
 * Requires: authentication
 */
router.post(
  '/initiate',
  authenticate,
  validate(initiatePaymentValidation),
  initiatePayment
);

/**
 * POST /api/payments/momo/callback
 * Callback từ Momo (IPN - Instant Payment Notification)
 * No authentication required
 */
router.post('/momo/callback', momoCallback);

/**
 * GET /api/payments/momo/return
 * Return URL từ Momo sau khi user thanh toán
 * No authentication required
 */
router.get('/momo/return', momoReturn);

/**
 * GET /api/payments/vnpay/callback
 * Callback từ VNPay
 * No authentication required
 */
router.get('/vnpay/callback', vnpayCallback);

/**
 * POST /api/payments/:paymentId/confirm
 * Xác nhận thanh toán thủ công (admin only)
 * Requires: authentication, admin role
 */
router.post(
  '/:paymentId/confirm',
  authenticate,
  validate(confirmManualPaymentValidation),
  confirmManualPayment
);

/**
 * GET /api/payments/:paymentId
 * Lấy thông tin payment
 * Requires: authentication
 */
router.get('/:paymentId', authenticate, getPayment);

export default router;
