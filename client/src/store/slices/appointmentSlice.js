import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointmentService';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  // Appointments data
  appointments: [],
  myAppointments: [],
  sellerAppointments: [],
  currentAppointment: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  },
  
  // Statistics
  stats: {
    todayCount: 0,
    totalAppointments: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0
  },
  
  // Available slots
  availableSlots: [],
  
  // Loading states
  isLoading: false,
  isBooking: false,
  isUpdating: false,
  isRescheduling: false,
  isLoadingSlots: false,
  
  // Error handling
  error: null,
  bookingError: null,
  
  // Filters
  filters: {
    status: 'all',
    upcoming: false,
    date: null,
    property: null
  }
};

// Async thunks

// Book appointment
export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.bookAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
      return rejectWithValue(error);
    }
  }
);

// Get customer appointments
export const getMyAppointments = createAsyncThunk(
  'appointments/getMyAppointments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getMyAppointments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Get seller appointments
export const getSellerAppointments = createAsyncThunk(
  'appointments/getSellerAppointments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getSellerAppointments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async ({ appointmentId, statusData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointmentStatus(appointmentId, statusData);
      toast.success(`Appointment status updated to ${statusData.status}`);
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update appointment status');
      return rejectWithValue(error);
    }
  }
);

// Reschedule appointment
export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ appointmentId, rescheduleData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.rescheduleAppointment(appointmentId, rescheduleData);
      toast.success('Appointment rescheduled successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to reschedule appointment');
      return rejectWithValue(error);
    }
  }
);

// Get appointment details
export const getAppointmentDetails = createAsyncThunk(
  'appointments/getAppointmentDetails',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentDetails(appointmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Cancel appointment
export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ appointmentId, reason }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.cancelAppointment(appointmentId, reason);
      toast.success('Appointment cancelled successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to cancel appointment');
      return rejectWithValue(error);
    }
  }
);

// Get available slots
export const getAvailableSlots = createAsyncThunk(
  'appointments/getAvailableSlots',
  async ({ propertyId, date }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableSlots(propertyId, date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Get appointment stats
export const getAppointmentStats = createAsyncThunk(
  'appointments/getAppointmentStats',
  async (period, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentStats(period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.bookingError = null;
    },
    
    // Clear current appointment
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        status: 'all',
        upcoming: false,
        date: null,
        property: null
      };
    },
    
    // Clear available slots
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
    
    // Update appointment in list (for real-time updates)
    updateAppointmentInList: (state, action) => {
      const { appointmentId, updates } = action.payload;
      
      // Update in myAppointments
      const myIndex = state.myAppointments.findIndex(apt => apt._id === appointmentId);
      if (myIndex !== -1) {
        state.myAppointments[myIndex] = { ...state.myAppointments[myIndex], ...updates };
      }
      
      // Update in sellerAppointments
      const sellerIndex = state.sellerAppointments.findIndex(apt => apt._id === appointmentId);
      if (sellerIndex !== -1) {
        state.sellerAppointments[sellerIndex] = { ...state.sellerAppointments[sellerIndex], ...updates };
      }
      
      // Update current appointment if it matches
      if (state.currentAppointment?._id === appointmentId) {
        state.currentAppointment = { ...state.currentAppointment, ...updates };
      }
    },
    
    // Remove appointment from list
    removeAppointmentFromList: (state, action) => {
      const appointmentId = action.payload;
      state.myAppointments = state.myAppointments.filter(apt => apt._id !== appointmentId);
      state.sellerAppointments = state.sellerAppointments.filter(apt => apt._id !== appointmentId);
    }
  },
  extraReducers: (builder) => {
    builder
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.isBooking = true;
        state.bookingError = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isBooking = false;
        state.myAppointments.unshift(action.payload.appointment);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isBooking = false;
        state.bookingError = action.payload?.message || 'Failed to book appointment';
      })
      
      // Get my appointments
      .addCase(getMyAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAppointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch appointments';
      })
      
      // Get seller appointments
      .addCase(getSellerAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSellerAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellerAppointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
        state.stats.todayCount = action.payload.todayCount || 0;
      })
      .addCase(getSellerAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch appointments';
      })
      
      // Update appointment status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedAppointment = action.payload.appointment;
        
        // Update in both lists
        const myIndex = state.myAppointments.findIndex(apt => apt._id === updatedAppointment._id);
        if (myIndex !== -1) {
          state.myAppointments[myIndex] = updatedAppointment;
        }
        
        const sellerIndex = state.sellerAppointments.findIndex(apt => apt._id === updatedAppointment._id);
        if (sellerIndex !== -1) {
          state.sellerAppointments[sellerIndex] = updatedAppointment;
        }
        
        if (state.currentAppointment?._id === updatedAppointment._id) {
          state.currentAppointment = updatedAppointment;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Failed to update appointment';
      })
      
      // Reschedule appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.isRescheduling = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isRescheduling = false;
        const rescheduledAppointment = action.payload.appointment;
        
        // Update in both lists
        const myIndex = state.myAppointments.findIndex(apt => apt._id === rescheduledAppointment._id);
        if (myIndex !== -1) {
          state.myAppointments[myIndex] = rescheduledAppointment;
        }
        
        const sellerIndex = state.sellerAppointments.findIndex(apt => apt._id === rescheduledAppointment._id);
        if (sellerIndex !== -1) {
          state.sellerAppointments[sellerIndex] = rescheduledAppointment;
        }
        
        if (state.currentAppointment?._id === rescheduledAppointment._id) {
          state.currentAppointment = rescheduledAppointment;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.isRescheduling = false;
        state.error = action.payload?.message || 'Failed to reschedule appointment';
      })
      
      // Get appointment details
      .addCase(getAppointmentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAppointmentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAppointment = action.payload.appointment;
      })
      .addCase(getAppointmentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch appointment details';
      })
      
      // Cancel appointment
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const cancelledAppointment = action.payload.appointment;
        
        // Update in both lists
        const myIndex = state.myAppointments.findIndex(apt => apt._id === cancelledAppointment._id);
        if (myIndex !== -1) {
          state.myAppointments[myIndex] = cancelledAppointment;
        }
        
        const sellerIndex = state.sellerAppointments.findIndex(apt => apt._id === cancelledAppointment._id);
        if (sellerIndex !== -1) {
          state.sellerAppointments[sellerIndex] = cancelledAppointment;
        }
      })
      
      // Get available slots
      .addCase(getAvailableSlots.pending, (state) => {
        state.isLoadingSlots = true;
        state.error = null;
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.isLoadingSlots = false;
        state.availableSlots = action.payload.slots || [];
      })
      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.isLoadingSlots = false;
        state.error = action.payload?.message || 'Failed to fetch available slots';
      })
      
      // Get appointment stats
      .addCase(getAppointmentStats.fulfilled, (state, action) => {
        state.stats = { ...state.stats, ...action.payload.stats };
      });
  }
});

// Export actions
export const {
  clearError,
  clearCurrentAppointment,
  updateFilters,
  resetFilters,
  clearAvailableSlots,
  updateAppointmentInList,
  removeAppointmentFromList
} = appointmentSlice.actions;

// Selectors
export const selectAppointments = (state) => state.appointments;
export const selectMyAppointments = (state) => state.appointments.myAppointments;
export const selectSellerAppointments = (state) => state.appointments.sellerAppointments;
export const selectCurrentAppointment = (state) => state.appointments.currentAppointment;
export const selectAppointmentStats = (state) => state.appointments.stats;
export const selectAvailableSlots = (state) => state.appointments.availableSlots;
export const selectAppointmentFilters = (state) => state.appointments.filters;
export const selectAppointmentPagination = (state) => state.appointments.pagination;

// Loading selectors
export const selectIsBookingAppointment = (state) => state.appointments.isBooking;
export const selectIsLoadingAppointments = (state) => state.appointments.isLoading;
export const selectIsUpdatingAppointment = (state) => state.appointments.isUpdating;
export const selectIsReschedulingAppointment = (state) => state.appointments.isRescheduling;
export const selectIsLoadingSlots = (state) => state.appointments.isLoadingSlots;

// Error selectors
export const selectAppointmentError = (state) => state.appointments.error;
export const selectBookingError = (state) => state.appointments.bookingError;

export default appointmentSlice.reducer;