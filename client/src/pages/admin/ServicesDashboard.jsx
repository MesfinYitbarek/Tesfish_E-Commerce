import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '../../components/dashboard/StatsCard';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ServiceInquiriesTable from '../../components/admin/ServiceInquiriesTable';
import ServiceStatsChart from '../../components/admin/ServiceStatsChart';
import { fetchProviderInquiries, fetchStats } from '../../store/slices/serviceInquirySlice';

const ServicesDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [statsPeriod, setStatsPeriod] = useState('30d');
  
  const dispatch = useDispatch();
  const { inquiries, stats, isLoading, pagination } = useSelector((state) => state.serviceInquiry);

  useEffect(() => {
    dispatch(fetchStats(statsPeriod));
    dispatch(fetchProviderInquiries({ page: 1, limit: 10 }));
  }, [dispatch, statsPeriod]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'under-review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      quoted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'in-progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[status] || colors.pending;
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-orange-600 dark:text-orange-400',
      urgent: 'text-red-600 dark:text-red-400'
    };
    return colors[urgency] || colors.medium;
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Services Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all service inquiries
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={statsPeriod}
            onChange={(e) => setStatsPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Inquiries"
            value={stats.overview?.totalInquiries || 0}
            change={`+${stats.overview?.periodInquiries || 0} this period`}
            icon={ChartBarIcon}
            color="blue"
          />
          <StatsCard
            title="Pending Review"
            value={stats.statusDistribution?.find(s => s._id === 'pending')?.count || 0}
            icon={ClockIcon}
            color="yellow"
          />
          <StatsCard
            title="Active Projects"
            value={stats.statusDistribution?.find(s => s._id === 'in-progress')?.count || 0}
            icon={CheckCircleIcon}
            color="green"
          />
          <StatsCard
            title="Revenue Potential"
            value={`${(stats.revenue?.totalRevenue || 0).toLocaleString()} ETB`}
            change={`Avg: ${(stats.revenue?.avgQuoteValue || 0).toLocaleString()} ETB`}
            icon={CurrencyDollarIcon}
            color="purple"
          />
        </div>
      )}

      {/* Service Type Distribution */}
      {stats?.serviceTypeDistribution && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.serviceTypeDistribution.map((service) => (
            <div key={service._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {service._id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {service.count}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'inquiries', label: 'All Inquiries' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'active', label: 'Active Projects' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Inquiries */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Recent Inquiries
                </h3>
              </div>
              <div className="p-6">
                {inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <div key={inquiry._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {inquiry.projectDetails.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                              {inquiry.status.replace('-', ' ')}
                            </span>
                            <span className={`text-sm font-medium ${getUrgencyColor(inquiry.projectDetails.timeline.urgency)}`}>
                              {inquiry.projectDetails.timeline.urgency} priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {inquiry.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                            {inquiry.customer?.customerProfile?.firstName} {inquiry.customer?.customerProfile?.lastName} • 
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/admin/services/inquiries/${inquiry._id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No inquiries yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Charts */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ServiceStatsChart data={stats.monthlyTrend} />
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Response Time Analytics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Response Time</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {(stats.responseTime?.avgResponseTime || 0).toFixed(1)} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fastest Response</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {(stats.responseTime?.minResponseTime || 0).toFixed(1)} hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Slowest Response</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {(stats.responseTime?.maxResponseTime || 0).toFixed(1)} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'inquiries' || activeTab === 'pending' || activeTab === 'active') && (
          <ServiceInquiriesTable 
            filter={activeTab === 'pending' ? 'pending' : activeTab === 'active' ? 'in-progress' : null}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ServiceStatsChart data={stats?.monthlyTrend} />
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Conversion Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Conversion Rate</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats?.overview?.conversionRate || 0}%
                  </span>
                </div>
                <div className="space-y-2">
                  {stats?.statusDistribution?.map((status) => (
                    <div key={status._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {status._id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {status.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesDashboard;