// store/slices/serviceInquirySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  inquiries: [],
  myInquiries: [],
  currentInquiry: null,
  stats: {
    overview: {},
    statusDistribution: [],
    serviceTypeDistribution: [],
    monthlyTrend: [],
    adminWorkload: []
  },
  filters: {            // <-- Add filters state
    status: '',
    serviceType: '',
    assignedAdmin: '',
    priority: '',
    search: ''
  },
  isLoading: false,
  isSubmitting: false,
  error: null
};

// Async thunks
export const createServiceInquiry = createAsyncThunk(
  'serviceInquiry/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/service-inquiries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service inquiry');
    }
  }
);

export const fetchMyInquiries = createAsyncThunk(
  'serviceInquiry/fetchMy',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/service-inquiries/my-inquiries', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inquiries');
    }
  }
);

export const fetchProviderInquiries = createAsyncThunk(
  'serviceInquiry/fetchProvider',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/service-inquiries/provider/inquiries', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch provider inquiries');
    }
  }
);

export const fetchInquiry = createAsyncThunk(
  'serviceInquiry/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/service-inquiries/${id}`);
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inquiry');
    }
  }
);

export const updateInquiryStatus = createAsyncThunk(
  'serviceInquiry/updateStatus',
  async ({ inquiryId, status, note, assignToMe }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/service-inquiries/${inquiryId}/status`, {
        status,
        note,
        assignToMe
      });
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const submitQuote = createAsyncThunk(
  'serviceInquiry/submitQuote',
  async ({ inquiryId, quoteData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/service-inquiries/${inquiryId}/quote`, quoteData);
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quote');
    }
  }
);

export const respondToQuote = createAsyncThunk(
  'serviceInquiry/respondToQuote',
  async ({ inquiryId, quoteId, action, message }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/service-inquiries/${inquiryId}/quotes/${quoteId}/respond`, {
        action,
        message
      });
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to quote');
    }
  }
);

export const addMessage = createAsyncThunk(
  'serviceInquiry/addMessage',
  async ({ inquiryId, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/service-inquiries/${inquiryId}/message`, { message });
      return response.data.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const scheduleConsultation = createAsyncThunk(
  'serviceInquiry/scheduleConsultation',
  async ({ inquiryId, consultationData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/service-inquiries/${inquiryId}/consultation`, consultationData);
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to schedule consultation');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'serviceInquiry/fetchStats',
  async (period = '30d', { rejectWithValue }) => {
    try {
      const response = await api.get('/service-inquiries/provider/stats', {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const assignInquiry = createAsyncThunk(
  'serviceInquiry/assign',
  async ({ inquiryId, adminId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/service-inquiries/${inquiryId}/assign`, { adminId });
      return response.data.data.inquiry;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign inquiry');
    }
  }
);

const serviceInquirySlice = createSlice({
  name: 'serviceInquiry',
  initialState,
  reducers: {
    clearCurrentInquiry: (state) => {
      state.currentInquiry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateInquiryInList: (state, action) => {
      const updatedInquiry = action.payload;
      const inquiryIndex = state.inquiries.findIndex(i => i._id === updatedInquiry._id);
      if (inquiryIndex !== -1) state.inquiries[inquiryIndex] = updatedInquiry;

      const myInquiryIndex = state.myInquiries.findIndex(i => i._id === updatedInquiry._id);
      if (myInquiryIndex !== -1) state.myInquiries[myInquiryIndex] = updatedInquiry;

      if (state.currentInquiry?._id === updatedInquiry._id) {
        state.currentInquiry = updatedInquiry;
      }
    },
    setFilters: (state, action) => {   // <-- Add this reducer
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Service Inquiry
      .addCase(createServiceInquiry.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createServiceInquiry.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.myInquiries.unshift(action.payload);
      })
      .addCase(createServiceInquiry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Fetch My Inquiries
      .addCase(fetchMyInquiries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyInquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myInquiries = action.payload.inquiries;
      })
      .addCase(fetchMyInquiries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Provider Inquiries
      .addCase(fetchProviderInquiries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviderInquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiries = action.payload.inquiries;

        // Update stats with status counts
        state.stats.statusDistribution = action.payload.statusCounts || [];
      })
      .addCase(fetchProviderInquiries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Single Inquiry
      .addCase(fetchInquiry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInquiry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInquiry = action.payload;
      })
      .addCase(fetchInquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateInquiryStatus.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentInquiry = action.payload;
        serviceInquirySlice.caseReducers.updateInquiryInList(state, action);
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Submit Quote
      .addCase(submitQuote.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitQuote.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentInquiry = action.payload;
        serviceInquirySlice.caseReducers.updateInquiryInList(state, action);
      })
      .addCase(submitQuote.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Respond to Quote
      .addCase(respondToQuote.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(respondToQuote.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentInquiry = action.payload;
        serviceInquirySlice.caseReducers.updateInquiryInList(state, action);
      })
      .addCase(respondToQuote.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Add Message
      .addCase(addMessage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.currentInquiry) {
          state.currentInquiry.messages.push(action.payload);
        }
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Schedule Consultation
      .addCase(scheduleConsultation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(scheduleConsultation.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentInquiry = action.payload;
        serviceInquirySlice.caseReducers.updateInquiryInList(state, action);
      })
      .addCase(scheduleConsultation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Assign Inquiry
      .addCase(assignInquiry.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(assignInquiry.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentInquiry = action.payload;
        serviceInquirySlice.caseReducers.updateInquiryInList(state, action);
      })
      .addCase(assignInquiry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentInquiry, clearError, updateInquiryInList, setFilters } = serviceInquirySlice.actions;
export default serviceInquirySlice.reducer;