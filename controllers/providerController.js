import serviceRepository from "../repository/serviceRepository.js";
import bookingRepository from "../repository/bookingRepository.js";

const createService = async (req, res) => {
  try {
    const { title, description, price, category_id } = req.body;

    const serviceId = await serviceRepository.create({
      provider_id: req.user.id,
      category_id,
      title,
      description,
      price
    });

    res.json({ message: "Service created", serviceId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderServices = async (req, res) => {
  try {
    const services = await serviceRepository.findByProvider(req.user.id);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { booking_id, status } = req.body;
    await bookingRepository.updateStatus(booking_id, status);
    res.json({ message: "Booking status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { createService, getProviderServices, updateBookingStatus };