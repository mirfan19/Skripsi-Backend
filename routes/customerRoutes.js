// customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Create a new customer
router.post("/", customerController.create);

// Retrieve all customers
router.get("/", customerController.findAll);

// Find a single customer by ID
router.get("/:id", customerController.findOne);

// Update a customer by ID
router.put("/:id", customerController.update);

// Delete a customer by ID
router.delete("/:id", customerController.delete);

module.exports = router;
