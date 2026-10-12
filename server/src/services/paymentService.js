import { getStore } from '../database/db.js';

/**
 * Payment Service for Anchor Solution
 * Primary Method: Telebirr (Manual verification by administration desk)
 * Account Name: Tizta
 * Phone Numbers: 0902 18 44 40 and 0952 58 77 50
 */
export class PaymentService {
  /**
   * Returns supported payment methods, configuration, and guidelines
   */
  static getPaymentConfig() {
    return {
      primaryMethod: 'telebirr',
      accountName: 'Tizta',
      phoneAccounts: [
        {
          id: 'telebirr_1',
          number: '0902 18 44 40',
          clean: '0902184440',
          accountName: 'Tizta',
          labelEn: 'Account Option 1',
          labelAm: 'የቴሌብር አካውንት አማራጭ 1',
          isDefault: true,
        },
        {
          id: 'telebirr_2',
          number: '0952 58 77 50',
          clean: '0952587750',
          accountName: 'Tizta',
          labelEn: 'Account Option 2',
          labelAm: 'የቴሌብር አካውንት አማራጭ 2',
          isDefault: false,
        },
      ],
      stepGuide: {
        en: [
          'Open the Telebirr app on your mobile device or dial *127#.',
          'Send/Transfer the exact course tuition to the verified recipient phone number above.',
          'Copy or note down the Telebirr transaction reference or receipt number from the SMS confirmation.',
          'Enter the transaction reference into the form below and submit for verification.',
          'Our admissions desk will verify the transaction, and your full course access will be granted promptly.',
        ],
        am: [
          'በስልክዎ የቴሌብር (Telebirr) መተግበሪያን ወይም *127# ይክፈቱ።',
          'ትክክለኛውን የትምህርት ክፍያ ከላይ ወደተጠቀሰው የተረጋገጠ ተቀባይ ስልክ ቁጥር ያስተላልፉ።',
          'ከቴሌብር የደረሰዎትን የግብይት ማረጋገጫ ቁጥር (Transaction Reference/Receipt) ይያዙ።',
          'የግብይት ማረጋገጫ ቁጥሩን ከታች ባለው ቅጽ ላይ በማስገባት ለግምገማ ይላኩ።',
          'የአስተዳደር ክፍላችን ክፍያውን እንዳረጋገጠ የትምህርቱ ሙሉ ፈቃድ ወዲያውኑ ይከፈትልዎታል።',
        ],
      },
      supportedGateways: [
        {
          id: 'telebirr',
          name: 'Telebirr',
          nameAm: 'ቴሌብር',
          badge: 'Active & Verified',
          badgeAm: 'ተመራጭ እና ንቁ',
          isAvailable: true,
          accountName: 'Tizta',
        },
        {
          id: 'cbe',
          name: 'Commercial Bank of Ethiopia (CBE)',
          nameAm: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
          badge: 'Coming Soon',
          badgeAm: 'በቅርቡ የሚጀመር',
          isAvailable: false,
        },
      ],
      contactHelp: {
        phones: ['0902 18 44 40', '0952 58 77 50'],
        telegram: 'https://t.me/Anchor_Solutions',
        locationEn: 'Mesrat Yaskeberal Building, Kebele 04, 4th Floor, Bahir Dar, Ethiopia',
        locationAm: 'ባሕር ዳር ከተማ፣ ቀበሌ 04፣ መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ',
      },
    };
  }

