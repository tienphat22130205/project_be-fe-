import { Request, Response, NextFunction } from 'express';
import { AdditionalService } from '../../entities/AdditionalService';
import { NotFoundError } from '../../exceptions';

/**
 * Lấy danh sách dịch vụ cộng thêm của tour
 * GET /api/tours/:tourId/additional-services
 */
export const getServicesByTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tourId } = req.params;
    const services = await AdditionalService.find({
      tour: tourId,
      isActive: true,
    }).sort('name');

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo dịch vụ cộng thêm mới (Admin only)
 * POST /api/additional-services
 */
export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await AdditionalService.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật dịch vụ cộng thêm (Admin only)
 * PUT /api/additional-services/:id
 */
export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const service = await AdditionalService.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      throw new NotFoundError('Additional service not found');
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa dịch vụ cộng thêm (Admin only)
 * DELETE /api/additional-services/:id
 */
export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const service = await AdditionalService.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      throw new NotFoundError('Additional service not found');
    }

    res.status(200).json({
      success: true,
      message: 'Service deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};
