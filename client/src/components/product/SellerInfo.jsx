// components/product/SellerInfo.jsx
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
import Button from '../ui/Button';

const SellerInfo = ({ product, onContactSeller, isOwner, compact = false }) => {
  const contactInfo = product.contactInfo;

  if (!contactInfo) {
    return null;
  }

  // Get seller information based on contactInfo
  const getSellerInfo = () => {
    // Get phone from seller contactInfo if not in main contactInfo
    const phone = contactInfo.phone || 
                  product.seller?.companyProfile?.contactInfo?.phone || 
                  product.seller?.individualProfile?.phone;
    
    // Get email from contactInfo (priority) or seller profile
    const email = contactInfo.email || 
                  product.seller?.companyProfile?.contactInfo?.email || 
                  product.seller?.individualProfile?.email;

    // Basic seller name based on type
    let sellerName = 'Seller';
    let sellerType = 'Seller';
    
    if (product.sellerType === 'company' && product.seller?.companyProfile?.companyName) {
      sellerName = product.seller.companyProfile.companyName;
      sellerType = 'Company';
    } else if (product.sellerType === 'individual' && product.seller?.individualProfile) {
      const profile = product.seller.individualProfile;
      sellerName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Individual Seller';
      sellerType = 'Individual Seller';
    }

    return {
      name: sellerName,
      type: sellerType,
      phone: phone,
      email: email,
      verified: product.isVerified || false,
      rating: product.seller?.sellerRating?.average || 0,
      totalReviews: product.seller?.sellerRating?.totalReviews || 0
    };
  };

  const sellerInfo = getSellerInfo();
  const preferredContactMethod = contactInfo.preferredContactMethod;

  // Get preferred contact method display
  const getPreferredContactDisplay = () => {
    const methods = {
      phone: 'Phone Call',
      whatsapp: 'WhatsApp',
      email: 'Email',
      sms: 'SMS'
    };
    return methods[preferredContactMethod] || 'Phone Call';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 ${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* Header */}
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            {product.sellerType === 'company' ? (
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            ) : (
              <UserIcon className="h-6 w-6 text-white" />
            )}
          </div>

          {sellerInfo.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
              <CheckCircleIcon className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-gray-100`}>
            {sellerInfo.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {sellerInfo.type}
            {sellerInfo.verified && (
              <span className="ml-2 text-green-500 font-medium">• Verified</span>
            )}
          </p>

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

      {/* Contact Details */}
      <div className="space-y-3">
        {sellerInfo.phone && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{sellerInfo.phone}</span>
            </div>
            {preferredContactMethod === 'phone' && (
              <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                Preferred
              </span>
            )}
          </div>
        )}

        {sellerInfo.email && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400 min-w-0 flex-1">
              <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{sellerInfo.email}</span>
            </div>
            {preferredContactMethod === 'email' && (
              <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full ml-2">
                Preferred
              </span>
            )}
          </div>
        )}

        {preferredContactMethod === 'whatsapp' && sellerInfo.phone && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <div className="h-4 w-4 mr-2 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                W
              </div>
              <span>WhatsApp</span>
            </div>
            <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
              Preferred
            </span>
          </div>
        )}
      </div>

      {/* Contact Preference Info */}
      {preferredContactMethod && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Preferred contact:</strong> {getPreferredContactDisplay()}
          </p>
        </div>
      )}

      {/* Contact Actions */}
      {!isOwner && (sellerInfo.phone || sellerInfo.email) && (
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Primary contact button based on preference */}
          {preferredContactMethod === 'phone' && sellerInfo.phone ? (
            <Button
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => window.open(`tel:${sellerInfo.phone}`)}
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              Call Now (Preferred)
            </Button>
          ) : preferredContactMethod === 'whatsapp' && sellerInfo.phone ? (
            <Button
              size="sm"
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={() => window.open(`https://wa.me/${sellerInfo.phone.replace(/\D/g, '')}`)}
            >
              <div className="h-4 w-4 mr-2 bg-white rounded text-green-500 text-xs flex items-center justify-center font-bold">
                W
              </div>
              WhatsApp (Preferred)
            </Button>
          ) : sellerInfo.email ? (
            <Button
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={onContactSeller}
            >
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Send Email (Preferred)
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={onContactSeller}
            >
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          )}

          {/* Alternative contact methods */}
          <div className="grid grid-cols-2 gap-2">
            {sellerInfo.phone && preferredContactMethod !== 'phone' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${sellerInfo.phone}`)}
              >
                <PhoneIcon className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}

            {sellerInfo.phone && preferredContactMethod !== 'whatsapp' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/${sellerInfo.phone.replace(/\D/g, '')}`)}
              >
                <div className="h-4 w-4 mr-1 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  W
                </div>
                WhatsApp
              </Button>
            )}

            {sellerInfo.email && preferredContactMethod !== 'email' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onContactSeller}
              >
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Basic Stats */}
      {(sellerInfo.totalReviews > 0 || product.seller?.totalListings) && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            {product.seller?.totalListings && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {product.seller.totalListings}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Listings
                </div>
              </div>
            )}
            {sellerInfo.totalReviews > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {sellerInfo.totalReviews}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Reviews
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInfo;