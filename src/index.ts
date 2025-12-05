import "dotenv/config";
import express from "express";
import ticketRoutes from "./routes/ticket.routes";
import fareRoutes from "./routes/fare.routes";
import errorHandler from "./middlewares/errorHandler";
import { dbConnect } from "./config/db";
import "./cron/ticketExpiryCron";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/ticket", ticketRoutes);
app.use("/api/fare", fareRoutes);
app.use(errorHandler);

dbConnect();

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});
