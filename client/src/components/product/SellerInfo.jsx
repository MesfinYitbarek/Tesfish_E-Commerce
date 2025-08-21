import {
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../utils/helpers';
import Button from '../ui/Button';

const SellerInfo = ({ product, onContactSeller, isOwner }) => {
  const seller = product.seller;

  if (!seller) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400">Seller information not available</p>
      </div>
    );
  }

  const getSellerInfo = () => {
    if (seller.userType === 'company') {
      return {
        name: seller.companyProfile?.companyName || 'Company',
        type: 'Company',
        avatar: seller.companyProfile?.logo,
        description: seller.companyProfile?.description,
        location: seller.companyProfile?.contactInfo?.address,
        phone: seller.companyProfile?.contactInfo?.phone,
        email: seller.companyProfile?.contactInfo?.email,
        website: seller.companyProfile?.website,
        businessCategories: seller.companyProfile?.businessCategories || [],
        establishedYear: seller.companyProfile?.establishedYear,
        teamSize: seller.companyProfile?.teamSize,
        verified: seller.isVerified,
        joinedDate: seller.createdAt,
        rating: seller.rating || 0,
        totalReviews: seller.totalReviews || 0,
        totalListings: seller.totalListings || 0,
        responseTime: seller.responseTime || 'Within 24 hours',
        responseRate: seller.responseRate || 95
      };
    } else if (seller.userType === 'individual') {
      const profile = seller.individualProfile;
      return {
        name: `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Individual',
        type: 'Individual Seller',
        avatar: profile?.avatar,
        description: profile?.bio,
        location: profile?.location,
        phone: profile?.phone,
        email: seller.email,
        verified: seller.isVerified,
        joinedDate: seller.createdAt,
        rating: seller.rating || 0,
        totalReviews: seller.totalReviews || 0,
        totalListings: seller.totalListings || 0,
        responseTime: seller.responseTime || 'Within 24 hours',
        responseRate: seller.responseRate || 95
      };
    }

    return {
      name: 'Unknown Seller',
      type: 'User',
      verified: false,
      joinedDate: seller.createdAt,
      rating: 0,
      totalReviews: 0,
      totalListings: 0,
      responseTime: 'Unknown',
      responseRate: 0
    };
  };

  const sellerInfo = getSellerInfo();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          {sellerInfo.avatar ? (
            <img
              src={sellerInfo.avatar}
              alt={sellerInfo.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              {seller.userType === 'company' ? (
                <BuildingOfficeIcon className="h-8 w-8 text-white" />
              ) : (
                <UserIcon className="h-8 w-8 text-white" />
              )}
            </div>
          )}

          {sellerInfo.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
              <CheckCircleIcon className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {sellerInfo.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sellerInfo.type}
                {sellerInfo.verified && (
                  <span className="ml-2 text-green-500 font-medium">• Verified</span>
                )}
              </p>
            </div>
          </div>

          {/* Rating */}
          {sellerInfo.rating > 0 && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(sellerInfo.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {sellerInfo.rating.toFixed(1)} ({sellerInfo.totalReviews} reviews)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {sellerInfo.description && (
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {sellerInfo.description}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {sellerInfo.totalListings}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Active Listings
          </div>
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {sellerInfo.responseRate}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Response Rate
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>
            {sellerInfo.joinedDate
              ? `Joined ${formatRelativeTime(sellerInfo.joinedDate)}`
              : 'Member since unknown date'
            }
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>Responds {sellerInfo.responseTime}</span>
        </div>

        {sellerInfo.location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{sellerInfo.location}</span>
          </div>
        )}

        {seller.userType === 'company' && sellerInfo.businessCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {sellerInfo.businessCategories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full"
              >
                {category.replace('-', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Company Additional Info */}
      {seller.userType === 'company' && (
        <div className="mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {sellerInfo.establishedYear && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Established:</span>
                <span className="ml-1 text-gray-900 dark:text-gray-100">{sellerInfo.establishedYear}</span>
              </div>
            )}

            {sellerInfo.teamSize && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Team Size:</span>
                <span className="ml-1 text-gray-900 dark:text-gray-100">{sellerInfo.teamSize}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Actions */}
      {!isOwner && (
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={onContactSeller}
          >
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>

          {sellerInfo.phone && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`tel:${sellerInfo.phone}`)}
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          )}

          {sellerInfo.website && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.open(sellerInfo.website, '_blank')}
            >
              Visit Website
            </Button>
          )}
        </div>
      )}

      {/* Report Link */}
      {!isOwner && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
            Report this listing
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerInfo;