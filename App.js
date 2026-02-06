import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import studentAPI from './services/api';

function App() {
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);

  const refreshStudents = async () => {
    try {
      const response = await studentAPI.getStudents();
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  useEffect(() => {
    refreshStudents();
  }, []);

  const handleEdit = (student) => {
    setEditStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📚 Student Management System</h1>

      <StudentForm
        refreshStudents={refreshStudents}
        editStudent={editStudent}
        setEditStudent={setEditStudent}
      />

      <StudentList
        students={students}
        refreshStudents={refreshStudents}
        onEdit={handleEdit}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;
