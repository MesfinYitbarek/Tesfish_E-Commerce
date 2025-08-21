export const selectProducts = (state) => state.products.products;
export const selectProductLoading = (state) => state.products.isLoading;
export const selectProductError = (state) => state.products.error;
export const selectPagination = (state) => state.products.pagination;
export const selectFilters = (state) => state.products.filters;
export const selectViewMode = (state) => state.products.viewMode;