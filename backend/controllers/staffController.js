import User from "../models/Users.js";

// Get all staff members
export async function getUsers(req, res) {
  try {
    const staffList = await User.findAll();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching staff members: " + error.message });
  }
}

// Get a single staff member
export async function getUserById(req, res) {
  try {
    const staff = await User.findByPk(req.params.id);
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: "Staff member not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching staff member: " + error.message });
  }
}

// Add a new staff member
export async function createUser(req, res) {
  try {
    const staff = await User.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: "Error adding staff member: " + error.message });
  }
}

// Update staff details
export async function updateUser(req, res) {
  try {
    const [updated] = await User.update(req.body, { where: { id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    const updatedStaff = await User.findByPk(req.params.id);
    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ error: "Error updating staff member: " + error.message });
  }
}

// Delete a staff member
export async function deleteUser(req, res) {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ error: "Error deleting staff member: " + error.message });
  }
}
