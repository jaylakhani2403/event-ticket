import express from "express";
import {
  eventadd,
  getMyEvents,
  getEventById,
  deleteEvent
} from "../controller/event.controller.js";
import authmiddleware from '../middlewares/auth.middlewere.js';

const router = express.Router();

router.post("/", authmiddleware, eventadd);
router.get("/my-events", authmiddleware, getMyEvents);
router.get("/:id", getEventById);
router.delete("/:id", authmiddleware, deleteEvent);

export default router;
