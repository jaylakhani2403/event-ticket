

import Registration from "../models/registration.models.js";
import Event from "../models/event.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from "uuid";


export  const createRegistration = async (req, res) => {
  try {
    const { event, name, email } = req.body;

    if (!event || !name || !email) {
      throw new ApiError(400, "All fields are required");
    }

    // 1️⃣ Fetch event
    const eventData = await Event.findById(event);
    if (!eventData) {
      throw new ApiError(404, "Event not found");
    }

    // 2️⃣ Decide status based on approval mode
    let status = "pending";
    let ticketId = null;

    if (eventData.approvalMode === "auto") {
      status = "approved";
      ticketId = uuidv4();        
    }

    // 3️⃣ Create registration
    const registration = await Registration.create({
      event,
      name,
      email,
      status,
      ticketId
    });

     // 4️⃣ Increment count ONLY if approved
     if (status === "approved") {

        console.log(event)
        await Event.findByIdAndUpdate(event, {
          $inc: { totalRegister: 1 }
        });
      }
  



    return res.status(201).json(
      new ApiResponse(201, registration, "Registration submitted")
    );

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const registrations = await Registration.find({ email })
      .populate("event");

    return res
      .status(200)
      .json(new ApiResponse(200, registrations, "Registrations fetched"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};


export const updateRegistrationStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!["approved", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status");
      }
  
      const registration = await Registration.findById(id);
      if (!registration) {
        throw new ApiError(404, "Registration not found");
      }
  
      
      if (registration.status === "approved" && status === "approved") {
        return res
          .status(200)
          .json(new ApiResponse(200, registration, "Already approved"));
      }
  
  
      if (registration.status !== "approved" && status === "approved") {
        registration.ticketId = uuidv4();
  
        await Event.findByIdAndUpdate(registration.event, {
          $inc: { totalRegister: 1 }
        });
      }
  
      registration.status = status;
      await registration.save();
  
      return res
        .status(200)
        .json(new ApiResponse(200, registration, "Status updated"));
    } catch (error) {
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error"
      });
    }
  };

 export const markEntry = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      throw new ApiError(400, "Ticket ID required");
    }

    const registration = await Registration.findOne({ ticketId });
    if (!registration) {
      throw new ApiError(404, "Invalid ticket");
    }

    if (registration.status !== "approved") {
      throw new ApiError(403, "Ticket not approved");
    }

    if (registration.entryTime) {
      throw new ApiError(400, "Entry already marked");
    }

    registration.entryTime = new Date();
    await registration.save();

    return res
      .status(200)
      .json(new ApiResponse(200, registration, "Entry marked successfully"));
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error"
    });
  }
};


