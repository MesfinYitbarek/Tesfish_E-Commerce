// store/slices/projectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService, adminProjectService } from '../../services/projectService';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  // Public projects
  projects: [],
  currentProject: null,
  featuredProjects: [],
  relatedProjects: [],
  
  // Admin projects
  adminProjects: [],
  currentAdminProject: null,
  projectStats: null,
  projectCategories: [],
  
  // UI state
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  
  // Filters
  filters: {
    category: 'all',
    status: 'all',
    search: '',
    sort: 'newest',
    featured: null,
    public: null,
    startDate: null,
    endDate: null,
    minBudget: null,
    maxBudget: null,
  },
  
  // Search
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  
  // Error handling
  error: null,
  adminError: null,
};

// Public Project Thunks
export const fetchPublicProjects = createAsyncThunk(
  'projects/fetchPublicProjects',
  async (params, { rejectWithValue }) => {
    try {
      const response = await projectService.getPublicProjects(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectBySlug = createAsyncThunk(
  'projects/fetchProjectBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjectBySlug(slug);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const fetchFeaturedProjects = createAsyncThunk(
  'projects/fetchFeaturedProjects',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await projectService.getFeaturedProjects(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured projects');
    }
  }
);

export const fetchProjectsByCategory = createAsyncThunk(
  'projects/fetchProjectsByCategory',
  async ({ category, limit }, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjectsByCategory(category, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects by category');
    }
  }
);

export const searchProjects = createAsyncThunk(
  'projects/searchProjects',
  async ({ query, params }, { rejectWithValue }) => {
    try {
      const response = await projectService.searchProjects(query, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search projects');
    }
  }
);

export const incrementProjectViews = createAsyncThunk(
  'projects/incrementViews',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await projectService.incrementViews(slug);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record view');
    }
  }
);

// Admin Project Thunks
export const fetchAdminProjects = createAsyncThunk(
  'projects/fetchAdminProjects',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.getProjectsForAdmin(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.createProject(projectData);
      toast.success('Project created successfully');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.updateProject(projectId, projectData);
      toast.success('Project updated successfully');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.deleteProject(projectId);
      toast.success('Project deleted successfully');
      return { ...response, projectId };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.getProjectById(projectId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  'projects/updateProjectStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.updateProjectStatus(projectId, status);
      toast.success(`Project status updated to ${status}`);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProjectProgress = createAsyncThunk(
  'projects/updateProjectProgress',
  async ({ projectId, progressData }, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.updateProjectProgress(projectId, progressData);
      toast.success('Project progress updated successfully');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project progress';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const toggleFeaturedProject = createAsyncThunk(
  'projects/toggleFeaturedProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.toggleFeaturedProject(projectId);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle featured status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const duplicateProject = createAsyncThunk(
  'projects/duplicateProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.duplicateProject(projectId);
      toast.success('Project duplicated successfully');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to duplicate project';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteMultipleProjects = createAsyncThunk(
  'projects/deleteMultipleProjects',
  async (projectIds, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.deleteMultipleProjects(projectIds);
      toast.success(response.message);
      return { ...response, projectIds };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete projects';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchProjectStats = createAsyncThunk(
  'projects/fetchProjectStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.getProjectStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project statistics');
    }
  }
);

export const fetchProjectCategories = createAsyncThunk(
  'projects/fetchProjectCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminProjectService.getProjectCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project categories');
    }
  }
);

// Project slice
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Filter actions
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    
    resetFilters: (state) => {
      state.filters = {
        category: 'all',
        status: 'all',
        search: '',
        sort: 'newest',
        featured: null,
        public: null,
        startDate: null,
        endDate: null,
        minBudget: null,
        maxBudget: null,
      };
    },
    
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    // UI actions
    clearError: (state) => {
      state.error = null;
      state.adminError = null;
    },
    
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.relatedProjects = [];
    },
    
    clearCurrentAdminProject: (state) => {
      state.currentAdminProject = null;
    },
    
    // Pagination
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    // Project actions
    updateProjectInList: (state, action) => {
      const { projectId, updatedData } = action.payload;
      
      // Update in public projects
      const publicIndex = state.projects.findIndex(p => p._id === projectId);
      if (publicIndex !== -1) {
        state.projects[publicIndex] = { ...state.projects[publicIndex], ...updatedData };
      }
      
      // Update in admin projects
      const adminIndex = state.adminProjects.findIndex(p => p._id === projectId);
      if (adminIndex !== -1) {
        state.adminProjects[adminIndex] = { ...state.adminProjects[adminIndex], ...updatedData };
      }
      
      // Update current project if it matches
      if (state.currentProject?._id === projectId) {
        state.currentProject = { ...state.currentProject, ...updatedData };
      }
      
      if (state.currentAdminProject?._id === projectId) {
        state.currentAdminProject = { ...state.currentAdminProject, ...updatedData };
      }
    },
    
    removeProjectFromList: (state, action) => {
      const projectId = action.payload;
      
      state.projects = state.projects.filter(p => p._id !== projectId);
      state.adminProjects = state.adminProjects.filter(p => p._id !== projectId);
      state.featuredProjects = state.featuredProjects.filter(p => p._id !== projectId);
      
      if (state.currentProject?._id === projectId) {
        state.currentProject = null;
      }
      if (state.currentAdminProject?._id === projectId) {
        state.currentAdminProject = null;
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch public projects
      .addCase(fetchPublicProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data.projects;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchPublicProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch project by slug
      .addCase(fetchProjectBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload.data.project;
        state.relatedProjects = action.payload.data.relatedProjects || [];
      })
      .addCase(fetchProjectBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch featured projects
      .addCase(fetchFeaturedProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeaturedProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProjects = action.payload.data.projects;
      })
      .addCase(fetchFeaturedProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search projects
      .addCase(searchProjects.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.data.projects;
        state.searchQuery = action.payload.data.query;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      })
      
      // Fetch admin projects
      .addCase(fetchAdminProjects.pending, (state) => {
        state.isLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAdminProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminProjects = action.payload.data.projects;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchAdminProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.adminError = action.payload;
      })
      
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isCreating = true;
        state.adminError = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isCreating = false;
        state.adminProjects.unshift(action.payload.data.project);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isCreating = false;
        state.adminError = action.payload;
      })
      
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isUpdating = true;
        state.adminError = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedProject = action.payload.data.project;
        
        // Update in admin projects list
        const index = state.adminProjects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.adminProjects[index] = updatedProject;
        }
        
        // Update current admin project
        if (state.currentAdminProject?._id === updatedProject._id) {
          state.currentAdminProject = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isUpdating = false;
        state.adminError = action.payload;
      })
      
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isDeleting = true;
        state.adminError = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isDeleting = false;
        const projectId = action.payload.projectId;
        
        state.adminProjects = state.adminProjects.filter(p => p._id !== projectId);
        
        if (state.currentAdminProject?._id === projectId) {
          state.currentAdminProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isDeleting = false;
        state.adminError = action.payload;
      })
      
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.adminError = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAdminProject = action.payload.data.project;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.adminError = action.payload;
      })
      
      // Update project status
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        const updatedProject = action.payload.data.project;
        projectSlice.caseReducers.updateProjectInList(state, {
          payload: {
            projectId: updatedProject._id,
            updatedData: updatedProject
          }
        });
      })
      
      // Update project progress
      .addCase(updateProjectProgress.fulfilled, (state, action) => {
        const updatedProject = action.payload.data.project;
        projectSlice.caseReducers.updateProjectInList(state, {
          payload: {
            projectId: updatedProject._id,
            updatedData: updatedProject
          }
        });
      })
      
      // Toggle featured project
      .addCase(toggleFeaturedProject.fulfilled, (state, action) => {
        const updatedProject = action.payload.data.project;
        projectSlice.caseReducers.updateProjectInList(state, {
          payload: {
            projectId: updatedProject._id,
            updatedData: updatedProject
          }
        });
      })
      
      // Duplicate project
      .addCase(duplicateProject.fulfilled, (state, action) => {
        const newProject = action.payload.data.project;
        state.adminProjects.unshift(newProject);
      })
      
      // Delete multiple projects
      .addCase(deleteMultipleProjects.fulfilled, (state, action) => {
        const projectIds = action.payload.projectIds;
        state.adminProjects = state.adminProjects.filter(p => !projectIds.includes(p._id));
      })
      
      // Fetch project stats
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.projectStats = action.payload.data;
      })
      
      // Fetch project categories
      .addCase(fetchProjectCategories.fulfilled, (state, action) => {
        state.projectCategories = action.payload.data.categories;
      });
  },
});

