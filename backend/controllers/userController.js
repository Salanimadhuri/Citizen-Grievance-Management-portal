const User = require('../models/User');

const getOfficers = async (req, res) => {
  try {
    const officers = await User.find({ role: "officer" })
      .select("name email");
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching officers" });
  }
};

module.exports = {
  getOfficers
};