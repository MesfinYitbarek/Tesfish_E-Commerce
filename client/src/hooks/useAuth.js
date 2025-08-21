import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isCustomer: user?.userType === 'customer',
    isIndividual: user?.userType === 'individual',
    isCompany: user?.userType === 'company',
    isAdmin: user?.userType === 'admin',
    isSeller: user?.userType === 'individual' || user?.userType === 'company',
  };
};