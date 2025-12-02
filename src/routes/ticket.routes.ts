import express from "express";
import { generateTicket, getTicketDetails, validateTicket } from "../controllers/ticket.controller";

const router = express.Router();

router.post('/generate',generateTicket  );
router.get('/details/:ticketId', getTicketDetails);
router.post('/validate',validateTicket)

export default router;