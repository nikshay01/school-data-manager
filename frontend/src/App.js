import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>School Data Manager</h1>
      <table border="1">
        <thead>
          <tr>
            <th>S.No</th><th>Name</th><th>Father</th><th>Class</th><th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.sNo}</td>
              <td>{s.studentName}</td>
              <td>{s.fatherName}</td>
              <td>{s.class}</td>
              <td>{s.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
