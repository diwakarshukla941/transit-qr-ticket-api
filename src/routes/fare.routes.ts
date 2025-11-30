import express from "express";
import { listFare, setFare } from "../controllers/fare.controller";

const router = express.Router();

router.post("/set", setFare);
router.get("/list", listFare);

export default router;
