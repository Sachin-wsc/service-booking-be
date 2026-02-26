import bookingRepository from "../repository/bookingRepository.js";
import invoiceRepository from "../repository/invoiceRepository.js";
import serviceRepository from "../repository/serviceRepository.js";

const createBooking = async (req, res) => {
  try {
    const { service_id, date, time } = req.body;

    const bookingId = await bookingRepository.create({
      user_id: req.user.id,
      service_id,
      date,
      time
    });

    const services = await serviceRepository.findAll();
    const service = services.find(s => s.id == service_id);

    await invoiceRepository.create(bookingId, service.price);

    res.json({ message: "Booking created with invoice", bookingId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingRepository.findByUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { createBooking, getUserBookings };