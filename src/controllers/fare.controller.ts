import { fareModel } from "../models/Fare";
import { stations } from "../utils/stations";
import { Request, Response } from "express";
import { setFareDTO } from "../types/fare";

export const setFare = async (req: Request<{},{},setFareDTO>, res: Response) => {
  const { source, destination, price } = req.body;
  if (!source && !destination) {
    return res.send(`The source and destination is Required!!`);
  } else {
    if (source === destination) {
      return res.send(`The source and destination cannot be same!!`);
    }
  }
  const sourceStation = stations.find((s) => s.name.toLowerCase() === source.toLowerCase());
  if (!sourceStation) {
    return res.status(400).send(`Invalid source station: ${source}`);
  }
  const destinationStation = stations.find(
    (station) => station.name.toLowerCase() === destination.toLowerCase()
  );
  if (!destinationStation) {
    return res.status(400).send(`Invalid destination station: ${destination}`);
  }

  if (price <= 0) {
    return res.send(`The price cannot be 0 or less than 0 `);
  }

  const sourceId = sourceStation.id;
  const destinationId = destinationStation.id;

  const exists = await fareModel.findOne({ sourceId, destinationId });
  let newFare;
  if (exists) {
    exists.price = price;
    await exists.save(); // save the updated fare
  } else {
    newFare = await fareModel.create({
      source:sourceStation.name,
      destination:destinationStation.name,
      sourceId,
      destinationId,
      price,
    });
  }

  return res.status(200).json({
    message: exists ? "Fare updated successfully" : "Fare created successfully",
    fare: exists || newFare,
  });
};

export const listFare = async (_req:Request, res:Response) => {
    const fareList = await fareModel.find();
    return res.status(200).json({
        msg:"This is the fare List of the source Stations and Destination Stations",
        data:fareList
    })
}