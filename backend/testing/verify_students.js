// import fetch from "node-fetch"; // Native fetch in Node 18+

const API_URL = "http://localhost:5000/api";

const verifyStudents = async () => {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@school.com",
        password: "admin123",
      }),
    });

    if (!loginRes.ok) {
      const err = await loginRes.text();
      throw new Error(`Login failed: ${loginRes.status} ${err}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Login successful. Token received.");

    // 2. Fetch Students
    console.log("Fetching students...");
    const studentsRes = await fetch(`${API_URL}/students/0`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!studentsRes.ok) {
      const err = await studentsRes.text();
      throw new Error(`Fetch students failed: ${studentsRes.status} ${err}`);
    }

    const students = await studentsRes.json();
    console.log(`Successfully fetched ${students.length} students.`);

    if (students.length > 0) {
      console.log("First student:", students[0].studentName);
    }
  } catch (error) {
    console.error("Verification failed:", error.message);
  }
};

verifyStudents();
