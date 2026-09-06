const express = require('express');

const authRoutes = require('./auth');
const servicesRoutes = require('./services');
const productsRoutes = require('./products');
const articlesRoutes = require('./articles');
const cmsRoutes = require('./cms');
const contactAreasRoutes = require('./contactAreas');
const shipmentsRoutes = require('./shipments');
const notificationLogsRoutes = require('./notificationLogs');
const usersRoutes = require('./users');
const appConfigRoutes = require('./appConfig');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/services', servicesRoutes);
router.use('/products', productsRoutes);
router.use('/articles', articlesRoutes);
router.use('/cms', cmsRoutes);
router.use('/contact-areas', contactAreasRoutes);
router.use('/shipments', shipmentsRoutes);
router.use('/notification-logs', notificationLogsRoutes);
router.use('/users', usersRoutes);
router.use('/config', appConfigRoutes);

module.exports = router;
