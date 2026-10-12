import { PaymentService } from '../services/paymentService.js';

export class PaymentController {
  static getConfig(req, res, next) {
    try {
      const config = PaymentService.getPaymentConfig();
      res.json({ success: true, data: config });
    } catch (err) {
      next(err);
    }
  }

  static async submit(req, res, next) {
    try {
      const { courseId, recipientPhone, transactionReference, senderPhone, senderName } = req.body;
      const result = await PaymentService.submitPayment({
        userId: req.user.id,
        courseId,
        recipientPhone,
        transactionReference,
        senderPhone,
        senderName,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static getMyPayments(req, res, next) {
    try {
      const payments = PaymentService.getUserPayments(req.user.id);
      res.json({ success: true, data: payments });
    } catch (err) {
      next(err);
    }
  }

  static getCourseStatus(req, res, next) {
    try {
      const { courseId } = req.params;
      const status = PaymentService.getCoursePaymentStatus(req.user.id, courseId);
      res.json({ success: true, data: status });
    } catch (err) {
      next(err);
    }
  }

  // Admin handlers
  static getAdminPayments(req, res, next) {
    try {
      const { status, search } = req.query;
      const result = PaymentService.getAllPaymentsAdmin({ status, search });
      res.json({ success: true, data: result.payments, stats: result.stats });
    } catch (err) {
      next(err);
    }
  }

  static async approveAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const result = PaymentService.approvePaymentAdmin(id, req.user, notes);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async rejectAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const result = PaymentService.rejectPaymentAdmin(id, req.user, notes);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;
