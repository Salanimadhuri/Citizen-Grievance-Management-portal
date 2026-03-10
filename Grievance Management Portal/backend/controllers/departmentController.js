const Department = require('../models/Department');

const createDepartment = async (req, res) => {
  try {
    const { name, slaHours, contactEmail } = req.body;

    const departmentExists = await Department.findOne({ name });
    if (departmentExists) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await Department.create({ name, slaHours, contactEmail });
    
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, slaHours, contactEmail } = req.body;
    
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = name || department.name;
    department.slaHours = slaHours || department.slaHours;
    department.contactEmail = contactEmail || department.contactEmail;

    await department.save();
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.deleteOne();
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
};
