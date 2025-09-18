import api from './api';

class ProfileService {
  // Get current user profile
  async getCurrentProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }

  // Update user profile
  async updateProfile(userId, profileData, profileImage = null) {
    const formData = new FormData();
    
    // Add profile data to FormData
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        if (typeof profileData[key] === 'object') {
          formData.append(key, JSON.stringify(profileData[key]));
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });

    // Add profile image if provided
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const response = await api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update company profile
  async updateCompanyProfile(userId, companyData, logo = null) {
    const formData = new FormData();
    
    // Structure company profile data
    const profileData = {
      companyProfile: {
        ...companyData
      }
    };

    Object.keys(profileData).forEach(key => {
      formData.append(key, JSON.stringify(profileData[key]));
    });

    if (logo) {
      formData.append('profileImage', logo);
    }

    const response = await api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update individual profile
  async updateIndividualProfile(userId, individualData, avatar = null) {
    const formData = new FormData();
    
    const profileData = {
      individualProfile: {
        ...individualData
      }
    };

    Object.keys(profileData).forEach(key => {
      formData.append(key, JSON.stringify(profileData[key]));
    });

    if (avatar) {
      formData.append('profileImage', avatar);
    }

    const response = await api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update customer profile
  async updateCustomerProfile(userId, customerData, avatar = null) {
    const formData = new FormData();
    
    const profileData = {
      customerProfile: {
        ...customerData
      }
    };

    Object.keys(profileData).forEach(key => {
      formData.append(key, JSON.stringify(profileData[key]));
    });

    if (avatar) {
      formData.append('profileImage', avatar);
    }

    const response = await api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update notification settings
  async updateNotificationSettings(userId, settings) {
    const response = await api.put(`/users/${userId}`, {
      notificationSettings: settings
    });
    return response.data;
  }

  // Add payment method
  async addPaymentMethod(userId, paymentMethod) {
    const response = await api.put(`/users/${userId}`, {
      $push: { paymentMethods: paymentMethod }
    });
    return response.data;
  }

  // Remove payment method
  async removePaymentMethod(userId, paymentMethodId) {
    const response = await api.put(`/users/${userId}`, {
      $pull: { paymentMethods: { _id: paymentMethodId } }
    });
    return response.data;
  }

  // Update subscription
  async updateSubscription(userId, subscriptionData) {
    const response = await api.put(`/users/${userId}`, {
      subscriptionStatus: subscriptionData.status,
      subscriptionExpiry: subscriptionData.expiry
    });
    return response.data;
  }

  // Wishlist operations
  async toggleWishlist(productId) {
    const response = await api.post(`/users/wishlist/${productId}`);
    return response.data;
  }

  async getWishlist() {
    const response = await api.get('/users/wishlist');
    return response.data;
  }

  // Get user analytics
  async getUserAnalytics(userId) {
    const response = await api.get(`/users/${userId}/analytics`);
    return response.data;
  }

  // Change password
  async changePassword(userId, passwordData) {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  }

  // Delete account
  async deleteAccount(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }

  // Verify email
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  }

  // Request email verification
  async requestEmailVerification() {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  }

  // Upload profile documents
  async uploadDocument(userId, documentType, file) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await api.post(`/users/${userId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get user listings
  async getUserListings(userId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/users/${userId}/listings?${queryParams}`);
    return response.data;
  }

  // Get user orders
  async getUserOrders(userId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/users/${userId}/orders?${queryParams}`);
    return response.data;
  }

  // Get user messages
  async getUserMessages(userId, params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/users/${userId}/messages?${queryParams}`);
    return response.data;
  }

  // Report user
  async reportUser(userId, reportData) {
    const response = await api.post(`/users/${userId}/report`, reportData);
    return response.data;
  }

  // Block/Unblock user
  async toggleBlockUser(userId) {
    const response = await api.post(`/users/${userId}/toggle-block`);
    return response.data;
  }

  // Get blocked users
  async getBlockedUsers() {
    const response = await api.get('/users/blocked');
    return response.data;
  }
}

export default new ProfileService();