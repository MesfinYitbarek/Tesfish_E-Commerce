import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import chatSlice from './slices/chatSlice';
import notificationSlice from './slices/notificationSlice';
import uiSlice from './slices/uiSlice';
import appointmentSlice from './slices/appointmentSlice';
import serviceInquirySlice from './slices/serviceInquirySlice'
export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
    serviceInquiry: serviceInquirySlice,
    chat: chatSlice,
    notifications: notificationSlice,
    ui: uiSlice,
    appointments: appointmentSlice ,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;