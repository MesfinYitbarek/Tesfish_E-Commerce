// store/slices/appointmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentService from '../../services/appointmentService';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  // Appointments data
  appointments: [],
  myAppointments: [],
  myAssignments: [], // ✅ Employee assignments
  adminOverview: [], // ✅ Admin overview
  currentAppointment: null,
  
  // Employee and department data
  availableEmployees: [],
  departmentStats: [],
  employeeWorkload: [],
  
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
    monthlyStats: [],
    departmentStats: []
  },
  
  // Available slots
  availableSlots: [],
  
  // Loading states
  isLoading: false,
  isBooking: false,
  isUpdating: false,
  isRescheduling: false,
  isReassigning: false, // ✅ Reassigning state
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
    assignedTo: null, // ✅ Employee filter
    department: null, // ✅ Department filter
    past: false
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

// ✅ Get employee assignments
export const getMyAssignments = createAsyncThunk(
  'appointments/getMyAssignments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getMyAssignments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Get admin overview
export const getAdminOverview = createAsyncThunk(
  'appointments/getAdminOverview',
  async (params, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAdminOverview(params);
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

// ✅ Reassign appointment
export const reassignAppointment = createAsyncThunk(
  'appointments/reassignAppointment',
  async ({ appointmentId, assignmentData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.reassignAppointment(appointmentId, assignmentData);
      toast.success('Appointment reassigned successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to reassign appointment');
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

// ✅ Get available employees
export const getAvailableEmployees = createAsyncThunk(
  'appointments/getAvailableEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableEmployees();
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
        assignedTo: null,
        department: null,
        past: false
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
      
      // ✅ Update in myAssignments
      const assignmentIndex = state.myAssignments.findIndex(apt => apt._id === appointmentId);
      if (assignmentIndex !== -1) {
        state.myAssignments[assignmentIndex] = { ...state.myAssignments[assignmentIndex], ...updates };
      }
      
      // ✅ Update in adminOverview
      const adminIndex = state.adminOverview.findIndex(apt => apt._id === appointmentId);
      if (adminIndex !== -1) {
        state.adminOverview[adminIndex] = { ...state.adminOverview[adminIndex], ...updates };
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
      state.myAssignments = state.myAssignments.filter(apt => apt._id !== appointmentId);
      state.adminOverview = state.adminOverview.filter(apt => apt._id !== appointmentId);
    },

    // Add new appointment (for real-time updates)
    addAppointmentToList: (state, action) => {
      const newAppointment = action.payload;
      
      // Add to appropriate list based on user role
      if (newAppointment.customer === action.meta?.userId) {
        state.myAppointments.unshift(newAppointment);
      }
      if (newAppointment.assignedTo === action.meta?.userId) {
        state.myAssignments.unshift(newAppointment);
      }
      // Admin always sees in overview
      state.adminOverview.unshift(newAppointment);
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
      
      // ✅ Get my assignments (employee)
      .addCase(getMyAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAssignments = action.payload.appointments || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.stats.todayCount = action.payload.todayCount || 0;
        state.stats.upcomingCount = action.payload.upcomingCount || 0;
      })
      .addCase(getMyAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch assignments';
      })
      
      // ✅ Get admin overview
      .addCase(getAdminOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOverview = action.payload.appointments || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.departmentStats = action.payload.departmentStats || [];
        state.employeeWorkload = action.payload.employeeWorkload || [];
      })
      .addCase(getAdminOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch admin overview';
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
          // Update in all lists
          const updateInList = (list) => {
            const index = list.findIndex(apt => apt._id === updatedAppointment._id);
            if (index !== -1) {
              list[index] = updatedAppointment;
            }
          };
          
          updateInList(state.myAppointments);
          updateInList(state.myAssignments);
          updateInList(state.adminOverview);
          
          if (state.currentAppointment?._id === updatedAppointment._id) {
            state.currentAppointment = updatedAppointment;
          }
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || 'Failed to update appointment';
      })

      // ✅ Reassign appointment
      .addCase(reassignAppointment.pending, (state) => {
        state.isReassigning = true;
        state.error = null;
      })
      .addCase(reassignAppointment.fulfilled, (state, action) => {
        state.isReassigning = false;
        const updatedAppointment = action.payload.appointment;
        
        if (updatedAppointment) {
          // Update in admin overview
          const adminIndex = state.adminOverview.findIndex(apt => apt._id === updatedAppointment._id);
          if (adminIndex !== -1) {
            state.adminOverview[adminIndex] = updatedAppointment;
          }
          
          if (state.currentAppointment?._id === updatedAppointment._id) {
            state.currentAppointment = updatedAppointment;
          }
        }
      })
      .addCase(reassignAppointment.rejected, (state, action) => {
        state.isReassigning = false;
        state.error = action.payload?.message || 'Failed to reassign appointment';
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
          // Update in all lists
          const updateInList = (list) => {
            const index = list.findIndex(apt => apt._id === rescheduledAppointment._id);
            if (index !== -1) {
              list[index] = rescheduledAppointment;
            }
          };
          
          updateInList(state.myAppointments);
          updateInList(state.myAssignments);
          updateInList(state.adminOverview);
          
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
        if (action.payload.departmentStats) {
          state.stats.departmentStats = action.payload.departmentStats;
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

      // ✅ Get available employees
      .addCase(getAvailableEmployees.fulfilled, (state, action) => {
        state.availableEmployees = action.payload.employees || [];
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
export const selectMyAssignments = (state) => state.appointments.myAssignments; // ✅ Employee assignments
export const selectAdminOverview = (state) => state.appointments.adminOverview; // ✅ Admin overview
export const selectCurrentAppointment = (state) => state.appointments.currentAppointment;
export const selectAppointmentStats = (state) => state.appointments.stats;
export const selectAvailableSlots = (state) => state.appointments.availableSlots;
export const selectAppointmentFilters = (state) => state.appointments.filters;
export const selectAppointmentPagination = (state) => state.appointments.pagination;
export const selectAvailableEmployees = (state) => state.appointments.availableEmployees; // ✅ Employees
export const selectDepartmentStats = (state) => state.appointments.departmentStats; // ✅ Department stats
export const selectEmployeeWorkload = (state) => state.appointments.employeeWorkload; // ✅ Employee workload

// Loading selectors
export const selectIsBookingAppointment = (state) => state.appointments.isBooking;
export const selectIsLoadingAppointments = (state) => state.appointments.isLoading;
export const selectIsUpdatingAppointment = (state) => state.appointments.isUpdating;
export const selectIsReschedulingAppointment = (state) => state.appointments.isRescheduling;
export const selectIsReassigningAppointment = (state) => state.appointments.isReassigning; // ✅ Reassigning
export const selectIsLoadingSlots = (state) => state.appointments.isLoadingSlots;
export const selectIsExportingAppointments = (state) => state.appointments.isExporting;

// Error selectors
export const selectAppointmentError = (state) => state.appointments.error;
export const selectBookingError = (state) => state.appointments.bookingError;

// Legacy selectors for backward compatibility
export const selectAdminAppointments = selectAdminOverview; // For backward compatibility

export default appointmentSlice.reducer;