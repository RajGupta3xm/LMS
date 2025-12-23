import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from './api';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  });
  const [editId, setEditId] = useState(null);

  // Students load karna (Read)
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Form input change handle karna
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Form submit (Create ya Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editId) {
        // Update
        await updateStudent(editId, formData);
        alert('Student updated successfully!');
        setEditId(null);
      } else {
        // Create
        await createStudent(formData);
        alert('Student added successfully!');
      }
      
      // Form reset karna
      setFormData({ name: '', email: '', phone: '', course: '' });
      fetchStudents(); // List refresh karna
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  // Edit button click
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course
    });
    setEditId(student.id);
  };

  // Delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Kya aap sure hain delete karna chahte hain?')) {
      try {
        await deleteStudent(id);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Student Management System (CRUD)</h1>

      {/* Form - Create/Update */}
      <div className="form-container">
        <h2>{editId ? 'Update Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {editId ? 'Update' : 'Add'} Student
          </button>
          {editId && (
            <button type="button" onClick={() => {
              setEditId(null);
              setFormData({ name: '', email: '', phone: '', course: '' });
            }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Student List - Read */}
      <div className="students-list">
        <h2>All Students</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>Edit</button>
                    <button onClick={() => handleDelete(student.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;