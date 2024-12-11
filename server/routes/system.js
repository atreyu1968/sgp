import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get server logs with filtering and pagination
router.get('/logs', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const options = {
      level: req.query.level,
      search: req.query.search,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };

    const result = logger.getLogs(options);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

// Clear server logs
router.delete('/logs', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    logger.clearLogs();
    res.json({ message: 'Logs cleared successfully' });
  } catch (error) {
    logger.error('Error clearing logs:', error);
    res.status(500).json({ message: 'Error clearing logs' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;