import { Router } from "express";
import {
  createRegistration,
  getMyRegistrations,
  updateRegistrationStatus,
  markEntry
} from "../controller/registration.controller.js";

const router = Router();

router.post("/", createRegistration);                // customer
router.get("/my", getMyRegistrations);                // customer
router.patch("/:id/status", updateRegistrationStatus); // organizer
router.post("/scan", markEntry);                      // gate scan

export default router;
