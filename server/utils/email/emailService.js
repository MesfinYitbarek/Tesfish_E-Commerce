import nodemailer from 'nodemailer';
import { emailTemplates } from './emailTemplates.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
export const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();
    
    const html = emailTemplates[template] ? emailTemplates[template](data) : data.html;
    
    const mailOptions = {
      from: `CitiLights <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
export const sendBulkEmail = async (emails) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const email of emails) {
      try {
        const html = emailTemplates[email.template] ? 
          emailTemplates[email.template](email.data) : email.data.html;
        
        const mailOptions = {
          from: `CitiLights <${process.env.EMAIL_FROM}>`,
          to: email.to,
          subject: email.subject,
          html
        };

        const result = await transporter.sendMail(mailOptions);
        results.push({ email: email.to, success: true, messageId: result.messageId });
      } catch (error) {
        results.push({ email: email.to, success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Bulk email send error:', error);
    throw error;
  }
};