import api from './api';

export const cartService = {
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  },

  async addToCart({ productId, quantity = 1, variant }) {
    try {
      const response = await api.post('/cart/add', { productId, quantity, variant });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  },

  async updateCartItem({ productId, quantity, variant }) {
    try {
      const response = await api.put('/cart/update', { productId, quantity, variant });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  async removeFromCart({ productId, variant }) {
    try {
      const response = await api.delete(`/cart/remove/${productId}`, { params: { variant } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  },

  async clearCart() {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }
};