import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'CitiLights'
  },
  siteDescription: String,
  logo: String,
  favicon: String,
  
  // Email settings
  emailSettings: {
    fromEmail: String,
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPassword: String
  },
  
  // Payment settings
  paymentSettings: {
    stripePublicKey: String,
    stripeSecretKey: String,
    paypalClientId: String,
    paypalClientSecret: String,
    telebirrSettings: {
      appId: String,
      appKey: String,
      shortCode: String
    }
  },
  
  // Platform settings
  platformSettings: {
    commissionRate: {
      type: Number,
      default: 0.03 // 3%
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    taxRate: {
      type: Number,
      default: 0.15 // 15%
    },
    allowUserRegistration: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    }
  },
  
  // Social media links
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  
  // SEO settings
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    googleAnalyticsId: String,
    facebookPixelId: String
  },
  
  // Notification settings
  notificationSettings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    pushNotifications: {
      type: Boolean,
      default: true
    }
  },
  
  // Terms and policies
  termsAndConditions: String,
  privacyPolicy: String,
  returnPolicy: String,
  
  // Maintenance mode
  maintenanceMode: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);