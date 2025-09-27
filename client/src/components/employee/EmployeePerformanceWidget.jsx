// components/employee/EmployeePerformanceWidget.jsx
import { ChartBarIcon, ArrowTrendingUpIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../utils/helpers';

const EmployeePerformanceWidget = ({ stats, appointments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const upcomingAppointments = appointments.filter(a => 
    new Date(a.scheduledDateTime) > new Date() && ['pending', 'confirmed'].includes(a.status)
  ).length;

  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;

  const performanceMetrics = [
    {
      title: 'Total Appointments',
      value: totalAppointments,
      change: `${upcomingAppointments} upcoming`,
      changeType: 'neutral',
      icon: <ChartBarIcon className="h-5 w-5" />,
      color: 'blue'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: `${completedAppointments} completed`,
      changeType: completionRate >= 80 ? 'positive' : completionRate >= 60 ? 'neutral' : 'negative',
      icon: <CheckCircleIcon className="h-5 w-5" />,
      color: completionRate >= 80 ? 'green' : completionRate >= 60 ? 'yellow' : 'red'
    },
    {
      title: 'Pending Actions',
      value: pendingAppointments,
      change: pendingAppointments > 0 ? 'Needs attention' : 'All up to date',
      changeType: pendingAppointments > 5 ? 'negative' : pendingAppointments > 0 ? 'neutral' : 'positive',
      icon: <ClockIcon className="h-5 w-5" />,
      color: pendingAppointments > 5 ? 'red' : pendingAppointments > 0 ? 'yellow' : 'green'
    },
    {
      title: 'This Week',
      value: appointments.filter(a => {
        const appointmentDate = new Date(a.scheduledDateTime);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      }).length,
      change: 'This week',
      changeType: 'neutral',
      icon: <ArrowTrendingUpIcon className="h-5 w-5" />,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colors[color] || colors.blue;
  };

  const getChangeColorClasses = (type) => {
    const colors = {
      positive: 'text-green-600 dark:text-green-400',
      negative: 'text-red-600 dark:text-red-400',
      neutral: 'text-gray-600 dark:text-gray-400'
    };
    return colors[type] || colors.neutral;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Performance Overview
        </h3>
        <button
          onClick={() => window.location.href = '/employee/analytics'}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          View Detailed Analytics →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {metric.value}
                </p>
                <p className={`text-sm mt-1 ${getChangeColorClasses(metric.changeType)}`}>
                  {metric.change}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${getColorClasses(metric.color)} flex items-center justify-center text-white`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePerformanceWidget;