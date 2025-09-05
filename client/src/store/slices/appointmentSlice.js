// store/slices/appointmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointmentService';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  // Appointments data
  appointments: [],
  myAppointments: [],
  adminAppointments: [], // Renamed from sellerAppointments
  currentAppointment: null,
  
  // Admin-specific data
  propertyOwners: [],
  availableAdmins: [],
  
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
    upcomingCount: 0,
    totalAppointments: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    noShowCount: 0,
    statusStats: [],
    monthlyStats: []
  },
  
  // Available slots
  availableSlots: [],
  
  // Loading states
  isLoading: false,
  isBooking: false,
  isUpdating: false,
  isRescheduling: false,
  isAssigning: false,
  isLoadingSlots: false,
  isExporting: false,
  
  // Error handling
  error: null,
  bookingError: null,
  
  // Filters
  filters: {
    status: 'all',
    upcoming: false,
    date: null,
    property: null,
    propertyOwner: null
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

// Get admin appointments (renamed from getSellerAppointments)
export const getAdminAppointments = createAsyncThunk(
  'appointments/getAdminAppointments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAdminAppointments(params);
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

// Assign appointment to admin
export const assignAppointmentToAdmin = createAsyncThunk(
  'appointments/assignAppointmentToAdmin',
  async ({ appointmentId, assignmentData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.assignAppointmentToAdmin(appointmentId, assignmentData);
      toast.success('Appointment assigned successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to assign appointment');
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

// Confirm appointment
export const confirmAppointment = createAsyncThunk(
  'appointments/confirmAppointment',
  async ({ appointmentId, notes }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.confirmAppointment(appointmentId, notes);
      toast.success('Appointment confirmed!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to confirm appointment');
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

// Complete appointment
export const completeAppointment = createAsyncThunk(
  'appointments/completeAppointment',
  async ({ appointmentId, completionData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.completeAppointment(appointmentId, completionData);
      toast.success('Appointment marked as completed!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to complete appointment');
      return rejectWithValue(error);
    }
  }
);

// Mark as no-show
export const markNoShow = createAsyncThunk(
  'appointments/markNoShow',
  async ({ appointmentId, reason }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.markNoShow(appointmentId, reason);
      toast.success('Appointment marked as no-show');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to mark as no-show');
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

// Export appointments CSV
export const exportAppointmentsCSV = createAsyncThunk(
  'appointments/exportAppointmentsCSV',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.exportAppointmentsCSV();
      toast.success('Appointments exported successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to export appointments');
      return rejectWithValue(error);
    }
  }
);

// Get available admins
export const getAvailableAdmins = createAsyncThunk(
  'appointments/getAvailableAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableAdmins();
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
        property: null,
        propertyOwner: null
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
      
      // Update in adminAppointments
      const adminIndex = state.adminAppointments.findIndex(apt => apt._id === appointmentId);
      if (adminIndex !== -1) {
        state.adminAppointments[adminIndex] = { ...state.adminAppointments[adminIndex], ...updates };
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
      state.adminAppointments = state.adminAppointments.filter(apt => apt._id !== appointmentId);
    },

    // Add new appointment (for real-time updates)
    addAppointmentToList: (state, action) => {
      const newAppointment = action.payload;
      
      // Add to appropriate list based on user role
      if (newAppointment.customer === action.meta?.userId) {
        state.myAppointments.unshift(newAppointment);
      }
      if (newAppointment.seller === action.meta?.userId) {
        state.adminAppointments.unshift(newAppointment);
      }
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
        if (action.payload.appointment) {
          state.myAppointments.unshift(action.payload.appointment);
        }
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
        state.myAppointments = action.payload.appointments || [];
        state.pagination = action.payload.pagination || state.pagination;
        
        // Update stats if provided
        if (action.payload.stats) {
          const statsMap = {};
          action.payload.stats.forEach(stat => {
            statsMap[stat._id] = stat.count;
          });
          state.stats = { ...state.stats, ...statsMap };
        }
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch appointments';
      })
      
      // Get admin appointments
      .addCase(getAdminAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminAppointments = action.payload.appointments || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.stats.todayCount = action.payload.todayCount || 0;
        state.stats.upcomingCount = action.payload.upcomingCount || 0;
        state.propertyOwners = action.payload.propertyOwners || [];
      })
      .addCase(getAdminAppointments.rejected, (state, action) => {
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
        
        if (updatedAppointment) {
          // Update in both lists
          const myIndex = state.myAppointments.findIndex(apt => apt._id === updatedAppointment._id);
          if (myIndex !== -1) {
            state.myAppointments[myIndex] = updatedAppointment;
          }
          
          const adminIndex = state.adminAppointments.findIndex(apt => apt._id === updatedAppointment._id);
          if (adminIndex !== -1) {
            state.adminAppointments[adminIndex] = updatedAppointment;
          }
          
          if (state.currentAppointment?._id === updatedAppointment._id) {
            state.currentAppointment = updatedAppointment;
          }
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Failed to update appointment';
      })

      // Assign appointment to admin
      .addCase(assignAppointmentToAdmin.pending, (state) => {
        state.isAssigning = true;
        state.error = null;
      })
      .addCase(assignAppointmentToAdmin.fulfilled, (state, action) => {
        state.isAssigning = false;
        const updatedAppointment = action.payload.appointment;
        
        if (updatedAppointment) {
          const adminIndex = state.adminAppointments.findIndex(apt => apt._id === updatedAppointment._id);
          if (adminIndex !== -1) {
            state.adminAppointments[adminIndex] = updatedAppointment;
          }
          
          if (state.currentAppointment?._id === updatedAppointment._id) {
            state.currentAppointment = updatedAppointment;
          }
        }
      })
      .addCase(assignAppointmentToAdmin.rejected, (state, action) => {
        state.isAssigning = false;
        state.error = action.payload?.message || 'Failed to assign appointment';
      })
      
      // Reschedule appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.isRescheduling = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isRescheduling = false;
        const rescheduledAppointment = action.payload.appointment;
        
        if (rescheduledAppointment) {
          // Update in both lists
          const myIndex = state.myAppointments.findIndex(apt => apt._id === rescheduledAppointment._id);
          if (myIndex !== -1) {
            state.myAppointments[myIndex] = rescheduledAppointment;
          }
          
          const adminIndex = state.adminAppointments.findIndex(apt => apt._id === rescheduledAppointment._id);
          if (adminIndex !== -1) {
            state.adminAppointments[adminIndex] = rescheduledAppointment;
          }
          
          if (state.currentAppointment?._id === rescheduledAppointment._id) {
            state.currentAppointment = rescheduledAppointment;
          }
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
      
      // All status update actions (confirm, cancel, complete, no-show)
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        const updatedAppointment = action.payload.appointment;
        if (updatedAppointment) {
          appointmentSlice.caseReducers.updateAppointmentStatus.fulfilled(state, { payload: action.payload });
        }
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const updatedAppointment = action.payload.appointment;
        if (updatedAppointment) {
          appointmentSlice.caseReducers.updateAppointmentStatus.fulfilled(state, { payload: action.payload });
        }
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        const updatedAppointment = action.payload.appointment;
        if (updatedAppointment) {
          appointmentSlice.caseReducers.updateAppointmentStatus.fulfilled(state, { payload: action.payload });
        }
      })
      .addCase(markNoShow.fulfilled, (state, action) => {
        const updatedAppointment = action.payload.appointment;
        if (updatedAppointment) {
          appointmentSlice.caseReducers.updateAppointmentStatus.fulfilled(state, { payload: action.payload });
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
        if (action.payload.statusStats) {
          state.stats.statusStats = action.payload.statusStats;
        }
        if (action.payload.monthlyStats) {
          state.stats.monthlyStats = action.payload.monthlyStats;
        }
      })

      // Export appointments CSV
      .addCase(exportAppointmentsCSV.pending, (state) => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportAppointmentsCSV.fulfilled, (state) => {
        state.isExporting = false;
      })
      .addCase(exportAppointmentsCSV.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload?.message || 'Failed to export appointments';
      })

      // Get available admins
      .addCase(getAvailableAdmins.fulfilled, (state, action) => {
        state.availableAdmins = action.payload.admins || [];
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
  removeAppointmentFromList,
  addAppointmentToList
} = appointmentSlice.actions;

// Selectors
export const selectAppointments = (state) => state.appointments;
export const selectMyAppointments = (state) => state.appointments.myAppointments;
export const selectAdminAppointments = (state) => state.appointments.adminAppointments; // Renamed
export const selectCurrentAppointment = (state) => state.appointments.currentAppointment;
export const selectAppointmentStats = (state) => state.appointments.stats;
export const selectAvailableSlots = (state) => state.appointments.availableSlots;
export const selectAppointmentFilters = (state) => state.appointments.filters;
export const selectAppointmentPagination = (state) => state.appointments.pagination;
export const selectPropertyOwners = (state) => state.appointments.propertyOwners;
export const selectAvailableAdmins = (state) => state.appointments.availableAdmins;

// Loading selectors
export const selectIsBookingAppointment = (state) => state.appointments.isBooking;
export const selectIsLoadingAppointments = (state) => state.appointments.isLoading;
export const selectIsUpdatingAppointment = (state) => state.appointments.isUpdating;
export const selectIsReschedulingAppointment = (state) => state.appointments.isRescheduling;
export const selectIsAssigningAppointment = (state) => state.appointments.isAssigning;
export const selectIsLoadingSlots = (state) => state.appointments.isLoadingSlots;
export const selectIsExportingAppointments = (state) => state.appointments.isExporting;

// Error selectors
export const selectAppointmentError = (state) => state.appointments.error;
export const selectBookingError = (state) => state.appointments.bookingError;

export default appointmentSlice.reducer;