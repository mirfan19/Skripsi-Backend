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
      Role: role || 'user', // Default to 'user' if no role specified
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        id: user.UserID,
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
  const { username, password, isAdmin } = req.body;
  try {
    // Find user with the specified conditions
    const user = await User.findOne({
      where: isAdmin ? { 
        Username: username, 
        Role: 'admin'
      } : { 
        Username: username 
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: isAdmin ? 'Invalid admin credentials.' : 'Invalid username or password.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: isAdmin ? 'Invalid admin credentials.' : 'Invalid username or password.'
      });
    }

    // If admin login is requested but user is not an admin
    if (isAdmin && user.Role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have admin privileges.' 
      });
    }

    const token = jwt.sign({ 
      id: user.UserID, 
      role: user.Role 
    }, process.env.JWT_SECRET, { 
      expiresIn: '8h' 
    });

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
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login.', 
      error: error.message 
    });
  }
};

// Logout a user
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// Check user role
exports.checkRole = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { UserID: decoded.id } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.UserID,
        role: user.Role,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.', error: error.message });
  }
};
