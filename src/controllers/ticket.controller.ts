import { Request, Response } from "express";
import { stations } from "../utils/stations";
import { fareModel } from "../models/Fare";
import QRCode from "qrcode";
import { ticketModel } from "../models/Ticket";
import { log } from "console";

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
    return res
      .status(500)
      .json({ msg: "Error generating ticket", error: error.message });
  }
};

export const checkInTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId, station } = req.body;

    const stationData = stations.find((s) => s.name === station);
    if (!stationData) {
      return res.status(400).json({ msg: `${station} is invalid!` });
    }

    const ticket = await ticketModel.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({ msg: `${ticketId} is invalid` });
    }

    if (new Date() > ticket.expiry) {
      ticket.status = "expired";
      await ticket.save();
      return res.status(400).json({ msg: `Ticket Expired!` });
    }

    if (ticket.status !== "generated") {
      return res.status(400).json({ msg: `ticket already ${ticket.status}` });
    }

    if (ticket.source !== station) {
      return res.status(400).json({
        msg: `The check-in is only allowed at source station: ${ticket.source}`,
      });
    }

    ticket.status = "in_use";
    ticket.checkInStation = station;
    ticket.checkInTime = new Date();
    await ticket.save();

    return res.status(200).json({
      msg: "Checked-in successful",
      ticket,
    });
  } catch (error: any) {
    return res.status(500).json({
      msg: `check-in failed`,
      err: error.message,
    });
  }
};

export const checkOutTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId, station } = req.body;
    const stationData = stations.find((s) => s.name === station);
    if (!stationData) {
      return res.status(400).json({ msg: `${station} is invalid!` });
    }

    const ticket = await ticketModel.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({
        msg: `${ticketId} is invalid`,
      });
    }

    const currentTime = new Date();

    if (currentTime > ticket.expiry) {
      ticket.status = "expired";
      await ticket.save();
      return res.status(400).json({
        msg: `ticket is Expired`,
      });
    }

    if (ticket.status != "in_use") {
      return res
        .status(400)
        .json({ msg: `Ticket is already: ${ticket.status}` });
    }

    if (ticket.destination !== station) {
      return res.status(400).json({
        msg: `The checkout is only Allowed at destination station: ${ticket.destination} `,
      });
    }

    ticket.status = "completed";
    ticket.checkOutStation = station;
    ticket.checkOutTime = new Date();

    await ticket.save();

    return res.status(200).json({
      msg: `Checked-out successfully`,
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      msg: `Check-out failed`,
      error: (error as Error).message,
    });
  }
};

export const getTicketDetails = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const ticket = await ticketModel.findOne({ ticketId });
  if (ticket) {
    return res.status(200).json({
      msg: "Ticket Fetched Successfully",
      ticket,
    });
  } else {
    return res.status(404).json({
      msg: `Sorry can't find the Ticket with respect to the Given TicketId: ${ticketId}`,
    });
  }
};

export const validateTicket = async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  if (!ticketId) {
    return res.status(400).json({
      msg: "TicketId is Mandatory!",
    });
  }
  const ticket = await ticketModel.findOne({ ticketId });
  if (!ticket) {
    return res.status(404).json({
      msg: `Ticket not found with the respective ticketId : ${ticketId}`,
    });
  }
  const currentDate = new Date();

  if (currentDate > ticket.expiry) {
    ticket.status = "expired";
    await ticket.save();
    return res.status(410).json({
      msg:`Ticket with the ticketId ${ticketId} is expired!`
    })
  }
  if(ticket.status === "generated" || ticket.status === "in_use"){
    return res.status(200).json({
      msg:"Ticket is valid!",
      ticket
    })
  }else{
    return res.status(410).json({
      msg:"Ticket is invalid!"
    })
  }


};
