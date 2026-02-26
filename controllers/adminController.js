import providerRepository from "../repository/providerRepository.js";
import categoryRepository from "../repository/categoryRepository.js";
import userRepository from "../repository/userRepository.js";

const approveProvider = async (req, res) => {
  try {
    const { provider_id } = req.body;
    const approvedBy = req.user?.id;
    await providerRepository.approve(provider_id, approvedBy);
    res.json({ message: "Provider approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.user?.id;
    const id = await categoryRepository.create({ name, description, created_by: createdBy });
    res.json({ message: "Category created", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.body;
    const blockedBy = req.user?.id;
    await userRepository.blockUser(id, blockedBy);
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { approveProvider, addCategory, getAllUsers, blockUser };