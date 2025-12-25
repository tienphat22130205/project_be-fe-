import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';

const paymentService = new PaymentService();

/**
 * Khởi tạo thanh toán
 * POST /api/payments/initiate
 */
export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, method, returnUrl, cancelUrl, bankCode } = req.body;

    const result = await paymentService.initiatePayment({
      bookingId,
      method,
      returnUrl,
      cancelUrl,
      bankCode,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Callback từ Momo
 * POST /api/payments/momo/callback
 */
export const momoCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await paymentService.handleMomoCallback(req.body);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Return URL từ Momo (user quay lại sau khi thanh toán)
 * GET /api/payments/momo/return
 */
export const momoReturn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, resultCode } = req.query;

    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment-result?orderId=${orderId}&status=${
      resultCode === '0' ? 'success' : 'failed'
    }`;

    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * Callback từ VNPay
 * GET /api/payments/vnpay/callback
 */
export const vnpayCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await paymentService.handleVNPayCallback(req.query);

    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment-result?paymentId=${payment._id}&status=${
      payment.status === 'completed' ? 'success' : 'failed'
    }`;

    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * Xác nhận thanh toán thủ công (bank transfer, cash)
 * POST /api/payments/:paymentId/confirm
 */
export const confirmManualPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const { transactionId, notes } = req.body;

    const payment = await paymentService.confirmManualPayment(paymentId, {
      transactionId,
      notes,
    });

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin payment
 * GET /api/payments/:paymentId
 */
export const getPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentById(paymentId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
