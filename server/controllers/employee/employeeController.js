import User from '../../models/User.js';

// ✅ Create Employee 
export const createEmployee = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can create employees.' });
    }

    const { email, password, firstName, lastName, phone, position, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newEmployee = await User.create({
      email,
      password,
      userType: 'employee',
      employeeProfile: {
        firstName,
        lastName,
        phone,
        position,
        department
      },
      isVerified: true
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: newEmployee._id,
        email: newEmployee.email,
        fullName: newEmployee.fullName,
        employeeProfile: newEmployee.employeeProfile
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get All Employees
export const getEmployees = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const employees = await User.find({ userType: 'employee' }).select('-password');
    res.status(200).json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update Employee
export const updateEmployee = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { id } = req.params;
    const updates = req.body;

    const employee = await User.findOneAndUpdate(
      { _id: id, userType: 'employee' },
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { id } = req.params;
    const employee = await User.findOneAndDelete({ _id: id, userType: 'employee' });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
