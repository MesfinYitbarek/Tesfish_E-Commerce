import crypto from 'crypto';
import PropertyRegistration from '../../models/PropertyRegistration.js';

export const chapaWebhook = async (req, res) => {
  try {
    console.log('=== Incoming Chapa Webhook ===');
    console.log('Headers:', req.headers);

    const signature = req.headers['x-chapa-signature'] || req.headers['chapa-signature'];

    // Use raw body
    const payload = req.body.toString('utf-8');

    const expectedSignature = crypto
      .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Invalid signature:', { signature, expectedSignature });
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    // Parse JSON after signature verification
    const body = JSON.parse(payload);
    const { tx_ref, status } = body;

    const registration = await PropertyRegistration.findOne({ 'payment.tx_ref': tx_ref });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.payment.paymentStatus = status === 'success' ? 'completed' : 'failed';
    if (status === 'success') registration.status = 'under-review';
    registration.payment.paymentDate = new Date();

    await registration.save();

    console.log('Webhook processed successfully:', tx_ref);
    return res.status(200).json({ success: true, message: 'Webhook processed' });

  } catch (err) {
    console.error('Chapa Webhook error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
