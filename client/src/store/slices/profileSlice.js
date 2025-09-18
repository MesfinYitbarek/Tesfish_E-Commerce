import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../../services/profileService';
import { toast } from 'react-hot-toast';

// ================= ASYNC THUNKS =================

// Get current user profile
export const getCurrentProfile = createAsyncThunk(
  'profile/getCurrentProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getCurrentProfile();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

// Get user profile by ID
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user profile';
      return rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData, profileImage }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(userId, profileData, profileImage);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update company profile
export const updateCompanyProfile = createAsyncThunk(
  'profile/updateCompanyProfile',
  async ({ userId, companyData, logo }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateCompanyProfile(userId, companyData, logo);
      toast.success('Company profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update company profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update individual profile
export const updateIndividualProfile = createAsyncThunk(
  'profile/updateIndividualProfile',
  async ({ userId, individualData, avatar }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateIndividualProfile(userId, individualData, avatar);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update customer profile
export const updateCustomerProfile = createAsyncThunk(
  'profile/updateCustomerProfile',
  async ({ userId, customerData, avatar }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateCustomerProfile(userId, customerData, avatar);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update notification settings
export const updateNotificationSettings = createAsyncThunk(
  'profile/updateNotificationSettings',
  async ({ userId, settings }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateNotificationSettings(userId, settings);
      toast.success('Notification settings updated');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update notification settings';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Wishlist operations
export const toggleWishlist = createAsyncThunk(
  'profile/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await profileService.toggleWishlist(productId);
      return { productId, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getWishlist = createAsyncThunk(
  'profile/getWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getWishlist();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch wishlist';
      return rejectWithValue(message);
    }
  }
);

// Payment methods
export const addPaymentMethod = createAsyncThunk(
  'profile/addPaymentMethod',
  async ({ userId, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await profileService.addPaymentMethod(userId, paymentMethod);
      toast.success('Payment method added successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add payment method';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  'profile/removePaymentMethod',
  async ({ userId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await profileService.removePaymentMethod(userId, paymentMethodId);
      toast.success('Payment method removed successfully');
      return { paymentMethodId, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove payment method';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ userId, passwordData }, { rejectWithValue }) => {
    try {
      const response = await profileService.changePassword(userId, passwordData);
      toast.success('Password changed successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Upload document
export const uploadDocument = createAsyncThunk(
  'profile/uploadDocument',
  async ({ userId, documentType, file }, { rejectWithValue }) => {
    try {
      const response = await profileService.uploadDocument(userId, documentType, file);
      toast.success('Document uploaded successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload document';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ================= INITIAL STATE =================
const initialState = {
  // Current user profile
  profile: null,
  
  // Viewed user profiles (for caching)
  viewedProfiles: {},
  
  // Wishlist
  wishlist: [],
  
  // Loading states
  isLoading: false,
  isUpdating: false,
  isUploadingDocument: false,
  
  // Error states
  error: null,
  updateError: null,
  
  // Success states
  updateSuccess: false,
  
  // Analytics
  analytics: {
    totalSales: 0,
    totalOrders: 0,
    totalListings: 0,
    totalMessages: 0,
  },
  
  // UI states
  activeTab: 'profile',
  showChangePassword: false,
  showAddPaymentMethod: false,
};

// ================= SLICE =================
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    
    // Clear success state
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    
    // Set active tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Toggle UI states
    toggleChangePassword: (state) => {
      state.showChangePassword = !state.showChangePassword;
    },
    
    toggleAddPaymentMethod: (state) => {
      state.showAddPaymentMethod = !state.showAddPaymentMethod;
    },
    
    // Update profile locally (optimistic updates)
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    
    // Add to wishlist locally
    addToWishlistLocally: (state, action) => {
      const productId = action.payload;
      if (!state.wishlist.find(item => item._id === productId)) {
        state.wishlist.push({ _id: productId });
      }
    },
    
    // Remove from wishlist locally
    removeFromWishlistLocally: (state, action) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(item => item._id !== productId);
    },
    
    // Clear profile (for logout)
    clearProfile: (state) => {
      state.profile = null;
      state.viewedProfiles = {};
      state.wishlist = [];
      state.analytics = initialState.analytics;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // ================= GET CURRENT PROFILE =================
      .addCase(getCurrentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.analytics = {
          totalSales: action.payload.user.totalSales || 0,
          totalOrders: action.payload.user.totalOrders || 0,
          totalListings: action.payload.user.totalListings || 0,
          totalMessages: action.payload.user.totalMessages || 0,
        };
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ================= GET USER PROFILE =================
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const user = action.payload.user;
        state.viewedProfiles[user._id] = user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ================= UPDATE PROFILE =================
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ================= UPDATE COMPANY PROFILE =================
      .addCase(updateCompanyProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ================= UPDATE INDIVIDUAL PROFILE =================
      .addCase(updateIndividualProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateIndividualProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updateIndividualProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ================= UPDATE CUSTOMER PROFILE =================
      .addCase(updateCustomerProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload.user;
        state.updateSuccess = true;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ================= UPDATE NOTIFICATION SETTINGS =================
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.notificationSettings = action.payload.user.notificationSettings;
        }
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ================= WISHLIST =================
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, message } = action.payload;
        
        if (message.includes('Added')) {
          // Add to wishlist
          if (!state.wishlist.find(item => item._id === productId)) {
            state.wishlist.push({ _id: productId });
          }
        } else {
          // Remove from wishlist
          state.wishlist = state.wishlist.filter(item => item._id !== productId);
        }
      })
      
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload.wishlist;
      })
      
      // ================= PAYMENT METHODS =================
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.paymentMethods = action.payload.user.paymentMethods;
        }
        state.showAddPaymentMethod = false;
      })
      
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.paymentMethods = action.payload.data.user.paymentMethods;
        }
      })
      
      // ================= CHANGE PASSWORD =================
      .addCase(changePassword.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isUpdating = false;
        state.showChangePassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ================= UPLOAD DOCUMENT =================
      .addCase(uploadDocument.pending, (state) => {
        state.isUploadingDocument = true;
        state.updateError = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploadingDocument = false;
        if (state.profile) {
          // Update profile with new document info
          state.profile = { ...state.profile, ...action.payload.user };
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploadingDocument = false;
        state.updateError = action.payload;
      });
  },
});

// ================= SELECTORS =================
export const selectProfile = (state) => state.profile.profile;
export const selectWishlist = (state) => state.profile.wishlist;
export const selectWishlistIds = (state) => state.profile.wishlist.map(item => item._id);
export const selectIsLoading = (state) => state.profile.isLoading;
export const selectIsUpdating = (state) => state.profile.isUpdating;
export const selectError = (state) => state.profile.error;
export const selectUpdateError = (state) => state.profile.updateError;
export const selectUpdateSuccess = (state) => state.profile.updateSuccess;
export const selectAnalytics = (state) => state.profile.analytics;
export const selectActiveTab = (state) => state.profile.activeTab;
export const selectShowChangePassword = (state) => state.profile.showChangePassword;
export const selectShowAddPaymentMethod = (state) => state.profile.showAddPaymentMethod;
export const selectIsUploadingDocument = (state) => state.profile.isUploadingDocument;

// Get viewed profile by ID
export const selectViewedProfile = (userId) => (state) => 
  state.profile.viewedProfiles[userId];

// Check if product is in wishlist
export const selectIsInWishlist = (productId) => (state) =>
  state.profile.wishlist.some(item => item._id === productId);

// Get profile completion percentage
export const selectProfileCompletion = (state) => {
  const profile = state.profile.profile;
  if (!profile) return 0;
  
  let completed = 0;
  const total = 10;
  
  if (profile.email) completed++;
  if (profile.isVerified) completed++;
  
  if (profile.userType === 'company' && profile.companyProfile) {
    const company = profile.companyProfile;
    if (company.companyName) completed++;
    if (company.description) completed++;
    if (company.logo) completed++;
    if (company.contactInfo?.phone) completed++;
    if (company.address?.city) completed++;
    if (company.businessCategories?.length) completed++;
  } else if (profile.userType === 'individual' && profile.individualProfile) {
    const individual = profile.individualProfile;
    if (individual.firstName) completed++;
    if (individual.lastName) completed++;
    if (individual.avatar) completed++;
    if (individual.phone) completed++;
    if (individual.address?.city) completed++;
  } else if (profile.userType === 'customer' && profile.customerProfile) {
    const customer = profile.customerProfile;
    if (customer.firstName) completed++;
    if (customer.lastName) completed++;
    if (customer.avatar) completed++;
    if (customer.phone) completed++;
    if (customer.addresses?.length) completed++;
  }
  
  return Math.round((completed / total) * 100);
};

// ================= ACTIONS =================
export const {
  clearError,
  clearUpdateSuccess,
  setActiveTab,
  toggleChangePassword,
  toggleAddPaymentMethod,
  updateProfileLocally,
  addToWishlistLocally,
  removeFromWishlistLocally,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;