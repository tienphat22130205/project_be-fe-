import crypto from 'crypto';
import { Payment, IPayment } from '../../entities/Payment';
import { Booking } from '../../entities/Booking';
import { NotFoundError, BadRequestError } from '../../exceptions';

export interface PaymentInitiationData {
  bookingId: string;
  method: 'atm' | 'credit_card' | 'bank_transfer' | 'cash' | 'momo';
  returnUrl: string;
  cancelUrl: string;
  bankCode?: string;
}

export interface MomoPaymentRequest {
  amount: number;
  orderId: string;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
}

export interface VNPayPaymentRequest {
  amount: number;
  orderId: string;
  orderInfo: string;
  returnUrl: string;
  bankCode?: string;
}

export class PaymentService {
  // Momo config (từ environment variables)
  private readonly momoConfig = {
    partnerCode: process.env.MOMO_PARTNER_CODE || '',
    accessKey: process.env.MOMO_ACCESS_KEY || '',
    secretKey: process.env.MOMO_SECRET_KEY || '',
    endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  };

  // VNPay config (cho ATM và Credit Card)
  private readonly vnpayConfig = {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    hashSecret: process.env.VNPAY_HASH_SECRET || '',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || '',
  };

  /**
   * Khởi tạo thanh toán
   */
  async initiatePayment(data: PaymentInitiationData): Promise<{
    payment: IPayment;
    paymentUrl?: string;
    qrCode?: string;
    instructions?: string;
  }> {
    // Validate returnUrl cho các phương thức online
    const onlineMethods = ['momo', 'atm', 'credit_card'];
    if (onlineMethods.includes(data.method) && !data.returnUrl) {
      throw new BadRequestError('returnUrl is required for online payment methods');
    }

    // Kiểm tra booking
    const booking = await Booking.findById(data.bookingId).populate('tour');
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.paymentStatus === 'paid') {
      throw new BadRequestError('Booking already paid');
    }

    // Tính số tiền cần thanh toán
    const amount =
      booking.paymentType === '100%'
        ? booking.totalPrice
        : Math.round(booking.totalPrice * 0.5);

    // Tạo payment record
    const payment = await Payment.create({
      booking: booking._id,
      amount,
      method: data.method,
      status: 'pending',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    });

    // Cập nhật booking
    booking.payment = payment._id;
    booking.paymentMethod = data.method;
    await booking.save();

    // Xử lý theo phương thức thanh toán
    let result: any = { payment };

    switch (data.method) {
      case 'momo':
        result = await this.createMomoPayment(payment, data);
        break;

      case 'atm':
      case 'credit_card':
        result = await this.createVNPayPayment(payment, data);
        break;

      case 'bank_transfer':
        result = {
          payment,
          instructions: this.getBankTransferInstructions(payment),
        };
        break;

      case 'cash':
        result = {
          payment,
          instructions: this.getCashPaymentInstructions(payment),
        };
        break;
    }

