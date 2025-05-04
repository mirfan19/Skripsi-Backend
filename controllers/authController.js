const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register a new user
exports.register = async (req, res) => {
  const { role, username, email, password, phone } = req.body;
  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    const existingUsername = await User.findOne({ where: { Username: username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      Username: username,
      Email: email,
      Password: hashedPassword,
      Phone: phone,
      Role: role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        id: user.id,
        username: user.Username,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred during registration.', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ 
      where: { 
        Username: username  // Changed to match the database column name
      }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user.UserID, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.UserID,
          username: user.Username,
          email: user.Email,
          role: user.Role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: 'An error occurred during login.', error: error.message });
  }
};

// Logout a user
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
