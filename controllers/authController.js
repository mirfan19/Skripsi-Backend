const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Customer } = require('../models');

// Register a new user (Admin or Customer)
exports.register = async (req, res) => {
    const { role, username, email, password, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = role === 'admin' ? await Admin.create({
            Username: username,
            Email: email,
            Password: hashedPassword,
            Phone: phone,
            Role: role
        }) : await Customer.create({
            Username: username,
            Email: email,
            Password: hashedPassword,
            Phone: phone
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = role === 'admin' ? await Admin.findOne({ where: { Username: username } }) : await Customer.findOne({ where: { Username: username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Logout a user
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};