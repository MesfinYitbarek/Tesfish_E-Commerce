import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import serviceInquiryService from '../../services/serviceInquiryService';


const initialState = {
  inquiries: [],
  currentInquiry: null,
  stats: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
};

// Create service inquiry
export const createServiceInquiry = createAsyncThunk(
  'serviceInquiry/create',
  async (inquiryData, thunkAPI) => {
    try {
      return await serviceInquiryService.createServiceInquiry(inquiryData);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get customer inquiries
export const getMyInquiries = createAsyncThunk(
  'serviceInquiry/getMyInquiries',
  async (filters, thunkAPI) => {
    try {
      return await serviceInquiryService.getMyInquiries(filters);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get provider inquiries
export const getProviderInquiries = createAsyncThunk(
  'serviceInquiry/getProviderInquiries',
  async (filters, thunkAPI) => {
    try {
      return await serviceInquiryService.getProviderInquiries(filters);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single inquiry
export const getServiceInquiry = createAsyncThunk(
  'serviceInquiry/getOne',
  async (id, thunkAPI) => {
    try {
      return await serviceInquiryService.getServiceInquiry(id);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update inquiry status
export const updateInquiryStatus = createAsyncThunk(
  'serviceInquiry/updateStatus',
  async ({ id, statusData }, thunkAPI) => {
    try {
      return await serviceInquiryService.updateInquiryStatus(id, statusData);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit quote
export const submitQuote = createAsyncThunk(
  'serviceInquiry/submitQuote',
  async ({ id, quoteData }, thunkAPI) => {
    try {
      return await serviceInquiryService.submitQuote(id, quoteData);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add message
export const addMessage = createAsyncThunk(
  'serviceInquiry/addMessage',
  async ({ id, messageData }, thunkAPI) => {
    try {
      return await serviceInquiryService.addMessage(id, messageData);
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get inquiry stats
export const getInquiryStats = createAsyncThunk(
  'serviceInquiry/getStats',
  async (_, thunkAPI) => {
    try {
      return await serviceInquiryService.getInquiryStats();
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const serviceInquirySlice = createSlice({
  name: 'serviceInquiry',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearCurrentInquiry: (state) => {
      state.currentInquiry = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create service inquiry
      .addCase(createServiceInquiry.pending, (state) => {
        state.loading = true;
      })
      .addCase(createServiceInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inquiries.unshift(action.payload.data.inquiry);
      })
      .addCase(createServiceInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get customer inquiries
      .addCase(getMyInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload.data.inquiries;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getMyInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get provider inquiries
      .addCase(getProviderInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProviderInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload.data.inquiries;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getProviderInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get single inquiry
      .addCase(getServiceInquiry.pending, (state) => {
        state.loading = true;
      })
      .addCase(getServiceInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInquiry = action.payload.data.inquiry;
      })
      .addCase(getServiceInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update inquiry status
      .addCase(updateInquiryStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentInquiry && state.currentInquiry._id === action.payload.data.inquiry._id) {
          state.currentInquiry = action.payload.data.inquiry;
        }
        state.inquiries = state.inquiries.map(inquiry => 
          inquiry._id === action.payload.data.inquiry._id ? action.payload.data.inquiry : inquiry
        );
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit quote
      .addCase(submitQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentInquiry && state.currentInquiry._id === action.payload.data.inquiry._id) {
          state.currentInquiry = action.payload.data.inquiry;
        }
        state.inquiries = state.inquiries.map(inquiry => 
          inquiry._id === action.payload.data.inquiry._id ? action.payload.data.inquiry : inquiry
        );
      })
      .addCase(submitQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add message
      .addCase(addMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentInquiry) {
          state.currentInquiry.messages.push(action.payload.data.message);
        }
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get stats
      .addCase(getInquiryStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInquiryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getInquiryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { reset, clearCurrentInquiry } = serviceInquirySlice.actions;
export default serviceInquirySlice.reducer;