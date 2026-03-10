const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerOfficer = async (req, res) => {
  try {
    const { name, email, phone, password, department } = req.body;
    console.log('Officer registration request:', { name, email, phone, department });

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const officer = await User.create({
      name,
      email,
      phone,
      password,
      role: 'officer',
      status: 'pending',
      department,
    });

    console.log('Officer created:', { id: officer._id, department: officer.department });

    res.status(201).json({
      message: 'Your officer registration request has been sent to the admin for approval. You will receive an email once your account is approved.',
      officer: {
        _id: officer._id,
        name: officer.name,
        email: officer.email,
        status: officer.status,
      },
    });
  } catch (error) {
    console.error('Officer registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerOfficer,
};