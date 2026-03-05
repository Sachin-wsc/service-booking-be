import providerRepository from "../repository/providerRepository.js";
import categoryRepository from "../repository/categoryRepository.js";
import userRepository from "../repository/userRepository.js";

const approveProvider = async (req, res) => {
  try {
    const { provider_id } = req.body;
    console.log("Approving provider with ID:", provider_id);
    
    const approvedBy = req.user?.id;
    await providerRepository.approve(provider_id, approvedBy);
    // also mark the associated user active
    await userRepository.updateStatusByProviderId(provider_id, 'active', approvedBy);
    res.json({ message: "Provider approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProviders = async (req, res) => {
  try {
    const providers = await providerRepository.findAll();
    res.json(providers);
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

// Category CRUD operations
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const createdBy = req.user?.id;
    const id = await categoryRepository.create({ name, description, created_by: createdBy });
    res.status(201).json({ message: "Category created", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryRepository.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const updatedBy = req.user?.id;
    
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    await categoryRepository.update(id, { name, description, updated_by: updatedBy });
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    await categoryRepository.remove(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { 
  approveProvider, 
  getAllProviders,
  getAllUsers, 
  blockUser,
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};