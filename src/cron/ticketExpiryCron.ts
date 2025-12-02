import cron from "node-cron";
import {ticketModel} from "../models/Ticket";

cron.schedule("* * * * *", async () => {
  console.log("Running expiry cron...");

  const now = new Date();

  await ticketModel.updateMany(
    { expiry: { $lt: now }, status: { $ne: "expired" } },
    { $set: { status: "expired" } }
  );

  console.log("Expired tickets updated");
});