    return result;
  }

  /**
   * Tạo thanh toán Momo
   */
  private async createMomoPayment(
    payment: IPayment,
    data: PaymentInitiationData
  ): Promise<any> {
    const { partnerCode, accessKey, secretKey, endpoint } = this.momoConfig;

    const orderId = payment._id.toString();
    const requestId = orderId;
    const amount = payment.amount;
    const orderInfo = `Thanh toán booking ${payment.booking}`;
    const returnUrl = data.returnUrl;
    const notifyUrl = `${process.env.API_URL}/api/payments/momo/callback`;
    const extraData = '';
    const requestType = 'captureWallet';

    // Tạo signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: returnUrl,
      ipnUrl: notifyUrl,
      extraData,
      requestType,
      signature,
      lang: 'vi',
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json() as any;

      if (result.resultCode === 0) {
        payment.status = 'processing';
        payment.transactionId = requestId;
        payment.gatewayResponse = result;
        await payment.save();

        return {
          payment,
          paymentUrl: result.payUrl,
          qrCode: result.qrCodeUrl,
        };
      } else {
        throw new BadRequestError(`Momo payment failed: ${result.message}`);
      }
    } catch (error: any) {
      throw new BadRequestError(`Failed to create Momo payment: ${error.message}`);
    }
  }

  /**
   * Tạo thanh toán VNPay (ATM/Credit Card)
   */
  private async createVNPayPayment(
    payment: IPayment,
    data: PaymentInitiationData
  ): Promise<any> {
    const { tmnCode, hashSecret, url, returnUrl } = this.vnpayConfig;

    const date = new Date();
    const createDate = this.formatDateTime(date);
    const orderId = date.getTime().toString();
    const amount = payment.amount * 100; // VNPay yêu cầu amount x100

    let vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: amount,
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan booking ${payment.booking}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: returnUrl || data.returnUrl,
      vnp_TxnRef: orderId,
    };

    if (data.bankCode) {
      vnpParams.vnp_BankCode = data.bankCode;
    }

    // Sắp xếp params và tạo signature
    const sortedParams = this.sortObject(vnpParams);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams.vnp_SecureHash = signed;

    const paymentUrl = url + '?' + new URLSearchParams(sortedParams).toString();

    payment.status = 'processing';
    payment.transactionId = orderId;
    payment.metadata = {
      ...payment.metadata,
      bankCode: data.bankCode,
    };
    await payment.save();

    return {
      payment,
      paymentUrl,
    };
  }

  /**
   * Hướng dẫn chuyển khoản ngân hàng
   */
  private getBankTransferInstructions(payment: IPayment): string {
    return `
Thông tin chuyển khoản:
- Ngân hàng: Vietcombank
- Số tài khoản: 1234567890
- Chủ tài khoản: CÔNG TY SAIGON TOURIST
- Số tiền: ${payment.amount.toLocaleString('vi-VN')} VNĐ
- Nội dung: BOOKING ${payment.booking}

Lưu ý: Sau khi chuyển khoản, vui lòng gửi ảnh chụp biên lai về email hoặc liên hệ hotline để xác nhận thanh toán.
    `.trim();
  }

  /**
   * Hướng dẫn thanh toán tiền mặt
   */
  private getCashPaymentInstructions(payment: IPayment): string {
    return `
Quý khách vui lòng đến các văn phòng Lữ hành Saigontourist để thanh toán:

Văn phòng 1:
- Địa chỉ: 45 Lê Thánh Tôn, Q.1, TP.HCM
- Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)

Văn phòng 2:
- Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM
- Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)

Số tiền: ${payment.amount.toLocaleString('vi-VN')} VNĐ
Mã booking: ${payment.booking}
    `.trim();
  }

  /**
   * Xử lý callback từ Momo
   */
  async handleMomoCallback(data: any): Promise<IPayment> {
    const payment = await Payment.findOne({ transactionId: data.requestId });
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (data.resultCode === 0) {
      payment.status = 'completed';
      payment.paymentDate = new Date();
      payment.gatewayResponse = data;

      // Cập nhật booking
      const booking = await Booking.findById(payment.booking);
      if (booking) {
        if (booking.paymentType === '100%') {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
        } else {
          booking.paymentStatus = 'partial';
        }
        await booking.save();
      }
    } else {
      payment.status = 'failed';
      payment.gatewayResponse = data;
    }

    await payment.save();
    return payment;
  }

  /**
   * Xử lý callback từ VNPay
   */
  async handleVNPayCallback(query: any): Promise<IPayment> {
    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedParams = this.sortObject(query);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', this.vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      throw new BadRequestError('Invalid signature');
    }

    const payment = await Payment.findOne({ transactionId: query.vnp_TxnRef });
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (query.vnp_ResponseCode === '00') {
      payment.status = 'completed';
      payment.paymentDate = new Date();
      payment.gatewayResponse = query;

      // Cập nhật booking
      const booking = await Booking.findById(payment.booking);
      if (booking) {
        if (booking.paymentType === '100%') {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
        } else {
          booking.paymentStatus = 'partial';
        }
        await booking.save();
      }
    } else {
      payment.status = 'failed';
      payment.gatewayResponse = query;
    }

    await payment.save();
    return payment;
  }

  /**
   * Xác nhận thanh toán thủ công (bank transfer, cash)
   */
  async confirmManualPayment(
    paymentId: string,
    data: {
      transactionId?: string;
      notes?: string;
    }
  ): Promise<IPayment> {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (payment.status === 'completed') {
      throw new BadRequestError('Payment already completed');
    }

    payment.status = 'completed';
    payment.paymentDate = new Date();
    payment.transactionId = data.transactionId || `MANUAL-${Date.now()}`;
    payment.metadata = {
      ...payment.metadata,
      description: data.notes,
    };

    // Cập nhật booking
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      if (booking.paymentType === '100%') {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
      } else {
        booking.paymentStatus = 'partial';
      }
      await booking.save();
    }

    await payment.save();
    return payment;
  }

  /**
   * Lấy thông tin payment
   */
  async getPaymentById(paymentId: string): Promise<IPayment> {
    const payment = await Payment.findById(paymentId).populate({
      path: 'booking',
      populate: { path: 'tour user' },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    return payment;
  }

  /**
   * Utility: Format datetime cho VNPay
   */
  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Utility: Sort object by key
   */
  private sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }
}
