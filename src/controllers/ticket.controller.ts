import { Request, Response } from "express";
import { stations } from "../utils/stations";
import { fareModel } from "../models/Fare";
import QRCode from "qrcode";
import { ticketModel } from "../models/Ticket";

export const generateTicket = async (req: Request, res: Response) => {
  try {
    const { source, destination, journeyType } = req.body;


    const sourceStation = stations.find((s) => s.name === source);
    if (!sourceStation) {
      return res.status(400).json({ msg: `${source} is invalid!` });
    }

    const destinationStation = stations.find((s) => s.name === destination);
    if (!destinationStation) {
      return res.status(400).json({ msg: `${destination} is invalid!` });
    }

    const fare = await fareModel.findOne({
      sourceId: sourceStation.id,
      destinationId: destinationStation.id,
    });

    if (!fare) {
      return res.status(400).json({ msg: "Fare not found for this route!" });
    }

    const ticketId = "T" + Date.now() + Math.floor(Math.random() * 100000);

    const qrData = { ticketId, source, destination };
    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

    const now = new Date();
    const expiry = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      23,
      59,
      59
    );

    const newTicket = await ticketModel.create({
      ticketId,
      source,
      destination,
      sourceId: sourceStation.id,
      destinationId: destinationStation.id,
      journeyType,
      status: "generated",
      qrImage,
      expiry,
      fare: fare.price,
      checkInStation: null,
      checkOutStation: null,
      checkInTime: null,
      checkOutTime: null,
    });

    return res.status(201).json({
      msg: "Ticket generated successfully",
      ticket: newTicket,
    });
  } catch (error: any) {
    return res.status(500).json({ msg: "Error generating ticket", error: error.message });
  }
};
