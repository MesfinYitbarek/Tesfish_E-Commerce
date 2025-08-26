export const PRODUCT_TYPE_CONFIG = {
  homes: {
    label: 'Homes & Apartments',
    description: 'Residential properties for sale or rent',
    icon: 'home',
    subTypes: [
      { value: 'apartments', label: 'Apartments', description: 'Multi-unit residential buildings' },
      { value: 'villas', label: 'Villas', description: 'Luxury standalone houses' },
      { value: 'condos', label: 'Condominiums', description: 'Privately owned units in buildings' },
      { value: 'townhouses', label: 'Townhouses', description: 'Multi-story attached homes' },
      { value: 'penthouses', label: 'Penthouses', description: 'Top-floor luxury apartments' },
      { value: 'studios', label: 'Studio Apartments', description: 'Single-room living spaces' },
      { value: 'duplex', label: 'Duplex', description: 'Two-level connected homes' },
      { value: 'traditional-houses', label: 'Traditional Houses', description: 'Local style residential homes' }
    ],
    supportedListingTypes: ['sell', 'rent'],
    defaultFields: ['bedrooms', 'bathrooms', 'area', 'furnishingStatus'],
    requiredFields: ['title', 'description', 'listingType', 'bedrooms', 'area']
  },

  plots: {
    label: 'Plots & Land',
    description: 'Land and plots for development or investment',
    icon: 'map',
    subTypes: [
      { value: 'residential', label: 'Residential Plots', description: 'Land for residential development' },
      { value: 'commercial', label: 'Commercial Plots', description: 'Land for commercial development' },
      { value: 'agricultural', label: 'Agricultural Land', description: 'Farmland and agricultural plots' },
      { value: 'industrial', label: 'Industrial Plots', description: 'Land for industrial development' },
      { value: 'mixed-use', label: 'Mixed-Use Plots', description: 'Multi-purpose development land' },
      { value: 'investment', label: 'Investment Land', description: 'Land for investment purposes' }
    ],
    supportedListingTypes: ['sell', 'rent'],
    defaultFields: ['area', 'landUse', 'topography', 'accessRoad'],
    requiredFields: ['title', 'description', 'listingType', 'area', 'landUse']
  },

  commercials: {
    label: 'Commercial Properties',
    description: 'Business and commercial real estate',
    icon: 'building-office',
    subTypes: [
      { value: 'offices', label: 'Office Spaces', description: 'Professional office buildings and spaces' },
      { value: 'shops', label: 'Retail Shops', description: 'Commercial retail spaces' },
      { value: 'warehouses', label: 'Warehouses', description: 'Storage and distribution facilities' },
      { value: 'restaurants', label: 'Restaurants & Cafes', description: 'Food service establishments' },
      { value: 'hotels', label: 'Hotels & Lodging', description: 'Hospitality properties' },
      { value: 'malls', label: 'Shopping Centers', description: 'Large retail complexes' },
      { value: 'factories', label: 'Factories', description: 'Manufacturing facilities' },
      { value: 'gas-stations', label: 'Gas Stations', description: 'Fuel service stations' }
    ],
    supportedListingTypes: ['sell', 'rent'],
    defaultFields: ['area', 'floors', 'parkingSpaces', 'yearBuilt'],
    requiredFields: ['title', 'description', 'listingType', 'area']
  },

  others: {
    label: 'Other Products',
    description: 'General products and items',
    icon: 'shopping-bag',
    subTypes: [
      { value: 'vehicles', label: 'Vehicles', description: 'Cars, motorcycles, and other vehicles' },
      { value: 'electronics', label: 'Electronics', description: 'Electronic devices and gadgets' },
      { value: 'furniture', label: 'Furniture', description: 'Home and office furniture' },
      { value: 'clothing', label: 'Clothing & Fashion', description: 'Apparel and fashion items' },
      { value: 'books', label: 'Books & Media', description: 'Books, movies, and educational materials' },
      { value: 'sports', label: 'Sports & Recreation', description: 'Sports equipment and recreational items' },
      { value: 'construction-equipment', label: 'Construction Equipment', description: 'Heavy machinery and construction tools' },
      { value: 'business-sale', label: 'Business for Sale', description: 'Existing businesses for sale' },
      { value: 'services', label: 'Services', description: 'Professional and personal services' },
      { value: 'collectibles', label: 'Collectibles & Antiques', description: 'Rare and collectible items' }
    ],
    supportedListingTypes: ['sell'],
    defaultFields: ['brand', 'model', 'condition'],
    requiredFields: ['title', 'description']
  }
};

