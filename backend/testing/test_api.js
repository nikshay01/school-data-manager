// Using native fetch (Node 18+)

const API_URL = "http://localhost:5001/api";
let token = "";
let schoolId = "";

const runTests = async () => {
  console.log("🚀 Starting Backend API Tests on Port 5001...\n");

  // 1. Signup
  console.log("1️⃣ Testing Signup...");
  try {
    const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" }),
    });
    const data = await res.json();
    console.log("Signup Response Data:", JSON.stringify(data, null, 2)); // Log full data

    if (res.ok) {
      console.log("✅ Signup Successful");
      token = data.token;
    } else {
      console.error("❌ Signup Failed:", data);
    }
  } catch (err) {
    console.error("❌ Signup Error:", err.message);
  }

  // 2. Login (if signup failed or just to test)
  if (!token) {
    console.log("\n2️⃣ Testing Login...");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          password: "password123",
        }), // Adjust creds if needed
      });
      const data = await res.json();
      if (res.ok) {
        console.log("✅ Login Successful");
        token = data.token;
      } else {
        console.error("❌ Login Failed:", data);
      }
    } catch (err) {
      console.error("❌ Login Error:", err.message);
    }
  }

  if (!token) {
    console.error("\n🛑 Aborting tests: No token available.");
    return;
  }

  // 3. Get Profile
  console.log("\n3️⃣ Testing Get Profile (Protected)...");
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      console.log("✅ Profile Fetched:", data.email);
      schoolId = data.school?._id || data.school;
    } else {
      console.error("❌ Profile Fetch Failed:", data);
    }
  } catch (err) {
    console.error("❌ Profile Error:", err.message);
  }

  // 4. Add Student
  console.log("\n4️⃣ Testing Add Student (Protected & Scoped)...");
  try {
    const res = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentName: "Test Student",
        class: "10th",
        school: schoolId, // Should be ignored by backend and taken from token, but sending anyway
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("✅ Student Added:", data.studentName);
    } else {
      console.error("❌ Add Student Failed:", data);
    }
  } catch (err) {
    console.error("❌ Add Student Error:", err.message);
  }

  // 5. Check Logs (Admin only - might fail if user is not admin)
  console.log("\n5️⃣ Testing Get Logs (Admin Only)...");
  try {
    const res = await fetch(`${API_URL}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Logs Fetched: ${data.logs?.length || 0} entries`);
    } else {
      console.warn(
        "⚠️ Get Logs Failed (Expected if not Admin):",
        data.message || data.error
      );
    }
  } catch (err) {
    console.error("❌ Get Logs Error:", err.message);
  }

  console.log("\n🏁 Tests Completed.");
};

runTests();