  /**
   * Submit a payment for verification by the student
   * Validates course price from trusted server records, never browser inputs
   */
  static async submitPayment({
    userId,
    courseId,
    recipientPhone,
    transactionReference,
    senderPhone,
    senderName,
  }) {
    const store = getStore();

    // 1. Validate User
    const user = store.users.find(u => u.id === parseInt(userId, 10));
    if (!user) {
      const error = new Error('User not found. Please log in.');
      error.statusCode = 401;
      throw error;
    }

    // 2. Validate Course & Price (SERVER-AUTHORITATIVE)
    const cId = parseInt(courseId, 10);
    const course = store.courses.find(c => c.id === cId);
    if (!course) {
      const error = new Error('Selected course does not exist.');
      error.statusCode = 404;
      throw error;
    }

    // 3. Check if user is already enrolled with active status
    const existingActiveEnrollment = store.enrollments.find(
      e => e.user_id === user.id && e.course_id === course.id && e.status === 'active'
    );
    if (existingActiveEnrollment) {
      const error = new Error('You are already actively enrolled in this course.');
      error.statusCode = 400;
      throw error;
    }

    // 4. Validate Recipient Phone
    const validPhones = ['0902 18 44 40', '0952 58 77 50', '0902184440', '0952587750', '+251902184440', '+251952587750'];
    const cleanRecipient = (recipientPhone || '').replace(/\s+/g, '').replace(/^\+251/, '0');
    if (!cleanRecipient || !['0902184440', '0952587750'].includes(cleanRecipient)) {
      const error = new Error('Please select a valid verified recipient phone number (0902 18 44 40 or 0952 58 77 50).');
      error.statusCode = 400;
      throw error;
    }
    const formattedRecipient = cleanRecipient === '0902184440' ? '0902 18 44 40' : '0952 58 77 50';

    // 5. Validate Transaction Reference
    const cleanRef = (transactionReference || '').trim().toUpperCase();
    if (!cleanRef || cleanRef.length < 4) {
      const error = new Error('A valid Telebirr transaction reference or receipt number is required (at least 4 characters).');
      error.statusCode = 400;
      throw error;
    }

    // Security check: prevent duplicates (case-insensitive) across non-rejected payments
    const existingRefPayment = store.payments.find(
      p => p.transaction_reference.toUpperCase() === cleanRef && p.status !== 'rejected'
    );
    if (existingRefPayment) {
      const error = new Error('This transaction reference has already been submitted and is currently being processed or approved.');
      error.statusCode = 409;
      throw error;
    }

    // Prevent duplicate pending submission by same user for same course
    const existingPending = store.payments.find(
      p => p.user_id === user.id && p.course_id === course.id && p.status === 'pending'
    );
    if (existingPending) {
      const error = new Error('You already have a pending payment verification for this course. Please wait for administrator approval or contact our desk.');
      error.statusCode = 409;
      throw error;
    }

    // 6. Record payment with PENDING status (Do NOT auto-grant access!)
    const orderRef = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment = {
      id: store.payments.length + 1,
      order_reference: orderRef,
      user_id: user.id,
      user_email: user.email,
      user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      user_phone: user.phone_number || (senderPhone || '').trim(),
      course_id: course.id,
      course_slug: course.slug,
      course_title_en: course.translations?.en?.title || 'Course',
      course_title_am: course.translations?.am?.title || 'ኮርስ',
      amount: course.price, // Trusted server price
      currency: 'ETB',
      payment_method: 'telebirr',
      telebirr_account_name: 'Tizta',
      recipient_phone: formattedRecipient,
      sender_phone: (senderPhone || '').trim(),
      sender_name: (senderName || '').trim(),
      transaction_reference: cleanRef,
      status: 'pending', // Pending Verification
      admin_notes: '',
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.payments.push(newPayment);

    // Also register an order reference in store.orders for record-keeping
    store.orders.push({
      id: store.orders.length + 1,
      order_reference: orderRef,
      user_id: user.id,
      course_id: course.id,
      total_amount: course.price,
      currency: 'ETB',
      status: 'pending',
      created_at: newPayment.created_at,
    });

    return {
      success: true,
      message: 'Payment details submitted successfully. Status is Pending Verification.',
      payment: newPayment,
    };
  }

  /**
   * Get all payments submitted by a specific user
   */
  static getUserPayments(userId) {
    const store = getStore();
    const uid = parseInt(userId, 10);
    return store.payments
      .filter(p => p.user_id === uid)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  /**
   * Check enrollment and payment status for a user and course
   */
  static getCoursePaymentStatus(userId, courseId) {
    const store = getStore();
    const uid = parseInt(userId, 10);
    const cId = parseInt(courseId, 10);

    const isEnrolled = store.enrollments.some(
      e => e.user_id === uid && e.course_id === cId && e.status === 'active'
    );

    const pendingPayment = store.payments.find(
      p => p.user_id === uid && p.course_id === cId && p.status === 'pending'
    );

    const approvedPayment = store.payments.find(
      p => p.user_id === uid && p.course_id === cId && p.status === 'approved'
    );

    const rejectedPayments = store.payments
      .filter(p => p.user_id === uid && p.course_id === cId && p.status === 'rejected')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      isEnrolled,
      hasPendingPayment: !!pendingPayment,
      pendingPayment: pendingPayment || null,
      approvedPayment: approvedPayment || null,
      lastRejectedPayment: rejectedPayments[0] || null,
    };
  }

  /**
   * Admin: List all submitted payments with filtering and stats
   */
  static getAllPaymentsAdmin({ status = 'all', search = '' } = {}) {
    const store = getStore();
    let payments = [...store.payments];

    if (status && status !== 'all') {
      payments = payments.filter(p => p.status === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      payments = payments.filter(p =>
        p.transaction_reference.toLowerCase().includes(q) ||
        p.user_email.toLowerCase().includes(q) ||
        p.user_name.toLowerCase().includes(q) ||
        p.course_title_en.toLowerCase().includes(q) ||
        (p.sender_phone && p.sender_phone.includes(q))
      );
    }

    // Sort newest first
    payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const totalCount = store.payments.length;
    const pendingCount = store.payments.filter(p => p.status === 'pending').length;
    const approvedCount = store.payments.filter(p => p.status === 'approved').length;
    const rejectedCount = store.payments.filter(p => p.status === 'rejected').length;

    return {
      payments,
      stats: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    };
  }

  /**
   * Admin: Approve a payment and GRANT course access
   */
  static approvePaymentAdmin(paymentId, adminUser, notes = '') {
    const store = getStore();
    const pid = parseInt(paymentId, 10);
    const payment = store.payments.find(p => p.id === pid);

    if (!payment) {
      const error = new Error('Payment record not found.');
      error.statusCode = 404;
      throw error;
    }

    if (payment.status === 'approved') {
      return { success: true, message: 'Payment was already approved.', payment };
    }

    payment.status = 'approved';
    payment.reviewed_by = adminUser.id;
    payment.reviewed_at = new Date().toISOString();
    payment.admin_notes = notes ? notes.trim() : 'Verified by Administrator';
    payment.updated_at = new Date().toISOString();

    // Update order status if exists
    const order = store.orders.find(o => o.order_reference === payment.order_reference);
    if (order) {
      order.status = 'completed';
    }

    // Grant or activate enrollment
    let enrollment = store.enrollments.find(
      e => e.user_id === payment.user_id && e.course_id === payment.course_id
    );

    if (enrollment) {
      enrollment.status = 'active';
    } else {
      enrollment = {
        id: store.enrollments.length + 1,
        user_id: payment.user_id,
        course_id: payment.course_id,
        status: 'active',
        enrolled_at: new Date().toISOString(),
      };
      store.enrollments.push(enrollment);
    }

    return {
      success: true,
      message: `Payment ${payment.transaction_reference} approved successfully. Course access granted to ${payment.user_name || payment.user_email}.`,
      payment,
      enrollment,
    };
  }

  /**
   * Admin: Reject a payment (Do NOT grant access)
   */
  static rejectPaymentAdmin(paymentId, adminUser, notes = '') {
    const store = getStore();
    const pid = parseInt(paymentId, 10);
    const payment = store.payments.find(p => p.id === pid);

    if (!payment) {
      const error = new Error('Payment record not found.');
      error.statusCode = 404;
      throw error;
    }

    payment.status = 'rejected';
    payment.reviewed_by = adminUser.id;
    payment.reviewed_at = new Date().toISOString();
    payment.admin_notes = notes ? notes.trim() : 'Transaction reference could not be verified on Telebirr records.';
    payment.updated_at = new Date().toISOString();

    // Update order status
    const order = store.orders.find(o => o.order_reference === payment.order_reference);
    if (order) {
      order.status = 'cancelled';
    }

    return {
      success: true,
      message: `Payment ${payment.transaction_reference} rejected.`,
      payment,
    };
  }
}

export default PaymentService;
