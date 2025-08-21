import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  StarIcon, 
  PlusIcon,
  HandThumbUpIcon,
  FlagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const ProductReviews = ({ product, canReview }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchReviews();
  }, [product._id, sortBy, filterBy]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockReviews = [
          {
            _id: '1',
            user: {
              _id: 'user1',
              customerProfile: {
                firstName: 'Sarah',
                lastName: 'Johnson',
                avatar: '/api/placeholder/40/40'
              },
              userType: 'customer'
            },
            rating: 5,
            comment: 'Excellent property! The location is perfect and the seller was very responsive. Highly recommended.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            helpful: 12,
            isHelpful: false,
            images: ['/api/placeholder/100/100', '/api/placeholder/100/100']
          },
          {
            _id: '2',
            user: {
              _id: 'user2',
              customerProfile: {
                firstName: 'Michael',
                lastName: 'Chen',
                avatar: null
              },
              userType: 'customer'
            },
            rating: 4,
            comment: 'Great service from the seller. The property matches the description exactly. Only minor issue was the viewing time flexibility.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            helpful: 8,
            isHelpful: true
          },
          {
            _id: '3',
            user: {
              _id: 'user3',
              customerProfile: {
                firstName: 'Emma',
                lastName: 'Wilson',
                avatar: '/api/placeholder/40/40'
              },
              userType: 'customer'
            },
            rating: 5,
            comment: 'Amazing property and even better service! The seller went above and beyond to help with the process.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            helpful: 15,
            isHelpful: false
          }
        ];
        
        setReviews(mockReviews);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setIsLoading(false);
    }
  };

  const calculateRatingDistribution = () => {
    if (reviews.length === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    // Convert to percentages
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / reviews.length) * 100;
    });
    
    return distribution;
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = calculateRatingDistribution();

  const handleHelpful = async (reviewId) => {
    try {
      // API call to mark review as helpful
      setReviews(prev => 
        prev.map(review => 
          review._id === reviewId 
            ? { 
                ...review, 
                helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1,
                isHelpful: !review.isHelpful 
              }
            : review
        )
      );
    } catch (error) {
      toast.error('Failed to update helpful status');
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' },
    { value: 'helpful', label: 'Most Helpful' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${ratingDistribution[rating]}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
                  {ratingDistribution[rating].toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Write Review Button */}
        {canReview && (
          <Button
            onClick={() => setShowWriteReview(true)}
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Write Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem 
              key={review._id} 
              review={review} 
              onHelpful={handleHelpful}
              currentUserId={user?._id}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to review this {product.type === 'real-estate' ? 'property' : 'service'}!
            </p>
            {canReview && (
              <Button onClick={() => setShowWriteReview(true)}>
                Write First Review
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        product={product}
        onReviewSubmitted={(newReview) => {
          setReviews(prev => [newReview, ...prev]);
          setShowWriteReview(false);
        }}
      />
    </div>
  );
};

// Review Item Component
const ReviewItem = ({ review, onHelpful, currentUserId }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const user = review.user;
  const userName = user.userType === 'company' 
    ? user.companyProfile?.companyName || 'Company'
    : `${user.customerProfile?.firstName || ''} ${user.customerProfile?.lastName || ''}`.trim() || 'User';
  
  const userAvatar = user.userType === 'company' 
    ? user.companyProfile?.logo 
    : user.customerProfile?.avatar;

  const isLongComment = review.comment && review.comment.length > 300;
  const displayComment = showFullComment || !isLongComment 
    ? review.comment 
    : review.comment?.substring(0, 300) + '...';

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {userName}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
            </div>

            {/* Report Button */}
            {currentUserId !== user._id && (
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <FlagIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {displayComment}
          </p>
          {isLongComment && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="mt-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
            >
              {showFullComment ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex space-x-2">
            {review.images.slice(0, 3).map((image, index) => (
              <button
                key={index}
                onClick={() => setShowImages(true)}
                className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </button>
            ))}
            {review.images.length > 3 && (
              <button
                onClick={() => setShowImages(true)}
                className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm font-medium"
              >
                +{review.images.length - 3}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onHelpful(review._id)}
          className={`flex items-center space-x-1 text-sm transition-colors ${
            review.isHelpful
              ? 'text-primary-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary-500'
          }`}
        >
          {review.isHelpful ? (
            <HandThumbsUpSolidIcon className="h-4 w-4" />
          ) : (
            <HandThumbsUpIcon className="h-4 w-4" />
          )}
          <span>Helpful ({review.helpful})</span>
        </button>
      </div>
    </div>
  );
};

// Write Review Modal Component
const WriteReviewModal = ({ isOpen, onClose, product, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      // API call to submit review
      const newReview = {
        _id: Date.now().toString(),
        user: {
          _id: 'current-user',
          customerProfile: {
            firstName: 'You',
            lastName: '',
            avatar: null
          },
          userType: 'customer'
        },
        rating,
        comment,
        createdAt: new Date(),
        helpful: 0,
        isHelpful: false,
        images: images.map(img => URL.createObjectURL(img))
      };

      onReviewSubmitted(newReview);
      toast.success('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Review"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Rating *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <StarSolidIcon
                  className={`h-8 w-8 transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this property/service..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Photos (Optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {images.length} image{images.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={rating === 0 || isSubmitting}
            className="flex-1"
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductReviews;