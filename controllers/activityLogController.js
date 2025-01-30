'use strict';

const { ActivityLog } = require('../models');

exports.createActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.create(req.body);
    res.status(201).json(activityLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.findAll();
    res.status(200).json(activityLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityLogById = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findByPk(req.params.id);
    if (!activityLog) {
      return res.status(404).json({ error: 'Activity Log not found' });
    }
    res.status(200).json(activityLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateActivityLog = async (req, res) => {
  try {
    const [updated] = await ActivityLog.update(req.body, {
      where: { LogID: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Activity Log not found' });
    }
    const updatedActivityLog = await ActivityLog.findByPk(req.params.id);
    res.status(200).json(updatedActivityLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteActivityLog = async (req, res) => {
  try {
    const deleted = await ActivityLog.destroy({
      where: { LogID: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Activity Log not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
