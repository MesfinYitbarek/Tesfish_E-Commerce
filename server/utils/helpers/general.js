import slugify from 'slugify';

// Generate unique slug
export const generateUniqueSlug = async (title, Model) => {
  let slug = slugify(title, { lower: true, strict: true });
  let counter = 1;
  
  while (await Model.findOne({ slug })) {
    slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
    counter++;
  }
  
  return slug;
};

// Format currency
export const formatCurrency = (amount, currency = 'ETB') => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Generate random string
export const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Paginate results
export const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

// Build search query
export const buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};