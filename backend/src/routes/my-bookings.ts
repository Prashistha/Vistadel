import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});
router.delete("/:hotelId/:bookingId", async (req: Request, res: Response) => {
  const { hotelId, bookingId } = req.params;

  try {
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Find the booking index in the hotel's bookings array
    const bookingIndex = hotel.bookings.findIndex((booking) => booking._id.toString() === bookingId);

    if (bookingIndex === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Remove the booking from the array
    hotel.bookings.splice(bookingIndex, 1);

    // Save the updated hotel document
    await hotel.save();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete booking" });
  }
});

export default router;