export const emailTemplates = {
  emailVerification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; }
            .button { display: inline-block; background: #5D5CDE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to CitiLights!</h1>
            </div>
            <div class="content">
                <h2>Hello ${data.name},</h2>
                <p>Thank you for registering with CitiLights. Please verify your email address to complete your registration.</p>
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
                <p>This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 CitiLights. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `,

  passwordReset: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; }
            .button { display: inline-block; background: #5D5CDE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hello ${data.name},</h2>
                <p>You requested a password reset for your CitiLights account.</p>
                <a href="${data.resetUrl}" class="button">Reset Password</a>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
                <p>This link will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 CitiLights. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `,


  orderConfirmation: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; }
            .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
            </div>
            <div class="content">
                <h2>Hello ${data.customerName},</h2>
                <p>Thank you for your order! We've received your order and are processing it.</p>
                <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> ${data.orderNumber}</p>
                    <p><strong>Total Amount:</strong> ETB ${data.total}</p>
                </div>
                <p>You will receive another email once your order has been shipped.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 CitiLights. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
  ,
  serviceInquiryNotification: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Service Inquiry</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .button { display: inline-block; background: #5D5CDE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .project-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>New Service Inquiry</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.providerName},</h2>
              <p>You have received a new service inquiry from <strong>${data.customerName}</strong>.</p>
              
              <div class="project-details">
                  <h3>Project Details</h3>
                  <p><strong>Service Type:</strong> ${data.serviceType}</p>
                  <p><strong>Project Title:</strong> ${data.projectTitle}</p>
                  <p><strong>Description:</strong> ${data.projectDescription}</p>
              </div>
              
              <a href="${data.inquiryUrl}" class="button">View Full Inquiry</a>
              
              <p>Please review the inquiry and respond to the customer as soon as possible.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

serviceInquiryConfirmation: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Service Inquiry Confirmation</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Inquiry Submitted Successfully</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.customerName},</h2>
              <p>Your service inquiry has been successfully submitted to <strong>${data.providerName}</strong>.</p>
              
              <p><strong>Service Type:</strong> ${data.serviceType}</p>
              <p><strong>Project:</strong> ${data.projectTitle}</p>
              
              <p>The service provider will review your inquiry and get back to you soon. You will receive an email notification when they respond.</p>
              
              <p>Thank you for using CitiLights!</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

serviceQuoteReceived: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quote Received</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .button { display: inline-block; background: #5D5CDE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .quote-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; }
          .quote-amount { font-size: 24px; font-weight: bold; color: #5D5CDE; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Quote Received</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.customerName},</h2>
              <p>Great news! <strong>${data.providerName}</strong> has submitted a quote for your project.</p>
              
              <p><strong>Project:</strong> ${data.projectTitle}</p>
              
              <div class="quote-details">
                  <p>Quote Amount</p>
                  <div class="quote-amount">${data.currency} ${data.quoteAmount}</div>
                  <p><small>Valid until: ${data.validUntil}</small></p>
              </div>
              
              <a href="${data.inquiryUrl}" class="button">View Full Quote</a>
              
              <p>Please review the quote details and terms. You can accept, negotiate, or decline the quote through your dashboard.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

serviceInquiryStatusUpdate: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Service Inquiry Update</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .button { display: inline-block; background: #5D5CDE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .status-badge { background: #e7f3ff; color: #0066cc; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Service Inquiry Update</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.recipientName},</h2>
              <p>There has been an update to your service inquiry for the project <strong>"${data.projectTitle}"</strong>.</p>
              
              <p>Status: <span class="status-badge">${data.status.toUpperCase()}</span></p>
              
              ${data.note ? `<p><strong>Note:</strong> ${data.note}</p>` : ''}
              
              <a href="${data.inquiryUrl}" class="button">View Inquiry Details</a>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

bookingConfirmation: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Booking Confirmed</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.customerName},</h2>
              <p>Your booking has been confirmed with <strong>${data.sellerName}</strong>.</p>
              
              <div class="booking-details">
                  <h3>Booking Details</h3>
                  <p><strong>Type:</strong> ${data.bookingType}</p>
                  <p><strong>Date:</strong> ${data.appointmentDate}</p>
                  <p><strong>Time:</strong> ${data.appointmentTime}</p>
              </div>
              
              <p>Please arrive on time for your appointment. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

newBookingNotification: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Request</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>New Booking Request</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.sellerName},</h2>
              <p>You have received a new booking request from <strong>${data.customerName}</strong>.</p>
              
              <div class="booking-details">
                  <h3>Booking Details</h3>
                  <p><strong>Type:</strong> ${data.bookingType}</p>
                  <p><strong>Date:</strong> ${data.appointmentDate}</p>
                  <p><strong>Time:</strong> ${data.appointmentTime}</p>
              </div>
              
              <p>Please confirm or reschedule this booking through your dashboard.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`,

bookingStatusUpdate: (data) => `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #5D5CDE; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 20px; }
          .status-badge { background: #e7f3ff; color: #0066cc; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Booking Update</h1>
          </div>
          <div class="content">
              <h2>Hello ${data.customerName},</h2>
              <p>Your booking scheduled for <strong>${data.appointmentDate}</strong> with <strong>${data.sellerName}</strong> has been updated.</p>
              
              <p>Status: <span class="status-badge">${data.status.toUpperCase()}</span></p>
              
              ${data.sellerNotes ? `<p><strong>Note:</strong> ${data.sellerNotes}</p>` : ''}
              
              <p>If you have any questions, please contact the service provider directly.</p>
          </div>
          <div class="footer">
              <p>&copy; 2024 CitiLights. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`
};