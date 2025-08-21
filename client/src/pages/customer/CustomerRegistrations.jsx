import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatRelativeTime, formatDate } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const CustomerRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchQuery, statusFilter]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      // Get registrations from localStorage (in real app, this would be an API call)
      const storedRegistrations = Object.keys(localStorage)
        .filter(key => key.startsWith('registration_'))
        .map(key => {
          try {
            return JSON.parse(localStorage.getItem(key));
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      // Add mock data if no real registrations exist
      if (storedRegistrations.length === 0) {
        const mockRegistrations = [
          {
            id: 'REG-001',
            propertyId: 'PROP-001',
            propertyTitle: 'Modern 3BR Apartment in CMC',
            status: 'paid',
            registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            registrationFee: 5000,
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+251911234567',
            interestedUnits: ['A-201', 'A-301'],
            financingMethod: 'bank_loan',
            sellerInfo: {
              name: 'Prime Properties Ltd',
              type: 'company',
              verified: true
            },
            paymentDetails: {
              transactionId: 'TXN-001',
              method: 'telebirr',
              paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            lastContactDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            nextAction: 'Wait for seller contact',
            notes: 'Property viewing scheduled for this Friday'
          },
          {
            id: 'REG-002',
            propertyId: 'PROP-002',
            propertyTitle: 'Luxury Villa - Old Airport Area',
            status: 'pending_payment',
            registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            registrationFee: 5000,
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+251911234567',
            interestedUnits: ['Villa-A'],
            financingMethod: 'mixed',
            sellerInfo: {
              name: 'Sarah Johnson',
              type: 'individual',
              verified: true
            },
            nextAction: 'Complete registration payment',
            notes: 'Payment link sent via email'
          },
          {
            id: 'REG-003',
            propertyId: 'PROP-003',
            propertyTitle: 'Commercial Office Space - Piazza',
            status: 'contacted',
            registrationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            registrationFee: 5000,
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+251911234567',
            interestedUnits: ['Office-Floor-2'],
            financingMethod: 'cash',
            sellerInfo: {
              name: 'Metro Real Estate',
              type: 'company',
              verified: true
            },
            paymentDetails: {
              transactionId: 'TXN-003',
              method: 'mobile_transfer',
              paidAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            nextAction: 'Review proposal and negotiate',
            notes: 'Received detailed proposal and pricing breakdown'
          }
        ];
        setRegistrations(mockRegistrations);
      } else {
        setRegistrations(storedRegistrations);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.propertyTitle.toLowerCase().includes(query) ||
        reg.sellerInfo.name.toLowerCase().includes(query) ||
        reg.id.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    // Sort by registration date (newest first)
    filtered.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

    setFilteredRegistrations(filtered);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      paid: {
        label: 'Registration Complete',
        color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
        icon: CheckCircleIcon,
        description: 'Your registration is complete and the seller will contact you soon'
      },
      pending_payment: {
        label: 'Payment Pending',
        color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
        icon: ClockIcon,
        description: 'Complete your registration payment to proceed'
      },
      contacted: {
        label: 'Seller Contacted',
        color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
        icon: ChatBubbleLeftRightIcon,
        description: 'The seller has reached out to you'
      },
      expired: {
        label: 'Registration Expired',
        color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
        icon: XCircleIcon,
        description: 'This registration has expired'
      }
    };
    return statusMap[status] || statusMap.paid;
  };

  const handleCompletePayment = (registration) => {
    // Store payment data and redirect to payment processing
    const paymentData = {
      registrationId: registration.id,
      registrationData: registration,
      paymentMethod: 'telebirr' // Default method
    };
    
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    window.location.href = '/payment/process';
  };

  const RegistrationCard = ({ registration }) => {
    const statusInfo = getStatusInfo(registration.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {registration.propertyTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Registration ID: {registration.id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <StatusIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Registration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Seller:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {registration.sellerInfo.name}
                </span>
                {registration.sellerInfo.verified && (
                  <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Registered:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {formatDate(registration.registrationDate)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Registration Fee:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(registration.registrationFee, 'ETB')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-sm">
                <DocumentCheckIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Interested Units:</span>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {registration.interestedUnits.join(', ')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Financing:</span>
                <span className="text-gray-900 dark:text-gray-100 capitalize">
                  {registration.financingMethod.replace('_', ' ')}
                </span>
              </div>

              {registration.lastContactDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Last Contact:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatRelativeTime(registration.lastContactDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Description */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {statusInfo.description}
            </p>
            {registration.nextAction && (
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">
                Next: {registration.nextAction}
              </p>
            )}
          </div>

          {/* Notes */}
          {registration.notes && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Notes:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                {registration.notes}
              </p>
            </div>
          )}

          {/* Payment Info */}
          {registration.paymentDetails && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                Payment Completed
              </h4>
              <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <p>Transaction ID: {registration.paymentDetails.transactionId}</p>
                <p>Method: {registration.paymentDetails.method.toUpperCase()}</p>
                <p>Date: {formatDate(registration.paymentDetails.paidAt)}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedRegistration(registration)}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </Button>

            {registration.status === 'pending_payment' && (
              <Button
                size="sm"
                onClick={() => handleCompletePayment(registration)}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                Complete Payment
              </Button>
            )}

            {(registration.status === 'paid' || registration.status === 'contacted') && (
              <Link to={`/customer/messages?seller=${registration.sellerInfo.name}`}>
                <Button size="sm">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </Link>
            )}

            <Link to={`/properties/${registration.propertyId}`}>
              <Button size="sm" variant="outline">
                View Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading registrations..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Registrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your property registration status and communications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by property name, seller, or registration ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<EyeIcon className="h-4 w-4" />}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Complete</option>
              <option value="pending_payment">Payment Pending</option>
              <option value="contacted">Seller Contacted</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { status: 'all', label: 'Total Registrations', count: filteredRegistrations.length },
          { status: 'paid', label: 'Complete', count: registrations.filter(r => r.status === 'paid').length },
          { status: 'pending_payment', label: 'Pending Payment', count: registrations.filter(r => r.status === 'pending_payment').length },
          { status: 'contacted', label: 'Contacted', count: registrations.filter(r => r.status === 'contacted').length }
        ].map((stat) => (
          <div key={stat.status} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.count}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Registrations List */}
      {filteredRegistrations.length > 0 ? (
        <div className="space-y-6">
          {filteredRegistrations.map((registration) => (
            <RegistrationCard key={registration.id} registration={registration} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center py-12">
          <DocumentCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {registrations.length === 0 ? 'No registrations yet' : 'No registrations match your search'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {registrations.length === 0 
              ? 'Start browsing properties and register your interest in the ones you like'
              : 'Try adjusting your search criteria or filters'
            }
          </p>
          {registrations.length === 0 && (
            <Link to="/properties">
              <Button>Browse Properties</Button>
            </Link>
          )}
        </div>
      )}

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedRegistration(null)} />
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-6 py-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Registration Details
                  </h3>
                  <button
                    onClick={() => setSelectedRegistration(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Property Information</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedRegistration.propertyTitle}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        <span>{selectedRegistration.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span>{selectedRegistration.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedRegistration.paymentDetails && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Payment Details</h4>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm">
                        <p>Transaction: {selectedRegistration.paymentDetails.transactionId}</p>
                        <p>Amount: {formatCurrency(selectedRegistration.registrationFee, 'ETB')}</p>
                        <p>Date: {formatDate(selectedRegistration.paymentDetails.paidAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setSelectedRegistration(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistrations;