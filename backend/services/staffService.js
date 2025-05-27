import User from "../models/Users.js";

// Get all staff members
const getAllStaff = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    throw new Error("Error fetching staff members: " + error.message);
  }
};

// Get a single staff member by ID
const getStaffById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (error) {
    throw new Error("Error fetching staff member: " + error.message);
  }
};

// Add a new staff member
const addStaff = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    throw new Error("Error adding staff member: " + error.message);
  }
};

// Update an existing staff member
const updateStaff = async (id, userData) => {
  try {
    const [updated] = await User.update(userData, { where: { id } });
    if (!updated) {
      throw new Error("Staff member not found");
    }
    return await User.findByPk(id);
  } catch (error) {
    throw new Error("Error updating staff member: " + error.message);
  }
};

// Delete a staff member
const deleteStaff = async (id) => {
  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      throw new Error("Staff member not found");
    }
    return { message: "Staff member deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting staff member: " + error.message);
  }
};

export default {
  getAllStaff,
  getStaffById,
  addStaff,
  updateStaff,
  deleteStaff,
};
