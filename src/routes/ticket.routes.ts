import express from "express";
import { checkInTicket, checkOutTicket, generateTicket, getTicketDetails, validateTicket } from "../controllers/ticket.controller";

const router = express.Router();

router.post('/generate',generateTicket  );
router.get('/details/:ticketId', getTicketDetails);
router.post('/validate',validateTicket);
router.post('/checkin', checkInTicket);
router.post('/checkout', checkOutTicket);
router.get('/:ticketId', getTicketDetails);

export default router;