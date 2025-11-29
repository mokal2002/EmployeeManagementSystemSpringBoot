import { useState, useEffect } from 'react';
import { getAllEmployees, deleteEmployee, createEmployee, updateEmployee } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import './EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    about: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees. Make sure Spring Boot is running!');
      toast.error('Failed to connect to server!', {
        duration: 4000,
        icon: '🚫',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const loadingToast = toast.loading('Deleting employee...');
      try {
        await deleteEmployee(id);
        toast.success('Employee deleted successfully!', {
          id: loadingToast,
          duration: 3000,
          icon: '🗑️',
        });
        fetchEmployees();
      } catch (err) {
        toast.error('Failed to delete employee!', {
          id: loadingToast,
          duration: 4000,
          icon: '❌',
        });
        console.error(err);
      }
    }
  };

  // Open form for adding new employee - NO ID
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentEmployee({
      name: '',
      email: '',
      password: '',
      role: '',
      about: '',
      phoneNumber: '',
    });
    setShowForm(true);
  };

  // Open form for editing existing employee
  const handleEditClick = (employee) => {
    setIsEditing(true);
    setCurrentEmployee(employee);
    setShowForm(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditing ? 'Updating employee...' : 'Creating employee...');
    
    try {
      if (isEditing) {
        await updateEmployee(currentEmployee.id, currentEmployee);
        toast.success('Employee updated successfully!', {
          id: loadingToast,
          duration: 3000,
          icon: '✅',
        });
      } else {
        // Don't send ID when creating new employee
        const { id, ...newEmployee } = currentEmployee;
        await createEmployee(newEmployee);
        toast.success('Employee created successfully!', {
          id: loadingToast,
          duration: 3000,
          icon: '🎉',
        });
      }
      setShowForm(false);
      setCurrentEmployee({
        name: '',
        email: '',
        password: '',
        role: '',
        about: '',
        phoneNumber: '',
      });
      fetchEmployees();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Failed to save: ${errorMessage}`, {
        id: loadingToast,
        duration: 5000,
        icon: '❌',
      });
      console.error('Error:', err);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setCurrentEmployee({
      name: '',
      email: '',
      password: '',
      role: '',
      about: '',
      phoneNumber: '',
    });
    toast('Form cancelled', {
      duration: 2000,
      icon: 'ℹ️',
    });
  };

  if (loading) return <div className="loading">⏳ Loading employees...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="container">
      {/* Toaster Component - Required for hot-toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          // Success
          success: {
            style: {
              background: '#10b981',
            },
          },
          // Error
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      <div className="header">
        <h1>👥 Employee Management System</h1>
        <p className="subtitle">Manage your team efficiently</p>
      </div>
      
      <button onClick={handleAddClick} className="btn btn-add">
        ➕ Add New Employee
      </button>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-container">
          <h3>{isEditing ? '✏️ Edit Employee' : '➕ Add New Employee'}</h3>
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-group">
              <label>👤 Name *</label>
              <input
                type="text"
                name="name"
                value={currentEmployee.name || ''}
                onChange={handleInputChange}
                required
                placeholder="Enter employee name"
              />
            </div>

            <div className="form-group">
              <label>📧 Email *</label>
              <input
                type="email"
                name="email"
                value={currentEmployee.email || ''}
                onChange={handleInputChange}
                required
                placeholder="employee@company.com"
              />
            </div>

            <div className="form-group">
              <label>🔒 Password {!isEditing && '*'}</label>
              <input
                type="password"
                name="password"
                value={currentEmployee.password || ''}
                onChange={handleInputChange}
                required={!isEditing}
                placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
              />
            </div>

            <div className="form-group">
              <label>💼 Role</label>
              <input
                type="text"
                name="role"
                value={currentEmployee.role || ''}
                onChange={handleInputChange}
                placeholder="e.g., Developer, Manager"
              />
            </div>

            <div className="form-group">
              <label>📝 About</label>
              <textarea
                name="about"
                value={currentEmployee.about || ''}
                onChange={handleInputChange}
                placeholder="Brief description about the employee"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>📱 Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={currentEmployee.phoneNumber || ''}
                onChange={handleInputChange}
                placeholder="9876543210"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-submit">
                {isEditing ? '💾 Update' : '✅ Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-cancel">
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee Cards (Mobile-Friendly) */}
      <div className="employees-grid">
        {employees.length === 0 ? (
          <div className="no-employees">
            <p>📭 No employees found. Add your first employee!</p>
          </div>
        ) : (
          employees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <div className="card-header">
                <h3>{employee.name}</h3>
                <span className={`status-badge ${employee.isEnabled ? 'active' : 'inactive'}`}>
                  {employee.isEnabled ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              
              <div className="card-body">
                <p><strong>📧 Email:</strong> {employee.email}</p>
                <p><strong>💼 Role:</strong> {employee.role || 'N/A'}</p>
                <p><strong>📱 Phone:</strong> {employee.phoneNumber || 'N/A'}</p>
                <p><strong>📝 About:</strong> {employee.about || 'No description'}</p>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEditClick(employee)} className="btn btn-edit">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(employee.id)} className="btn btn-delete">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>About</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td data-label="Name">{employee.name}</td>
                <td data-label="Email">{employee.email}</td>
                <td data-label="Role">{employee.role || 'N/A'}</td>
                <td data-label="About">{employee.about || 'N/A'}</td>
                <td data-label="Phone">{employee.phoneNumber || 'N/A'}</td>
                <td data-label="Status">
                  <span className={`status-badge ${employee.isEnabled ? 'active' : 'inactive'}`}>
                    {employee.isEnabled ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(employee)} className="btn btn-edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(employee.id)} className="btn btn-delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
