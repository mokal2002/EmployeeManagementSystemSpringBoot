import { useState, useEffect } from 'react';
import { getAllEmployees, deleteEmployee } from '../services/api';

function EmployeeList() {
  // State to store employees
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees when component loads
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); // Refresh list after delete
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  // Show loading message
  if (loading) return <div>Loading employees...</div>;
  
  // Show error message
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Employee List</h2>
      <table border="1" cellPadding="10" style={{width: '100%', marginTop: '20px'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>{employee.phoneNumber || 'N/A'}</td>
              <td>
                <button onClick={() => handleDelete(employee.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
