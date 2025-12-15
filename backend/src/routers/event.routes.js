import express from "express";
import {
  eventadd,
  getAllEvents,
  getMyEvents,
  getEventById,
  deleteEvent,
  getallEventRegUser
} from "../controller/event.controller.js";
import authmiddleware from '../middlewares/auth.middlewere.js';

const router = express.Router();

// Public list
router.get("/", getAllEvents);

// Organizer actions
router.post("/", authmiddleware, eventadd);
router.get("/my-events", authmiddleware, getMyEvents);

// Public details
router.get("/:id", getEventById);

// Organizer delete
router.delete("/:id", authmiddleware, deleteEvent);
router.get("/allRegUser/:id",authmiddleware,getallEventRegUser);

export default router;
