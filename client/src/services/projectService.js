// services/projectService.js
import api from './api';

const PROJECT_URL = '/projects';
const ADMIN_PROJECT_URL = '/admin/projects';

// Public Project Services
export const projectService = {
  // Get public projects with filtering and pagination
  getPublicProjects: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${PROJECT_URL}?${queryParams}`);
    return response.data;
  },

  // Get project by slug
  getProjectBySlug: async (slug) => {
    const response = await api.get(`${PROJECT_URL}/${slug}`);
    return response.data;
  },

  // Get featured projects
  getFeaturedProjects: async (limit = 6) => {
    const response = await api.get(`${PROJECT_URL}/featured?limit=${limit}`);
    return response.data;
  },

  // Get projects by category
  getProjectsByCategory: async (category, limit = 10) => {
    const response = await api.get(`${PROJECT_URL}/category/${category}?limit=${limit}`);
    return response.data;
  },

  // Search projects
  searchProjects: async (query, params = {}) => {
    const queryParams = new URLSearchParams({ q: query, ...params });
    const response = await api.get(`${PROJECT_URL}/search?${queryParams}`);
    return response.data;
  },

  // Increment project views
  incrementViews: async (slug) => {
    const response = await api.post(`${PROJECT_URL}/${slug}/view`);
    return response.data;
  },
};

// Admin Project Services
export const adminProjectService = {
  // Get all projects for admin
  getProjectsForAdmin: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`${ADMIN_PROJECT_URL}?${queryParams}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const formData = new FormData();
    
    // Handle file uploads
    if (projectData.images && projectData.images.length > 0) {
      projectData.images.forEach((image, index) => {
        formData.append('images', image);
      });
      delete projectData.images;
    }

    // Handle JSON fields
    const jsonFields = [
      'client', 'location', 'timeline', 'budget', 'progress',
      'features', 'services', 'team', 'testimonial', 'displaySettings',
      'sustainability', 'awards', 'challenges'
    ];

    jsonFields.forEach(field => {
      if (projectData[field]) {
        formData.append(field, JSON.stringify(projectData[field]));
        delete projectData[field];
      }
    });

    // Handle other fields
    Object.keys(projectData).forEach(key => {
      if (projectData[key] !== undefined && projectData[key] !== null) {
        formData.append(key, projectData[key]);
      }
    });

    const response = await api.post(ADMIN_PROJECT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const formData = new FormData();
    
    // Handle file uploads
    if (projectData.images && projectData.images.length > 0) {
      projectData.images.forEach((image, index) => {
        formData.append('images', image);
      });
      delete projectData.images;
    }

    // Handle JSON fields
    const jsonFields = [
      'client', 'location', 'timeline', 'budget', 'progress',
      'features', 'services', 'team', 'testimonial', 'displaySettings',
      'sustainability', 'awards', 'challenges'
    ];

    jsonFields.forEach(field => {
      if (projectData[field]) {
        formData.append(field, JSON.stringify(projectData[field]));
        delete projectData[field];
      }
    });

    // Handle other fields
    Object.keys(projectData).forEach(key => {
      if (projectData[key] !== undefined && projectData[key] !== null) {
        formData.append(key, projectData[key]);
      }
    });

    const response = await api.put(`${ADMIN_PROJECT_URL}/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`${ADMIN_PROJECT_URL}/${projectId}`);
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    const response = await api.get(`${ADMIN_PROJECT_URL}/${projectId}`);
    return response.data;
  },

  // Update project status
  updateProjectStatus: async (projectId, status) => {
    const response = await api.put(`${ADMIN_PROJECT_URL}/${projectId}/status`, { status });
    return response.data;
  },

  // Update project progress
  updateProjectProgress: async (projectId, progressData) => {
    const response = await api.put(`${ADMIN_PROJECT_URL}/${projectId}/progress`, progressData);
    return response.data;
  },

  // Toggle featured status
  toggleFeaturedProject: async (projectId) => {
    const response = await api.put(`${ADMIN_PROJECT_URL}/${projectId}/featured`);
    return response.data;
  },

  // Duplicate project
  duplicateProject: async (projectId) => {
    const response = await api.post(`${ADMIN_PROJECT_URL}/${projectId}/duplicate`);
    return response.data;
  },

  // Delete multiple projects
  deleteMultipleProjects: async (projectIds) => {
    const response = await api.delete(`${ADMIN_PROJECT_URL}/bulk`, {
      data: { projectIds }
    });
    return response.data;
  },

  // Get project statistics
  getProjectStats: async () => {
    const response = await api.get(`${ADMIN_PROJECT_URL}/stats`);
    return response.data;
  },

  // Get project categories
  getProjectCategories: async () => {
    const response = await api.get(`${ADMIN_PROJECT_URL}/categories`);
    return response.data;
  },
};

export default projectService;