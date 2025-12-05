// // models/teacherattendance.model.js
// import mongoose from "mongoose";

// const qrSessionSchema = new mongoose.Schema(
//   {
//     // Token string (signed JWT or random uuid). We store it so we can revoke/inspect.
//     token: { type: String, required: true, unique: true },

//     // Which class this QR is valid for (only students of this class can mark attendance)
//     classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },

//     // Which timetable/session this QR belongs to (optional but useful)
//     timetableId: { type: mongoose.Schema.Types.ObjectId, ref: "Timetable", required: true },

//     // Teacher who created this QR
//     teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },

//     // Subject name or id (useful for quick queries)
//     subject: { type: String },

//     // When the QR was created
//     issuedAt: { type: Date, default: Date.now },

//     // When the QR expires (used to validate and can be TTL indexed for cleanup)
//     expiresAt: { type: Date, required: true, index: true },

//     // Optional: maximum number of uses (0 = unlimited within time window)
//     maxUses: { type: Number, default: 0 },

//     // Number of times QR has been used so far (increment on successful mark)
//     uses: { type: Number, default: 0 },

//     // Status flags: active (true until expired or revoked)
//     active: { type: Boolean, default: true },

//     // Optional: store meta like classroom/location or IP binding if required
//     meta: {
//       ipWhitelist: [String],    // optional list of allowed IPs (not required)
//       location: String,         // e.g., "Block A - Lab 3"
//       deviceBinding: String,    // optional device id if you bind to teacher device
//     },
//   },
//   { timestamps: true }
// );

// // TTL index to auto-remove sessions after expiry + small buffer (Mongo expects seconds)
// qrSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 }); // cleanup ~1 min after expiresAt

// // helper virtual or method to check validity quickly
// qrSessionSchema.methods.isValidNow = function () {
//   if (!this.active) return false;
//   const now = new Date();
//   return this.expiresAt > now;
// };

// export default mongoose.model("QRSession", qrSessionSchema);
