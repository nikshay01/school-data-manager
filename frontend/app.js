const form = document.getElementById("studentForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageDiv.textContent = "";

  // Gather all data
  const studentData = {
    studentName: document.getElementById("studentName").value.trim(),
    fatherName: document.getElementById("fatherName").value.trim(),
    class: document.getElementById("class").value.trim(),
    section: document.getElementById("section").value.trim(),
    contact: document.getElementById("contact").value || null,
    aadhar: document.getElementById("aadhar").value || null,
    adDate: document.getElementById("adDate").value || null,
    dob: document.getElementById("dob").value || null,
    penID: document.getElementById("penID").value || null,
    fees: {
      adFee: document.getElementById("adFee").value || 0,
      fee: document.getElementById("fee").value || 0,
      bus: document.getElementById("bus").value || 0,
      hostel: document.getElementById("hostel").value || 0,
      discount: document.getElementById("discount").value || 0,
      concessionBy: document.getElementById("concessionBy").value.trim()
    }
  };

  // Basic validation
  if (!studentData.studentName) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Student Name is required!";
    return;
  }

  // Send to server
  try {
    const res = await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData)
    });

    const data = await res.json();

    if (res.ok) {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Student saved successfully!";
      form.reset();
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = "Error: " + data.message;
    }
  } catch (err) {
    console.error(err);
    messageDiv.style.color = "red";
    messageDiv.textContent = "Server error!";
  }
});
