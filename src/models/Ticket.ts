import mongoose, { Document } from "mongoose";

interface ITicket extends Document {
  ticketId: string;
  source: string;
  destination: string;
  sourceId: number;
  destinationId: number;
  journeyType: "single" | "return";
  status: "generated" | "in_use" | "completed" | "expired";
  checkInStation: string | null;
  checkOutStation: string | null;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  fare: number;
  qrImage: string;
  expiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new mongoose.Schema<ITicket>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    sourceId: {
      type: Number,
      required: true,
    },
    destinationId: {
      type: Number,
      required: true,
    },
    journeyType: {
      type: String,
      enum: ["single", "return"],
      required: true,
    },
    status: {
      type: String,
      enum: ["generated", "in_use", "completed", "expired"],
      required: true,
    },
    checkInStation: {
      type: String,
      default: null,
    },
    checkOutStation: {
      type: String,
      default: null,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    fare: {
      type: Number,
      default: null,
    },
    qrImage: {
      type: String,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const ticketModel = mongoose.model<ITicket>("Ticket", ticketSchema);
