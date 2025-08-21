import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id })
      .populate('items.product', 'title pricing media inventory status');

    if (!cart) {
      cart = await Cart.create({ customer: req.user.id, items: [] });
    }

    // Filter out inactive products and update total
    cart.items = cart.items.filter(item => 
      item.product && item.product.status === 'active'
    );

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      const price = item.product.pricing.salePrice || item.product.pricing.basePrice;
      return total + (price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      data: { cart }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Check inventory for physical products
    if (product.productType === 'physical' && product.inventory.trackInventory) {
      if (product.inventory.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }
    }

    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      cart = await Cart.create({ customer: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && item.variant === variant
    );

    const price = product.pricing.salePrice || product.pricing.basePrice;

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price,
        variant
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product', 'title pricing media inventory status');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;

    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId && item.variant === variant
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      const product = await Product.findById(productId);
      if (product.productType === 'physical' && product.inventory.trackInventory) {
        if (product.inventory.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock'
          });
        }
      }
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product', 'title pricing media inventory status');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variant } = req.query;

    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => 
      !(item.product.toString() === productId && item.variant === variant)
    );

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product', 'title pricing media inventory status');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { cart }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { customer: req.user.id },
      { items: [], total: 0 },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};