import express from "express";
import { generateTicket } from "../controllers/ticket.controller";

const router = express.Router();

router.post('/generate',generateTicket);

export default router;