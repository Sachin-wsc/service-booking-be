import serviceRepository from "../repository/serviceRepository.js";
import bookingRepository from "../repository/bookingRepository.js";
import providerRepository from "../repository/providerRepository.js";
import availabilityRepository from "../repository/availabilityRepository.js";

const createService = async (req, res) => {
  try {
    const { title, description, price, category_id } = req.body;

    // Validate required fields
    if (!title || !price || !category_id) {
      return res.status(400).json({ message: "Title, price, and category are required" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    // Get provider profile
    const provider = await providerRepository.findByUserId(req.user.id);
    
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // RESTRICTION: Provider can only create services in their registered category
    if (provider.category_id !== category_id) {
      return res.status(403).json({ 
        message: `You can only create services in your registered category: ${provider.category_name}`,
        allowed_category_id: provider.category_id,
        allowed_category_name: provider.category_name
      });
    }

    const serviceId = await serviceRepository.create({
      provider_id: provider.id,
      category_id,
      title,
      description,
      price,
      created_by: req.user.id
    });

    res.status(201).json({ message: "Service created successfully", serviceId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderServices = async (req, res) => {
  try {
    // Get provider profile
    const provider = await providerRepository.findByUserId(req.user.id);
    
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const services = await serviceRepository.findByProvider(provider.id);
    res.json(services);
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

    // Verify ownership
    const provider = await providerRepository.findByUserId(req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category_id } = req.body;

    // Validate required fields
    if (!title || !price || !category_id) {
      return res.status(400).json({ message: "Title, price, and category are required" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    const service = await serviceRepository.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Verify ownership
    const provider = await providerRepository.findByUserId(req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // RESTRICTION: Provider can only update to their registered category
    if (provider.category_id !== category_id) {
      return res.status(403).json({ 
        message: `You can only use your registered category: ${provider.category_name}`,
        allowed_category_id: provider.category_id,
        allowed_category_name: provider.category_name
      });
    }

    await serviceRepository.update(id, {
      category_id,
      title,
      description,
      price,
      updated_by: req.user.id
    });

    res.json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await serviceRepository.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Verify ownership
    const provider = await providerRepository.findByUserId(req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await serviceRepository.remove(id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Availability Management
const addAvailability = async (req, res) => {
  try {
    const { service_id, date, start_time, end_time, is_available } = req.body;

    // Validate required fields
    if (!service_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "Service ID, date, start time, and end time are required" });
    }

    // Verify service exists and ownership
    const service = await serviceRepository.findById(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const providers = await providerRepository.findAll();
    const provider = providers.find(p => p.user_id === req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate time logic
    if (start_time >= end_time) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const availabilityId = await availabilityRepository.create({
      service_id,
      date,
      start_time,
      end_time,
      is_available: is_available !== undefined ? is_available : true,
      created_by: req.user.id
    });

    res.status(201).json({ message: "Availability slot created", availabilityId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceAvailability = async (req, res) => {
  try {
    const { service_id } = req.params;
    const { date } = req.query;

    // Verify service exists and ownership
    const service = await serviceRepository.findById(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const providers = await providerRepository.findAll();
    const provider = providers.find(p => p.user_id === req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    let availability;
    if (date) {
      availability = await availabilityRepository.findByServiceAndDate(service_id, date);
    } else {
      availability = await availabilityRepository.findByService(service_id);
    }

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const availability = await availabilityRepository.findById(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Verify ownership through service
    const service = await serviceRepository.findById(availability.service_id);
    const providers = await providerRepository.findAll();
    const provider = providers.find(p => p.user_id === req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time, is_available } = req.body;

    // Validate required fields
    if (!date || !start_time || !end_time) {
      return res.status(400).json({ message: "Date, start time, and end time are required" });
    }

    const availability = await availabilityRepository.findById(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Verify ownership through service
    const service = await serviceRepository.findById(availability.service_id);
    const providers = await providerRepository.findAll();
    const provider = providers.find(p => p.user_id === req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate time logic
    if (start_time >= end_time) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    await availabilityRepository.update(id, {
      date,
      start_time,
      end_time,
      is_available: is_available !== undefined ? is_available : availability.is_available,
      updated_by: req.user.id
    });

    res.json({ message: "Availability slot updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleAvailabilityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    if (is_available === undefined) {
      return res.status(400).json({ message: "is_available field is required" });
    }

    const availability = await availabilityRepository.findById(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Verify ownership through service
    const service = await serviceRepository.findById(availability.service_id);
    const providers = await providerRepository.findAll();
    const provider = providers.find(p => p.user_id === req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await availabilityRepository.updateStatus(id, is_available, req.user.id);
    res.json({ 
      message: `Availability slot ${is_available ? 'enabled' : 'disabled'} successfully`,
      is_available 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const availability = await availabilityRepository.findById(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Verify ownership through service
    const service = await serviceRepository.findById(availability.service_id);
    const providers = await providerRepository.findAll();
    const provider = providers.find(p => p.user_id === req.user.id);
    
    if (service.provider_id !== provider?.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await availabilityRepository.remove(id);
    res.json({ message: "Availability slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { booking_id, status } = req.body;

    if (!booking_id || !status) {
      return res.status(400).json({ message: "Booking ID and status are required" });
    }

    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await bookingRepository.updateStatus(booking_id, status);
    res.json({ message: "Booking status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { 
  createService, 
  getProviderServices,
  getServiceById,
  updateService,
  deleteService,
  addAvailability,
  getServiceAvailability,
  getAvailabilityById,
  updateAvailability,
  toggleAvailabilityStatus,
  deleteAvailability,
  updateBookingStatus 
};