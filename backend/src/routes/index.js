const express = require('express');

const trackingRoutes = require('./tracking');
const servicesRoutes = require('./services');
const productsRoutes = require('./products');
const articlesRoutes = require('./articles');
const contactRoutes = require('./contact');
const cmsRoutes = require('./cms');
const configRoutes = require('./config');
const languagesRoutes = require('./languages');
const notificationsRoutes = require('./notifications');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/tracking', trackingRoutes);
router.use('/services', servicesRoutes);
router.use('/products', productsRoutes);
router.use('/articles', articlesRoutes);
router.use('/contact', contactRoutes);
router.use('/cms', cmsRoutes);
router.use('/config', configRoutes);
router.use('/languages', languagesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } }));

module.exports = router;
