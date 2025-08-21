import Product from '../../models/Product.js';
import User from '../../models/User.js';

// Advanced product search
export const searchProducts = async (searchParams) => {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    location,
    propertyType,
    bedrooms,
    bathrooms,
    page = 1,
    limit = 12,
    sort = 'relevance'
  } = searchParams;

  let searchQuery = { status: 'active' };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Category filter
  if (category) {
    searchQuery.category = category;
  }

  // Price range
  if (minPrice || maxPrice) {
    searchQuery['pricing.basePrice'] = {};
    if (minPrice) searchQuery['pricing.basePrice'].$gte = Number(minPrice);
    if (maxPrice) searchQuery['pricing.basePrice'].$lte = Number(maxPrice);
  }

  // Location filter for real estate
  if (location) {
    searchQuery['realEstateDetails.location.city'] = new RegExp(location, 'i');
  }

  // Property type filter
  if (propertyType) {
    searchQuery['realEstateDetails.propertyType'] = propertyType;
  }

  // Bedrooms filter
  if (bedrooms) {
    searchQuery['realEstateDetails.bedrooms'] = { $gte: Number(bedrooms) };
  }

  // Bathrooms filter
  if (bathrooms) {
    searchQuery['realEstateDetails.bathrooms'] = { $gte: Number(bathrooms) };
  }

  // Sorting
  let sortQuery = {};
  switch (sort) {
    case 'price-low':
      sortQuery = { 'pricing.basePrice': 1 };
      break;
    case 'price-high':
      sortQuery = { 'pricing.basePrice': -1 };
      break;
    case 'newest':
      sortQuery = { createdAt: -1 };
      break;
    case 'popular':
      sortQuery = { views: -1 };
      break;
    case 'relevance':
    default:
      if (query) {
        sortQuery = { score: { $meta: 'textScore' } };
      } else {
        sortQuery = { createdAt: -1 };
      }
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(searchQuery)
    .populate('seller', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName')
    .populate('category', 'name slug')
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(searchQuery);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Search suggestions
export const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];

  const suggestions = await Product.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ],
        status: 'active'
      }
    },
    {
      $group: {
        _id: null,
        titles: { $addToSet: '$title' }
      }
    },
    {
      $project: {
        suggestions: {
          $slice: ['$titles', 5]
        }
      }
    }
  ]);

  return suggestions[0]?.suggestions || [];
};