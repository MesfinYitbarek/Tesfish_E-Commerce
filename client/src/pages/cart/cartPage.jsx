import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ShoppingCartIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CreditCardIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { removeFromCart, updateCartItem, clearCart, getCart } from '../../store/slices/cartSlice';

import { cn } from '../../utils/helpers';
import Button from '../../components/ui/Button';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [updatingItems, setUpdatingItems] = useState({});

  // Fetch cart on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Handle quantity change
  const handleQuantityChange = async (productId, variant, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [`${productId}-${variant}`]: true }));
    
    try {
      await dispatch(updateCartItem({ 
        productId, 
        quantity: newQuantity, 
        variant 
      })).unwrap();
    } catch (error) {
      toast.error(error.message || 'Failed to update cart item');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [`${productId}-${variant}`]: false }));
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId, variant) => {
    try {
      await dispatch(removeFromCart({ productId, variant })).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Cart cleared successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to clear cart');
      }
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please sign in to view your cart or start shopping
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/login?redirect=/cart')}
            >
              Sign In
            </Button>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Looks like you haven't added any items to your cart yet
          </p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 mr-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Shopping Cart</h1>
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
          {items.reduce((total, item) => total + item.quantity, 0)} items
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Cart Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
              <h2 className="font-medium text-gray-900 dark:text-white">Cart Items</h2>
              <button
                onClick={handleClearCart}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <li key={`${item.product._id}-${item.variant || 'default'}`} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.media?.thumbnail || '/images/placeholder-product.png'}
                        alt={item.product.title}
                        className="w-20 h-20 rounded-md object-cover border border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            <Link 
                              to={`/products/${item.product._id}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {item.product.title}
                            </Link>
                          </h3>
                          {item.variant && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Variant: {item.variant}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                            {item.product.pricing.salePrice ? (
                              <>
                                <span className="text-gray-500 dark:text-gray-400 line-through mr-2">
                                  ${item.product.pricing.basePrice.toFixed(2)}
                                </span>
                                <span className="text-red-600 dark:text-red-400">
                                  ${item.product.pricing.salePrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              `$${item.product.pricing.basePrice.toFixed(2)}`
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product._id, item.variant)}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          aria-label="Remove item"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center">
                        <button
                          onClick={() => handleQuantityChange(
                            item.product._id, 
                            item.variant, 
                            item.quantity - 1
                          )}
                          disabled={item.quantity <= 1 || updatingItems[`${item.product._id}-${item.variant || 'default'}`]}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-l-md",
                            item.quantity <= 1 ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          -
                        </button>
                        <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 dark:border-gray-600 text-sm">
                          {updatingItems[`${item.product._id}-${item.variant || 'default'}`] ? (
                            <div className="animate-pulse h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          ) : (
                            item.quantity
                          )}
                        </div>
                        <button
                          onClick={() => handleQuantityChange(
                            item.product._id, 
                            item.variant, 
                            item.quantity + 1
                          )}
                          disabled={
                            (item.product.productType === 'physical' && 
                             item.product.inventory?.trackInventory && 
                             item.quantity >= item.product.inventory.stock) ||
                            updatingItems[`${item.product._id}-${item.variant || 'default'}`]
                          }
                          className={cn(
                            "w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-r-md",
                            (item.product.productType === 'physical' && 
                             item.product.inventory?.trackInventory && 
                             item.quantity >= item.product.inventory.stock) 
                              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          +
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.product.productType === 'physical' && 
                       item.product.inventory?.trackInventory && 
                       item.quantity > item.product.inventory.stock && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          Only {item.product.inventory.stock} left in stock!
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Subtotal</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Shipping</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full flex justify-center items-center py-3"
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                <TruckIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>Free shipping on orders over $100</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Need Help?</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Have questions about your order or need assistance? Our support team is here to help.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;