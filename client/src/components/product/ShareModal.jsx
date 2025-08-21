import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  LinkIcon,
  EnvelopeIcon,
  CheckIcon,
  ShareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { toast } from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, product }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState(new Set());

  const productUrl = `${window.location.origin}/product/${product._id}`;

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      gradient: 'from-blue-600 to-blue-700',
      hoverGradient: 'from-blue-700 to-blue-800',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      gradient: 'from-sky-500 to-sky-600',
      hoverGradient: 'from-sky-600 to-sky-700',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out this ${product.type}: ${product.title}`)}`
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      ),
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-600 to-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this ${product.type}: ${product.title} ${productUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out this ${product.type}: ${product.title}`)}`
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      gradient: 'from-blue-700 to-blue-800',
      hoverGradient: 'from-blue-800 to-blue-900',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`
    },
  ];

  const handleSocialShare = (platform) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    
    // Add to shared platforms
    setSharedPlatforms(prev => new Set([...prev, platform.name]));
    
    // Track sharing analytics
    trackShare(platform.name.toLowerCase());
    toast.success(`Shared on ${platform.name}!`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success('Link copied to clipboard!');
      trackShare('link');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleEmailShare = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSharing(true);
    try {
      // API call to send email
      const response = await fetch('/api/social/share/' + product._id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'email',
          email,
          message
        }),
      });

      if (response.ok) {
        toast.success('Email sent successfully!');
        setEmail('');
        setMessage('');
        trackShare('email');
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsSharing(false);
    }
  };

  const trackShare = (platform) => {
    // Track sharing analytics
    console.log(`Product ${product._id} shared via ${platform}`);
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setSharedPlatforms(new Set());
    setCopiedLink(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <ShareIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Share this listing
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Spread the word about this amazing property
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <div className="space-y-8">
        {/* Enhanced Product Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex space-x-4">
            <div className="relative">
              <img
                src={product.media?.images?.[0]?.url || '/api/placeholder/80/80'}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-xl shadow-lg"
              />
              {product.featured && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-lg mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.type === 'real-estate' 
                  ? `${product.realEstateDetails?.location?.city || ''}, Ethiopia`
                  : 'Professional Service'
                }
              </p>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {product.pricing?.basePrice ? `${product.pricing.basePrice.toLocaleString()} ETB` : 'Price on request'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Social Media Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></span>
            Share on social media
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {socialPlatforms.map((platform, index) => (
              <motion.button
                key={platform.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialShare(platform)}
                className={`relative flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl text-white transition-all duration-300 bg-gradient-to-r ${platform.gradient} hover:${platform.hoverGradient} shadow-lg hover:shadow-xl group overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center space-x-3">
                  {platform.icon}
                  <span className="font-semibold">{platform.name}</span>
                </div>
                {sharedPlatforms.has(platform.name) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckIcon className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Copy Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3"></span>
            Copy link
          </h4>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={productUrl}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
              />
              {copiedLink && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                >
                  <CheckIcon className="h-5 w-5" />
                </motion.div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                copiedLink
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              } shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center space-x-2">
                {copiedLink ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <LinkIcon className="h-5 w-5" />
                )}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Email Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mr-3"></span>
            Share via email
          </h4>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                className="text-base"
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Add a personal message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {message.length}/500
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEmailShare}
              disabled={!email || isSharing}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSharing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>Send Email</span>
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default ShareModal;