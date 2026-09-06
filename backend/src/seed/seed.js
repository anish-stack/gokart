/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');

const Service = require('../models/Service');
const Product = require('../models/Product');
const CMSPage = require('../models/CMSPage');
const ContactArea = require('../models/ContactArea');
const AppConfig = require('../models/AppConfig');
const AdminUser = require('../models/AdminUser');

const BRAND = {
  appName: 'GO! Track Express',
  mdName: 'Mr Amaresh Kumar',
  cin: 'U53200DL2025PTC457332',
  registeredOffice:
    'Shop No-G-3, P. No. 12, Suneja Tower-II, District Center, Janakpuri A-3, West Delhi, New Delhi, Delhi, 110058',
};

async function seedServices() {
  const existing = await Service.countDocuments();
  if (existing > 0) return console.log('Services already seeded, skipping.');

  await Service.insertMany([
    {
      title: { en: 'GO! Courier', hi: 'गो! कूरियर', mr: '', bn: '', kn: '', te: '' },
      description: {
        en: 'Fast, reliable courier delivery across India for documents and parcels.',
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
      buttonText: { en: 'Learn more', hi: 'और जानें', mr: '', bn: '', kn: '', te: '' },
      externalUrl: 'https://example.com/go-courier',
      sortOrder: 1,
    },
    {
      title: { en: 'GO! Express', hi: 'गो! एक्सप्रेस', mr: '', bn: '', kn: '', te: '' },
      description: {
        en: 'Priority express shipping with next-day delivery in major cities.',
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
      buttonText: { en: 'Learn more', hi: 'और जानें', mr: '', bn: '', kn: '', te: '' },
      externalUrl: 'https://example.com/go-express',
      sortOrder: 2,
    },
    {
      title: { en: 'GO! Solutions', hi: 'गो! सॉल्यूशंस', mr: '', bn: '', kn: '', te: '' },
      description: {
        en: 'End-to-end logistics and supply chain solutions for businesses.',
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
      buttonText: { en: 'Learn more', hi: 'और जानें', mr: '', bn: '', kn: '', te: '' },
      externalUrl: 'https://example.com/go-solutions',
      sortOrder: 3,
    },
  ]);
  console.log('Seeded services.');
}

async function seedProducts() {
  const existing = await Product.countDocuments();
  if (existing > 0) return console.log('Products already seeded, skipping.');

  await Product.insertMany([
    {
      name: { en: 'Shipping Box - Small', hi: '', mr: '', bn: '', kn: '', te: '' },
      description: { en: 'Sturdy small-size shipping box, ideal for documents and light parcels.', hi: '', mr: '', bn: '', kn: '', te: '' },
      image: 'https://example.com/images/box-small.jpg',
      price: 49,
      currency: 'INR',
      externalUrl: 'https://example.com/products/box-small',
      sortOrder: 1,
    },
    {
      name: { en: 'Shipping Box - Large', hi: '', mr: '', bn: '', kn: '', te: '' },
      description: { en: 'Heavy-duty large shipping box for bulky items.', hi: '', mr: '', bn: '', kn: '', te: '' },
      image: 'https://example.com/images/box-large.jpg',
      price: 99,
      currency: 'INR',
      externalUrl: 'https://example.com/products/box-large',
      sortOrder: 2,
    },
    {
      name: { en: 'Tamper-Evident Pouch', hi: '', mr: '', bn: '', kn: '', te: '' },
      description: { en: 'Security pouch for confidential documents and valuables.', hi: '', mr: '', bn: '', kn: '', te: '' },
      image: 'https://example.com/images/pouch.jpg',
      price: 29,
      currency: 'INR',
      externalUrl: 'https://example.com/products/pouch',
      sortOrder: 3,
    },
  ]);
  console.log('Seeded products.');
}

async function seedCms() {
  const existing = await CMSPage.countDocuments();
  if (existing > 0) return console.log('CMS pages already seeded, skipping.');

  await CMSPage.insertMany([
    {
      slug: 'about-us',
      title: { en: 'About Us', hi: '', mr: '', bn: '', kn: '', te: '' },
      body: {
        en: `GO! Track Express is committed to delivering fast, reliable, and transparent logistics across India. Our mission is to connect every corner of the country through dependable courier and express services, and our vision is to become India's most trusted logistics partner.\n\nManaging Director: ${BRAND.mdName}`,
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
      meta: { mdName: BRAND.mdName, cin: BRAND.cin, registeredOffice: BRAND.registeredOffice },
    },
    {
      slug: 'privacy-policy',
      title: { en: 'Privacy Policy', hi: '', mr: '', bn: '', kn: '', te: '' },
      body: {
        en: 'This Privacy Policy describes how GO! Track Express collects, uses, and protects your information. Placeholder content - update with your finalized policy before production launch.',
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
    },
    {
      slug: 'terms',
      title: { en: 'Terms & Conditions', hi: '', mr: '', bn: '', kn: '', te: '' },
      body: {
        en: 'These Terms & Conditions govern your use of the GO! Track Express app and services. Placeholder content - update with your finalized terms before production launch.',
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
    },
    {
      slug: 'legal',
      title: { en: 'Legal Information', hi: '', mr: '', bn: '', kn: '', te: '' },
      body: {
        en: `Corporate Identification Number (CIN): ${BRAND.cin}\nRegistered Office: ${BRAND.registeredOffice}\nManaging Director: ${BRAND.mdName}`,
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
      meta: { cin: BRAND.cin, registeredOffice: BRAND.registeredOffice, mdName: BRAND.mdName },
    },
    {
      slug: 'faq',
      title: { en: 'Frequently Asked Questions', hi: '', mr: '', bn: '', kn: '', te: '' },
      body: {
        en: 'Q: How do I track my shipment?\nA: Enter your AWB number on the Track screen.\n\nQ: What if my AWB is not found?\nA: Double check the number, or contact support from the Contact screen.',
        hi: '', mr: '', bn: '', kn: '', te: '',
      },
    },
  ]);
  console.log('Seeded CMS pages.');
}

async function seedContactAreas() {
  const existing = await ContactArea.countDocuments();
  if (existing > 0) return console.log('Contact areas already seeded, skipping.');

  await ContactArea.insertMany([
    {
      matchType: 'pincode',
      pincode: '110058',
      contactName: 'GO! Track Express - West Delhi Support',
      phone: '+91-00000-00000',
      email: 'support@example.com',
      whatsapp: '+91-00000-00000',
      address: BRAND.registeredOffice,
      workingHours: 'Mon-Sat, 9:00 AM - 7:00 PM',
      priority: 100,
    },
    {
      matchType: 'city',
      city: 'New Delhi',
      contactName: 'GO! Track Express - Delhi NCR Support',
      phone: '+91-00000-00001',
      email: 'delhi.support@example.com',
      whatsapp: '+91-00000-00001',
      address: 'Delhi NCR Regional Office, New Delhi',
      workingHours: 'Mon-Sat, 9:00 AM - 7:00 PM',
      priority: 50,
    },
    {
      matchType: 'default',
      contactName: 'GO! Track Express - National Support',
      phone: '+91-00000-00009',
      email: 'support@example.com',
      whatsapp: '+91-00000-00009',
      address: BRAND.registeredOffice,
      workingHours: 'Mon-Sat, 9:00 AM - 7:00 PM',
      priority: 0,
    },
  ]);
  console.log('Seeded contact areas.');
}

async function seedAppConfig() {
  const existing = await AppConfig.countDocuments();
  if (existing > 0) return console.log('App config already seeded, skipping.');

  await AppConfig.create({
    appName: BRAND.appName,
    logo: 'https://example.com/logo.png',
    supportPhone: '+91-00000-00009',
    supportEmail: 'support@example.com',
    website: 'https://example.com',
    maintenanceMode: false,
    minimumAppVersion: '1.0.0',
    latestAppVersion: '1.0.0',
    storeUrlIOS: 'https://example.com/ios',
    storeUrlAndroid: 'https://example.com/android',
    socialLinks: {},
  });
  console.log('Seeded app config.');
}

async function seedAdminUser() {
  const existing = await AdminUser.countDocuments();
  if (existing > 0) return console.log('Admin users already seeded, skipping.');

  const passwordHash = await AdminUser.hashPassword('ChangeMe123!');
  await AdminUser.create({
    name: BRAND.mdName,
    email: 'admin@example.com',
    passwordHash,
    role: 'SUPER_ADMIN',
  });
  console.log('Seeded default admin user: admin@example.com / ChangeMe123! (CHANGE THIS PASSWORD)');
}

async function run() {
  await mongoose.connect(env.DATABASE_URL);
  console.log('Connected to MongoDB for seeding.');

  await seedServices();
  await seedProducts();
  await seedCms();
  await seedContactAreas();
  await seedAppConfig();
  await seedAdminUser();

  console.log('Seeding complete.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
