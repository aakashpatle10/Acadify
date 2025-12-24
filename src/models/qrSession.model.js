// models/qrsession.model.js
import mongoose from "mongoose";

const qrSessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },

    classSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
      index: true,
    },

    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
      index: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true,
    },

    subject: {
      type: String,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    maxUses: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    uses: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// expiresAt ke ~1 min baad document auto-remove
qrSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

qrSessionSchema.methods.isValidNow = function () {
  if (!this.active) return false;
  return this.expiresAt > new Date();
};

export default mongoose.model("QRSession", qrSessionSchema);
