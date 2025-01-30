'use strict';

const { Wishlist } = require('../models');

exports.createWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.create(req.body);
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.findAll();
    res.status(200).json(wishlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByPk(req.params.id);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWishlist = async (req, res) => {
  try {
    const [updated] = await Wishlist.update(req.body, {
      where: { WishlistID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    const updatedWishlist = await Wishlist.findByPk(req.params.id);
    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const deleted = await Wishlist.destroy({
      where: { WishlistID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
