// @desc Handle Chapa Webhook
// @route POST /api/chapa/webhook
// @access Public (Chapa calls it)
import crypto from "crypto";

export const chapaWebhook = async (req, res) => {
  try {
    const signature = req.headers["chapa-signature"];
    const payload = JSON.stringify(req.body);

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(401).json({ success: false, message: "Invalid signature" });
    }

    const { tx_ref, status } = req.body;

    // Find the registration using tx_ref
    const registration = await PropertyRegistration.findOne({
      "payment.transactionId": tx_ref,
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    if (status === "success") {
      registration.payment.paymentStatus = "completed";
      registration.payment.paymentDate = new Date();
      registration.status = "under-review";
    } else {
      registration.payment.paymentStatus = "failed";
    }

    await registration.save();

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Chapa Webhook error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
