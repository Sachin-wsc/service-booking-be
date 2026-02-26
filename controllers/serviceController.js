import serviceRepository from "../repository/serviceRepository.js";

const getAllServices = async (req, res) => {
  try {
    const services = await serviceRepository.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAllServices };