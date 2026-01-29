import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "CREATE", "UPDATE", "DELETE"
  entity: { type: String, required: true }, // e.g., "Student", "School"
  entityId: { type: String },
  details: { type: String }, // Human readable summary
  changes: {
    before: { type: Object },
    after: { type: Object },
  },
  user: { type: String, default: "System" }, // Could be user ID or "Admin"
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", logSchema);
