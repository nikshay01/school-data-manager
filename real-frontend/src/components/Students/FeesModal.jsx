import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FeesModal = ({
  isOpen,
  onClose,
  type, // "add", "edit_structure", "inquiry", "history"
  student,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null); // For history edit
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setPassword("");
      setIsAuthenticated(false);
      setEditingPaymentId(null);
      setError(null);

      if (student) {
        // Initialize form data based on type
        if (type === "edit_structure" || type === "inquiry") {
          setFormData({
            adFee: student.fees?.adFee || 0,
            fee: student.fees?.fee || 0,
            bus: student.fees?.bus || 0,
            hostel: student.fees?.hostel || 0,
            discount: student.fees?.discount || 0,
          });

          // Auto-authenticate for Inquiry if structure is empty (all 0s)
          if (type === "inquiry") {
            const isNew =
              (student.fees?.adFee || 0) === 0 &&
              (student.fees?.fee || 0) === 0 &&
              (student.fees?.bus || 0) === 0 &&
              (student.fees?.hostel || 0) === 0 &&
              (student.fees?.discount || 0) === 0;

            if (isNew) setIsAuthenticated(true);
          }
        } else if (type === "add") {
          setFormData({
            amount: "",
            rn: "",
            date: new Date().toISOString().split("T")[0],
          });
          setIsAuthenticated(true); // No password for adding payment
        }
      }
    }
  }, [isOpen, student, type]);

  const checkPassword = () => {
    if (password === "123321") {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Incorrect Password");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "add") {
      // Add Payment
      const newPayment = {
        amount: Number(formData.amount),
        rn: formData.rn,
        date: new Date(formData.date),
      };
      const updatedPayments = [...(student.payments || []), newPayment];
      onUpdate({ ...student, payments: updatedPayments });
    } else if (
      type === "edit_structure" ||
      (type === "inquiry" && isAuthenticated)
    ) {
      // Update Fee Structure
      const updatedFees = {
        ...student.fees,
        ...formData,
        adFee: Number(formData.adFee),
        fee: Number(formData.fee),
        bus: Number(formData.bus),
        hostel: Number(formData.hostel),
        discount: Number(formData.discount),
      };
      onUpdate({ ...student, fees: updatedFees });
    }
  };

  const handlePaymentEditSubmit = (e) => {
    e.preventDefault();
    // Find and update the specific payment
    const updatedPayments = student.payments.map((p) => {
      if (p._id === editingPaymentId || p === editingPaymentId) {
        // Handle both object and ID ref if needed, usually _id
        return {
          ...p,
          amount: Number(formData.amount),
          rn: formData.rn,
          date: new Date(formData.date),
        };
      }
      return p;
    });
    onUpdate({ ...student, payments: updatedPayments });
    setEditingPaymentId(null);
    setIsAuthenticated(false); // Reset auth after edit
    setPassword("");
  };

  const startEditingPayment = (payment) => {
    setEditingPaymentId(payment._id || payment); // Fallback if _id missing
    setFormData({
      amount: payment.amount,
      rn: payment.rn,
      date: new Date(payment.date).toISOString().split("T")[0],
    });
    setIsAuthenticated(false); // Require auth to edit
  };

  if (!isOpen || !student) return null;

  // --- Render Helpers ---

  const PasswordScreen = ({ onUnlock, onCancel }) => (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="text-4xl mb-2">🔒</div>
      <h3 className="text-xl font-bold text-white">Authentication Required</h3>
      <p className="text-white/50 text-sm text-center max-w-xs">
        Please enter the administrative password to proceed.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center focus:outline-none focus:border-blue-500/50 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && onUnlock()}
          autoFocus
        />
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
      </div>

      <div className="flex gap-3 mt-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={onUnlock}
          className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg transition-all font-bold"
        >
          Unlock
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    // --- ADD PAYMENT ---
    if (type === "add") {
      return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white mb-1">Add Payment</h2>
          <p className="text-white/50 text-sm mb-4">
            Record a new fee payment for {student.studentName}.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Amount
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="₹"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Receipt No
              </label>
              <input
                type="text"
                value={formData.rn}
                onChange={(e) =>
                  setFormData({ ...formData, rn: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="#"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 font-bold py-3 rounded-xl transition-all"
          >
            Confirm Payment
          </button>
        </form>
      );
    }

    // --- EDIT STRUCTURE / INQUIRY ---
    if (type === "edit_structure" || type === "inquiry") {
      if (!isAuthenticated && type === "edit_structure") {
        return <PasswordScreen onUnlock={checkPassword} />;
      }

      // Inquiry mode: If not authenticated (and not new), show read-only view
      const isReadOnly = type === "inquiry" && !isAuthenticated;

      return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {type === "inquiry"
                  ? "Fee Structure Inquiry"
                  : "Edit Fee Structure"}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {isReadOnly
                  ? "View current fee allocation."
                  : "Modify fee allocation details."}
              </p>
            </div>
            {isReadOnly && (
              <button
                type="button"
                onClick={
                  () =>
                    setPassword(
                      ""
                    ) /* Trigger auth flow logic if we were to switch modes, but for now Inquiry is mostly read only unless new */
                }
                className="hidden" // Hidden for now as per requirement "Inquiry" is for Adding New (no pass) or Viewing. "Edit Fee" is for Editing (pass).
              ></button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Admission Fee", key: "adFee" },
              { label: "Tuition Fee", key: "fee" },
              { label: "Bus Fee", key: "bus" },
              { label: "Hostel Fee", key: "hostel" },
              { label: "Discount", key: "discount" },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
                  {field.label}
                </label>
                <input
                  type="number"
                  readOnly={isReadOnly}
                  value={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  className={`
                        rounded-xl p-3 text-white transition-colors
                        ${
                          isReadOnly
                            ? "bg-transparent border border-transparent text-white/70 cursor-default"
                            : "bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500/50"
                        }
                    `}
                />
              </div>
            ))}
          </div>

          {!isReadOnly && (
            <button
              type="submit"
              className="mt-6 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-bold py-3 rounded-xl transition-all"
            >
              Save Structure
            </button>
          )}

          {isReadOnly && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center text-white/50 text-sm">
              Read-Only Mode. Use "Edit Fee" to make changes.
            </div>
          )}
        </form>
      );
    }

    // --- HISTORY ---
    if (type === "history") {
      if (editingPaymentId) {
        if (!isAuthenticated) {
          return (
            <PasswordScreen
              onUnlock={checkPassword}
              onCancel={() => setEditingPaymentId(null)}
            />
          );
        }

        // Edit Payment Form
        return (
          <form
            onSubmit={handlePaymentEditSubmit}
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-white mb-1">
              Edit Payment Entry
            </h2>
            <p className="text-white/50 text-sm mb-4">
              Modifying past payment record.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
                  Receipt No
                </label>
                <input
                  type="text"
                  value={formData.rn}
                  onChange={(e) =>
                    setFormData({ ...formData, rn: e.target.value })
                  }
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditingPaymentId(null);
                  setIsAuthenticated(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 font-bold py-3 rounded-xl transition-all"
              >
                Update Payment
              </button>
            </div>
          </form>
        );
      }

      return (
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-white mb-4">
            Payment History
          </h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/10 rounded-xl bg-black/10">
            <table className="w-full text-left text-white">
              <thead className="bg-white/5 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50">
                    Date
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50">
                    Receipt
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50 text-right">
                    Amount
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {student.payments && student.payments.length > 0 ? (
                  student.payments
                    .slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((payment, idx) => (
                      <tr
                        key={payment._id || idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4 text-sm text-white/80">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-white/80">
                          {payment.rn || "—"}
                        </td>
                        <td className="p-4 text-sm font-mono text-green-400 text-right font-bold">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => startEditingPayment(payment)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            title="Edit Payment"
                          >
                            ✎
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-12 text-center text-white/30 italic"
                    >
                      No payment history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-white/60">Total Paid:</span>
            <span className="text-2xl font-bold text-green-400">
              ₹
              {(student.payments || [])
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            drag
            dragMomentum={false}
            className=" 
            bg-white/5 backdrop-blur-lg 
            border border-white/10 
            rounded-3xl 
            w-full max-w-lg p-8 m-4 
            relative overflow-hidden
            "
            style={{
              boxShadow: "0 0 100px rgba(0, 0, 0, 0.42)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              ✕
            </button>

            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeesModal;
