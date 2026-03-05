import serviceRepository from "../repository/serviceRepository.js";
import availabilityRepository from "../repository/availabilityRepository.js";

const getAllServices = async (req, res) => {
  try {
    const services = await serviceRepository.findServicesWithAvailability();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableServices = async (req, res) => {
  try {
    const services = await serviceRepository.findServicesWithAvailability();
    const availableServices = services.filter(s => s.available_slots > 0);
    res.json(availableServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceRepository.findById(id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Get upcoming available slots
    const availability = await availabilityRepository.findUpcomingAvailable(id);
    
    res.json({ ...service, availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const service = await serviceRepository.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let availability;
    if (date) {
      availability = await availabilityRepository.findAvailableSlots(id, date);
    } else {
      availability = await availabilityRepository.findUpcomingAvailable(id);
    }

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAllServices, getAvailableServices, getServiceById, getServiceAvailability };