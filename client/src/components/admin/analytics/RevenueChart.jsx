import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatCurrency } from '../../../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data, compact = false }) => {
  const [activeView, setActiveView] = useState('total');

  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return (
      <div className={`${compact ? 'h-32' : 'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'} flex items-center justify-center`}>
        <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
      </div>
    );
  }

  const getChartData = () => {
    if (activeView === 'breakdown') {
      return {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'Subscriptions',
            data: data.map(item => item.subscriptions || 0),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: compact ? 3 : 6
          },
          {
            label: 'Commissions',
            data: data.map(item => item.commissions || 0),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: compact ? 3 : 6
          }
        ]
      };
    }

    return {
      labels: data.map(item => item.month),
      datasets: [
        {
          label: 'Total Revenue',
          data: data.map(item => item.revenue || 0),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: compact ? 3 : 6
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !compact,
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y, 'ETB')}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: !compact,
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      y: {
        display: !compact,
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          callback: function(value) {
            return formatCurrency(value, 'ETB', { compact: true });
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverRadius: compact ? 5 : 8
      }
    }
  };

  if (compact) {
    return (
      <div className="h-32">
        <Line data={getChartData()} options={options} />
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const avgRevenue = totalRevenue / data.length;
  const maxRevenue = Math.max(...data.map(item => item.revenue || 0));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Revenue Analytics
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('total')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              activeView === 'total'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Total
          </button>
          <button
            onClick={() => setActiveView('breakdown')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              activeView === 'breakdown'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Breakdown
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <Line data={getChartData()} options={options} />
      </div>

      {/* Revenue Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Peak Revenue</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(maxRevenue, 'ETB', { compact: true })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(avgRevenue, 'ETB', { compact: true })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Period</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalRevenue, 'ETB', { compact: true })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Trend</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">↗ Upward</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;