// Helper functions
export const getProductTypeConfig = (productType) => {
  return PRODUCT_TYPE_CONFIG[productType] || PRODUCT_TYPE_CONFIG.others;
};

export const getSubTypeConfig = (productType, subProductType) => {
  const config = getProductTypeConfig(productType);
  return config.subTypes.find(sub => sub.value === subProductType);
};

export const isRealEstate = (productType) => {
  return ['homes', 'plots', 'commercials'].includes(productType);
};

export const supportsListingType = (productType, listingType) => {
  const config = getProductTypeConfig(productType);
  return config.supportedListingTypes.includes(listingType);
};

export const getRequiredFields = (productType) => {
  const config = getProductTypeConfig(productType);
  return config.requiredFields || [];
};

export const getDefaultFields = (productType) => {
  const config = getProductTypeConfig(productType);
  return config.defaultFields || [];
};

// Property-specific configurations
export const PROPERTY_FEATURES = [
  'Swimming Pool',
  'Garden',
  'Balcony',
  'Terrace',
  'Garage',
  'Security System',
  'Air Conditioning',
  'Central Heating',
  'Fireplace',
  'Walk-in Closet',
  'Laundry Room',
  'Storage Room',
  'Maid\'s Room',
  'Guest Room',
  'Home Office',
  'Gym',
  'Elevator',
  'Basement',
  'Attic',
  'Panoramic View'
];

export const PROPERTY_AMENITIES = [
  'Parking',
  'Security',
  'Elevator',
  'Generator',
  'Water Tank',
  'Internet/WiFi',
  'Cable TV',
  'Intercom',
  'CCTV',
  'Gated Community',
  'Playground',
  'Community Center',
  'Mosque/Church Nearby',
  'School Nearby',
  'Hospital Nearby',
  'Shopping Center Nearby',
  'Public Transport',
  'Bank Nearby',
  'Restaurant Nearby',
  'Park Nearby'
];

export const FURNISHING_STATUS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'fully-furnished', label: 'Fully Furnished' }
];

export const LAND_USE_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'agricultural', label: 'Agricultural' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed-use', label: 'Mixed Use' },
  { value: 'recreational', label: 'Recreational' }
];

export const TOPOGRAPHY_TYPES = [
  { value: 'flat', label: 'Flat' },
  { value: 'sloped', label: 'Sloped' },
  { value: 'hilly', label: 'Hilly' },
  { value: 'terraced', label: 'Terraced' }
];

export const ACCESS_ROAD_TYPES = [
  { value: 'paved', label: 'Paved Road' },
  { value: 'gravel', label: 'Gravel Road' },
  { value: 'dirt', label: 'Dirt Road' },
  { value: 'concrete', label: 'Concrete Road' }
];

export const VEHICLE_FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol/Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'gas', label: 'Natural Gas' }
];

export const VEHICLE_TRANSMISSION_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'semi-automatic', label: 'Semi-Automatic' }
];

export const CONDITION_TYPES = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'refurbished', label: 'Refurbished' },
  { value: 'damaged', label: 'Damaged' }
];

export const PRICE_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'negotiable', label: 'Negotiable' },
  { value: 'starting-from', label: 'Starting From' },
  { value: 'per-unit', label: 'Per Unit' },
  { value: 'per-sqm', label: 'Per Square Meter' }
];

export const SELLER_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company/Agency' },
  { value: 'developer', label: 'Developer' },
  { value: 'broker', label: 'Broker' }
];

export const PRODUCT_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'pending', label: 'Pending Review', color: 'yellow' },
  { value: 'sold', label: 'Sold', color: 'blue' },
  { value: 'rented', label: 'Rented', color: 'purple' },
  { value: 'out-of-stock', label: 'Out of Stock', color: 'orange' },
  { value: 'discontinued', label: 'Discontinued', color: 'red' },
  { value: 'inactive', label: 'Inactive', color: 'gray' }
];

// Validation helpers
export const validateProductType = (productType, subProductType) => {
  const config = getProductTypeConfig(productType);
  if (!config) return false;
  
  if (subProductType) {
    return config.subTypes.some(sub => sub.value === subProductType);
  }
  
  return true;
};

export const validateListingType = (productType, listingType) => {
  if (!listingType) return true; // Optional for non-real estate
  
  const config = getProductTypeConfig(productType);
  return config.supportedListingTypes.includes(listingType);
};

export default PRODUCT_TYPE_CONFIG;