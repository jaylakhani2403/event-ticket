
import Event from "../models/event.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Registration from "../models/registration.models.js";


export const eventadd = async (req, res) => {
  try {
    const { title, description, venue, date, ticketLimit, approvalMode } = req.body;

    if (!title || !description || !venue || !ticketLimit || !approvalMode || !date) {
      throw new ApiError(400, "all fields required");
    }
    const event = await Event.create({
      organizer: req.user._id,
      title,
      description,
      date,
      venue,
      ticketLimit,
      approvalMode,
    });
    return res.status(201).json(new ApiResponse(201, event, "event add successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, events, "event fetch successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
};

// Public: fetch all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, events, "events fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
};


export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    return res.status(200).json(new ApiResponse(200, event, "event fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
};

  
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    await event.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
};



export const getallEventRegUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allRgustraction = await Registration.find({ event: id });
    return res.status(200).json(new ApiResponse(200, allRgustraction, "Data Fetch successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message || "Server error"));
  }
};
