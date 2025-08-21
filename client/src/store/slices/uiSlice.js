import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: localStorage.getItem('citilights_dark_mode') === 'true',
  sidebarOpen: false,
  mobileMenuOpen: false,
  loading: {
    global: false,
    products: false,
    orders: false,
    chat: false,
  },
  modals: {
    login: false,
    register: false,
    productQuickView: false,
    imageGallery: false,
  },
  filters: {
    products: {
      category: '',
      priceRange: { min: 0, max: null },
      location: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      sort: 'relevance',
    },
  },
  searchQuery: '',
  currentPage: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('citilights_dark_mode', state.darkMode.toString());
      
      // Apply dark mode to document
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    
    toggleModal: (state, action) => {
      const { modal, isOpen } = action.payload;
      state.modals[modal] = isOpen !== undefined ? isOpen : !state.modals[modal];
    },
    
    setFilters: (state, action) => {
      const { type, filters } = action.payload;
      state.filters[type] = { ...state.filters[type], ...filters };
    },
    
    clearFilters: (state, action) => {
      const { type } = action.payload;
      state.filters[type] = initialState.filters[type];
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    resetUI: (state) => {
      return { ...initialState, darkMode: state.darkMode };
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  toggleMobileMenu,
  setLoading,
  toggleModal,
  setFilters,
  clearFilters,
  setSearchQuery,
  setCurrentPage,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;