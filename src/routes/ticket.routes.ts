import express from "express";
import { checkInTicket, checkOutTicket, generateTicket, getTicketDetails, validateTicket } from "../controllers/ticket.controller";

const router = express.Router();

router.post('/generate', generateTicket);
router.post('/validate', validateTicket);
router.post('/checkin', checkInTicket);
router.post('/checkout', checkOutTicket);

router.get('/details/:ticketId', getTicketDetails); // specific routes first
router.get('/:ticketId', getTicketDetails);         // optional, general route last


export default router;