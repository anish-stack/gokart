const SHIPMENT_STATUSES = [
  'BOOKED',
  'PICKED_UP',
  'IN_TRANSIT',
  'ARRIVED_AT_HUB',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'DELAYED',
  'CANCELLED',
  'EXCEPTION',
];

const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'bn', 'kn', 'te'];

const LANGUAGE_LABELS = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  bn: 'Bengali',
  kn: 'Kannada',
  te: 'Telugu',
};

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'SUPPORT'];

const CMS_SLUGS = ['about-us', 'privacy-policy', 'terms', 'legal', 'faq'];

const NOTIFICATION_TRIGGER_STATUSES = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

module.exports = {
  SHIPMENT_STATUSES,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  ADMIN_ROLES,
  CMS_SLUGS,
  NOTIFICATION_TRIGGER_STATUSES,
};
