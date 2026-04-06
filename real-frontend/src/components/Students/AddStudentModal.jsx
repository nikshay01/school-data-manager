import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, GraduationCap, IndianRupee, ChevronRight, ChevronLeft, Check } from "lucide-react";
import api from "../../api/axios";

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[...Array(totalSteps)].map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              currentStep >= i + 1
                ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                : "bg-white/5 border-white/20 text-white/40"
            }`}
          >
            {currentStep > i + 1 ? <Check size={20} /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-12 h-0.5 rounded-full transition-all duration-300 ${
                currentStep > i + 1 ? "bg-blue-600" : "bg-white/10"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
    <label className="text-white/50 text-xs font-bold tracking-widest uppercase ml-1 flex items-center gap-2">
      {Icon && <Icon size={14} className="text-blue-400/70" />}
      {label}
    </label>
    {children}
  </div>
);

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    contact: "",
    dob: "",
    aadhar: "",
    address: "",
    State: "",
    class: "",
    section: "",
    srNo: "",
    adDate: new Date().toISOString().split("T")[0],
    penID: "",
    apaarID: "",
    fees: {
      adFee: 0,
      fee: 0,
      bus: 0,
      hostel: 0,
      discount: 0,
    },
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/students", formData);
      if (response.status === 201) {
        onStudentAdded(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert(error.response?.data?.message || "Failed to add student. Check SR No uniqueness.");
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.studentName && formData.fatherName;
    if (step === 2) return formData.class && formData.srNo;
    return true;
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-sans";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
           key="modal"
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col"
           onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 pt-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-400">
                <GraduationCap size={32} />
              </div>
              <div>
                <h2 className="text-white text-3xl font-bold tracking-tight">Register New Student</h2>
                <p className="text-white/40 text-sm mt-1">Complete the steps to enroll a new student into the system.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/30 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stepper */}
          <div className="px-12">
            <StepIndicator currentStep={step} totalSteps={3} />
          </div>

          {/* Form Content */}
          <div className="p-8 px-12 overflow-y-auto custom-scrollbar max-h-[60vh]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Student Full Name" icon={User}>
                      <input name="studentName" value={formData.studentName} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                    </InputGroup>
                    <InputGroup label="Father's Name">
                      <input name="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClass} placeholder="Michael Doe" />
                    </InputGroup>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Contact Number">
                      <input name="contact" value={formData.contact} onChange={handleChange} className={inputClass} placeholder="+91 XXXXX XXXXX" />
                    </InputGroup>
                    <InputGroup label="Date of Birth">
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Aadhar Number">
                      <input name="aadhar" value={formData.aadhar} onChange={handleChange} className={inputClass} placeholder="12-digit UID" />
                    </InputGroup>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Address">
                      <input name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="House no, Street, Colony..." />
                    </InputGroup>
                    <InputGroup label="State">
                      <input name="State" value={formData.State} onChange={handleChange} className={inputClass} placeholder="State Name" />
                    </InputGroup>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Class" icon={GraduationCap}>
                      <input name="class" value={formData.class} onChange={handleChange} className={inputClass} placeholder="e.g., 10th" required />
                    </InputGroup>
                    <InputGroup label="Section">
                      <input name="section" value={formData.section} onChange={handleChange} className={inputClass} placeholder="e.g., A" />
                    </InputGroup>
                    <InputGroup label="SR No (Scholar Register)">
                      <input name="srNo" value={formData.srNo} onChange={handleChange} className={inputClass} placeholder="Unique SR ID" required />
                    </InputGroup>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Admission Date">
                      <input type="date" name="adDate" value={formData.adDate} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="PEN ID">
                      <input name="penID" value={formData.penID} onChange={handleChange} className={inputClass} placeholder="Permanent Education Number" />
                    </InputGroup>
                    <InputGroup label="APAAR ID">
                      <input name="apaarID" value={formData.apaarID} onChange={handleChange} className={inputClass} placeholder="APAAR One Nation Card" />
                    </InputGroup>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                   <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3 text-blue-200 text-sm mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">ℹ️</div>
                    Configure the initial fee components for this student. These values will define their ledger.
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Admission Fee" icon={IndianRupee}>
                      <input type="number" name="fees.adFee" value={formData.fees.adFee} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Monthly Fee">
                      <input type="number" name="fees.fee" value={formData.fees.fee} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <InputGroup label="Bus Fee">
                      <input type="number" name="fees.bus" value={formData.fees.bus} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Hostel Fee">
                      <input type="number" name="fees.hostel" value={formData.fees.hostel} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Discount/Concession">
                      <input type="number" name="fees.discount" value={formData.fees.discount} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-8 px-12 bg-white/5 border-t border-white/10 flex justify-between items-center">
            <button
               onClick={prevStep}
               disabled={step === 1 || loading}
               className={`flex items-center gap-2 font-bold py-3 px-6 rounded-2xl transition-all ${
                 step === 1 ? "text-white/10 cursor-not-allowed" : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
               }`}
            >
              <ChevronLeft size={20} />
              PREVIOUS
            </button>

            <div className="flex gap-4">
               {step < 3 ? (
                 <button
                   onClick={nextStep}
                   disabled={!isStepValid()}
                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:grayscale"
                 >
                   NEXT
                   <ChevronRight size={20} />
                 </button>
               ) : (
                 <button
                   onClick={handleSubmit}
                   disabled={loading}
                   className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                 >
                   {loading ? "REGISTERING..." : "FINALIZE REGISTRATION"}
                   {!loading && <Check size={20} />}
                 </button>
               )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddStudentModal;
