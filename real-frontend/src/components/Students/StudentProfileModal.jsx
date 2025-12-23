import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import gridBg from "../../assets/grid.jpg";

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
      {label}
    </span>
    <span className="text-white/90 font-medium text-base">{value || "—"}</span>
  </div>
);

const SectionTitle = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
    <span className="text-blue-300">{icon}</span>
    <h3 className="text-white font-bold text-lg">{title}</h3>
  </div>
);

const StudentProfileModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f0f13] border border-white/10 rounded-3xl shadow-2xl custom-scrollbar"
        >
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-900/40 to-purple-900/40 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${gridBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
              <div className="w-32 h-32 rounded-2xl border-4 border-[#0f0f13] overflow-hidden bg-black shadow-xl">
                <img
                  src={
                    student.studentPhoto ||
                    `https://ui-avatars.com/api/?name=${student.studentName}&background=random`
                  }
                  alt={student.studentName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-white mb-1">
                  {student.studentName}
                </h2>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {student.class} - {student.section}
                  </span>
                  <span>SR: {student.srNo}</span>
                  <span>•</span>
                  <span>PEN: {student.penID}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="pt-20 px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Details */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <SectionTitle
                  title="Personal Details"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  }
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <InfoField label="Father's Name" value={student.fatherName} />
                  <InfoField label="Date of Birth" value={student.dob} />
                  <InfoField label="Gender" value={student.gender || "Male"} />
                  <InfoField label="Aadhar No." value={student.aadhar} />
                  <InfoField label="Contact" value={student.contact} />
                  <InfoField label="APAAR ID" value={student.apaarID} />
                </div>
              </div>

              {/* Address */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <SectionTitle
                  title="Address & Location"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  }
                />
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <InfoField label="Address" value={student.address} />
                  </div>
                  <InfoField label="State" value={student.State} />
                  <InfoField label="City" value={student.city || "N/A"} />
                </div>
              </div>

              {/* Academic Info */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <SectionTitle
                  title="Academic Information"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  }
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <InfoField label="Admission Date" value={student.adDate} />
                  <InfoField label="TC Number" value={student.tcNumber} />
                  <InfoField
                    label="Left School"
                    value={student.leftSchool ? "Yes" : "No"}
                  />
                  {student.leftSchool && (
                    <InfoField label="Left Date" value={student.leftDate} />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Fees & Payments */}
            <div className="space-y-6">
              {/* Fee Summary */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
                <SectionTitle
                  title="Fee Status"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  }
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-white/60">Total Fees</span>
                    <span className="text-white font-bold">
                      ₹{student.feeSummary?.total?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-white/60">Paid Amount</span>
                    <span className="text-green-400 font-bold">
                      ₹{student.feeSummary?.received?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white/60">Balance Due</span>
                    <span className="text-red-400 font-bold text-xl">
                      ₹{student.feeSummary?.due?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-white/80 text-sm font-bold mb-3">
                    Fee Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/50">
                      <span>Admission Fee</span>
                      <span>₹{student.fees?.adFee?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Tuition Fee</span>
                      <span>₹{student.fees?.fee?.toLocaleString()}</span>
                    </div>
                    {student.fees?.bus > 0 && (
                      <div className="flex justify-between text-white/50">
                        <span>Transport</span>
                        <span>₹{student.fees?.bus?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <SectionTitle
                  title="Recent Payments"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  }
                />
                <div className="space-y-3">
                  {student.payments?.map((payment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5"
                    >
                      <div>
                        <div className="text-white font-medium">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        <div className="text-white/40 text-xs">
                          {payment.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-xs">
                          {payment.rn}
                        </div>
                        <div className="text-green-400 text-[10px] uppercase font-bold">
                          Paid
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!student.payments || student.payments.length === 0) && (
                    <div className="text-center text-white/30 text-sm py-4">
                      No payments found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentProfileModal;
