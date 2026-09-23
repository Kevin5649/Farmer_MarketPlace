import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import API from '../utils/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from MongoDB when a customer logs in
  useEffect(() => {
    const loadCart = async () => {
      if (!user || user.role !== 'customer') {
        setCart([]);
        return;
      }

      try {
        setLoading(true);

        const { data } = await API.get('/cart');

        const cartItems = (data.items || []).map((item) => ({
          productId: item.product?._id || item.product,
          name: item.productName,
          price: item.price,
          image: item.image,
          availableQuantity: item.availableQuantity,
          quantity: item.quantity,
        }));

        setCart(cartItems);
      } catch (error) {
        console.error('Failed to load cart:', error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (product, quantity = 0.5) => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can add items to the cart');
      return;
    }

    try {
      const { data } = await API.post('/cart', {
        productId: product._id,
        quantity,
      });

      const cartItems = (data.items || []).map((item) => ({
        productId: item.product?._id || item.product,
        name: item.productName,
        price: item.price,
        image: item.image,
        availableQuantity: item.availableQuantity,
        quantity: item.quantity,
      }));

      setCart(cartItems);

      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const { data } = await API.put(`/cart/${productId}`, {
        quantity,
      });

      const cartItems = (data.items || []).map((item) => ({
        productId: item.product?._id || item.product,
        name: item.productName,
        price: item.price,
        image: item.image,
        availableQuantity: item.availableQuantity,
        quantity: item.quantity,
      }));

      setCart(cartItems);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update cart'
      );
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/${productId}`);

      const cartItems = (data.items || []).map((item) => ({
        productId: item.product?._id || item.product,
        name: item.productName,
        price: item.price,
        image: item.image,
        availableQuantity: item.availableQuantity,
        quantity: item.quantity,
      }));

      setCart(cartItems);

      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to remove item'
      );
    }
  };

  const clearCart = async () => {
    if (!user || user.role !== 'customer') {
      setCart([]);
      return;
    }

    try {
      await API.delete('/cart');
      setCart([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }

  return ctx;
};