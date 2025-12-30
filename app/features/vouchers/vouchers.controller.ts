import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import voucherService from './vouchers.service';

class VoucherController {
    async createVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const voucher = await voucherService.createVoucher(req.body);
            res.status(201).json({
                status: 'success',
                data: voucher,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyVouchers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const vouchers = await voucherService.getMyVouchers(userId);
            res.status(200).json({
                status: 'success',
                data: vouchers,
            });
        } catch (error) {
            next(error);
        }
    }

    async applyVoucher(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { code, orderTotal } = req.body;

            const result = await voucherService.validateVoucher(code, userId, orderTotal);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new VoucherController();
