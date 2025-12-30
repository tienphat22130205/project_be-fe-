import jwt from 'jsonwebtoken';
import { User, IUser } from '../../entities/User';
import config from '../../configs';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../../exceptions';
import { Voucher } from '../../entities/Voucher';
import voucherService from '../vouchers/vouchers.service';

export class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret as string, {
      expiresIn: config.jwt.expiresIn as string,
    } as jwt.SignOptions);
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.refreshSecret as string, {
      expiresIn: config.jwt.refreshExpiresIn as string,
    } as jwt.SignOptions);
  }

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create user
    const user = await User.create(data);

    // Generate tokens
    const accessToken = this.generateToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Assign welcome voucher if exists
    try {
      const welcomeVoucher = await Voucher.findOne({
        trigger: 'welcome',
        isActive: true,
      });

      if (welcomeVoucher && welcomeVoucher.usageLimit > 0) {
        await voucherService.assignVoucher(user._id.toString(), welcomeVoucher.code);
      }
    } catch (error) {
      // Ignore error if voucher assignment fails (should not block registration)
      console.error('Failed to assign welcome voucher', error);
    }

    return { user, accessToken, refreshToken };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = this.generateToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
      };

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // Check if refresh token exists in user's tokens
      if (!user.refreshTokens.includes(refreshToken)) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Generate new tokens
      const newAccessToken = this.generateToken(user._id.toString());
      const newRefreshToken = this.generateRefreshToken(user._id.toString());

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Remove refresh token
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      phone?: string;
      avatar?: string;
      dateOfBirth?: Date;
      gender?: string;
      address?: string;
      taxId?: string;
    }
  ): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();
  }
}

export default new AuthService();
