// services/employeeAPI.js
import api from './api';

const employeeAPI = {
  // Get all employees
  getEmployees: () => {
    return api.get('/employees');
  },

  // Create new employee
  createEmployee: (data) => {
    return api.post('/employees/create', data);
  },

  // Update employee
  updateEmployee: (id, data) => {
    return api.put(`/employees/${id}`, data);
  },

  // Delete employee
  deleteEmployee: (id) => {
    return api.delete(`/employees/${id}`);
  }
};

export default employeeAPI;