// Export actions
export const {
  setFilter,
  resetFilters,
  updateFilters,
  setSearchQuery,
  clearSearchResults,
  clearError,
  clearCurrentProject,
  clearCurrentAdminProject,
  setPage,
  updateProjectInList,
  removeProjectFromList,
} = projectSlice.actions;

// Selectors
export const selectProjects = (state) => state.projects.projects;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectRelatedProjects = (state) => state.projects.relatedProjects;
export const selectFeaturedProjects = (state) => state.projects.featuredProjects;
export const selectAdminProjects = (state) => state.projects.adminProjects;
export const selectCurrentAdminProject = (state) => state.projects.currentAdminProject;
export const selectProjectStats = (state) => state.projects.projectStats;
export const selectProjectCategories = (state) => state.projects.projectCategories;
export const selectIsProjectsLoading = (state) => state.projects.isLoading;
export const selectIsCreatingProject = (state) => state.projects.isCreating;
export const selectIsUpdatingProject = (state) => state.projects.isUpdating;
export const selectIsDeletingProject = (state) => state.projects.isDeleting;
export const selectProjectsError = (state) => state.projects.error;
export const selectAdminProjectsError = (state) => state.projects.adminError;
export const selectProjectsPagination = (state) => state.projects.pagination;
export const selectProjectsFilters = (state) => state.projects.filters;
export const selectSearchResults = (state) => state.projects.searchResults;
export const selectSearchQuery = (state) => state.projects.searchQuery;
export const selectIsSearching = (state) => state.projects.isSearching;

export default projectSlice.reducer;