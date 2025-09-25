// store/slices/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeAPI from '../../services/employeeAPI';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.getEmployees();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.createEmployee(employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.updateEmployee(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await employeeAPI.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const initialState = {
  employees: [],
  currentEmployee: null,
  filteredEmployees: [],
  filters: {
    search: '',
    department: '',
    position: ''
  },
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
};

// Helper function to apply filters
const applyFilters = (employees, filters) => {
  if (!employees || !Array.isArray(employees)) return [];
  
  return employees.filter(employee => {
    const searchMatch = !filters.search || 
      employee.employeeProfile?.firstName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.employeeProfile?.lastName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      employee.employeeProfile?.position?.toLowerCase().includes(filters.search.toLowerCase());

    const departmentMatch = !filters.department || 
      employee.employeeProfile?.department === filters.department;

    const positionMatch = !filters.position || 
      employee.employeeProfile?.position?.toLowerCase().includes(filters.position.toLowerCase());

    return searchMatch && departmentMatch && positionMatch;
  });
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters to current employees
      state.filteredEmployees = applyFilters(state.employees, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        department: '',
        position: ''
      };
      state.filteredEmployees = state.employees;
    },
    setCurrentEmployee: (state, action) => {
      state.currentEmployee = action.payload;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees || [];
        state.filteredEmployees = applyFilters(action.payload.employees || [], state.filters);
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.employees = [];
        state.filteredEmployees = [];
      })

      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.createLoading = false;
        if (action.payload.employee) {
          state.employees.unshift(action.payload.employee);
          state.filteredEmployees = applyFilters(state.employees, state.filters);
        }
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (action.payload.employee) {
          const index = state.employees.findIndex(emp => emp._id === action.payload.employee._id);
          if (index !== -1) {
            state.employees[index] = action.payload.employee;
            state.filteredEmployees = applyFilters(state.employees, state.filters);
          }
          if (state.currentEmployee?._id === action.payload.employee._id) {
            state.currentEmployee = action.payload.employee;
          }
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.employees = state.employees.filter(emp => emp._id !== action.payload);
        state.filteredEmployees = state.filteredEmployees.filter(emp => emp._id !== action.payload);
        if (state.currentEmployee?._id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setCurrentEmployee,
  clearCurrentEmployee,
  clearError
} = employeeSlice.actions;

// ✅ Fixed Selectors with safe access
export const selectEmployees = (state) => state.employees?.filteredEmployees || [];
export const selectAllEmployees = (state) => state.employees?.employees || [];
export const selectCurrentEmployee = (state) => state.employees?.currentEmployee || null;
export const selectEmployeeLoading = (state) => state.employees?.loading || false;
export const selectEmployeeError = (state) => state.employees?.error || null;
export const selectEmployeeFilters = (state) => state.employees?.filters || { search: '', department: '', position: '' };
export const selectCreateLoading = (state) => state.employees?.createLoading || false;
export const selectUpdateLoading = (state) => state.employees?.updateLoading || false;
export const selectDeleteLoading = (state) => state.employees?.deleteLoading || false;

export default employeeSlice.reducer;