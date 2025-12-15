
import Event from "../models/event.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Registration from "../models/registration.models.js";


export const eventadd = async (req, res) => {
    try {

        const { title, description, venue, date, ticketLimit, approvalMode } = req.body;

        if (!title || !description || !venue || !ticketLimit || !approvalMode || !date) {
            throw ApiError(400, "all fileld requried");
        }
        const event = await Event.create({
            organizer: req.user._id, // from auth middleware
            title,
            description,
            date,
            venue,
            ticketLimit,
            approvalMode


        })
        return res
            .status(201)
            .json(new ApiResponse(201, event, "event add successfully"));

    } catch (error) {
        console.log(error)
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error"
        });

    }
}

export const getMyEvents  = async (req , res )=>{
    try {
        const events = await Event.find({ organizer: req.user._id })
        .sort({ createdAt: -1 });

        return res
        .status(201)
        .json(new ApiResponse(201,events,"event fetch successfully"));


    } catch (error) {
        console.log(error)
        res.status(error.statusCode || 500).json({
          message: error.message || "Internal Server Error"
        });   
    }
}

// Public: fetch all events
export const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      return res
        .status(200)
        .json(new ApiResponse(200, events, "events fetched successfully"));
    } catch (error) {
      console.log(error)
      res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error"
      });
    }
}


export const getEventById = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
        .populate("organizer", "name email");
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error("Get Event Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  
  export const deleteEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // only organizer can delete
      if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      await event.deleteOne();
  
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete Event Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };



  export const getallEventRegUser = async(req,res)=>{
    try {
      const { id }=req.params;
  

   const  allRgustraction= await Registration.find({
        event:id
      });
   

      res.status(200).json({ message: "Data Fetch  successfully" ,data:allRgustraction});
      
    } catch (error) {
      console.error("getallEventRegUser Error:", error);
      res.status(500).json({ message: "Server error" });
      
    }
  }
