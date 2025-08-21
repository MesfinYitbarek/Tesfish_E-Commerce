import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatNumber } from '../../../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserGrowthChart = ({ data, compact = false }) => {
  const [activeView, setActiveView] = useState('stacked');

  const getChartData = () => {
    // const isDark = document.documentElement.classList.contains('dark');
    
    if (activeView === 'separated') {
      return {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'Companies',
            data: data.map(item => item.companies),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 1
          },
          {
            label: 'Individuals',
            data: data.map(item => item.individuals),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10B981',
            borderWidth: 1
          },
          {
            label: 'Customers',
            data: data.map(item => item.customers),
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            borderColor: '#A855F7',
            borderWidth: 1
          }
        ]
      };
    }

    return {
      labels: data.map(item => item.month),
      datasets: [
        {
          label: 'Companies',
          data: data.map(item => item.companies),
          backgroundColor: '#3B82F6',
          borderRadius: compact ? 2 : 4
        },
        {
          label: 'Individuals',
          data: data.map(item => item.individuals),
          backgroundColor: '#10B981',
          borderRadius: compact ? 2 : 4
        },
        {
          label: 'Customers',
          data: data.map(item => item.customers),
          backgroundColor: '#A855F7',
          borderRadius: compact ? 2 : 4
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
            return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: !compact,
        stacked: activeView === 'stacked',
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      y: {
        display: !compact,
        stacked: activeView === 'stacked',
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          callback: function(value) {
            return formatNumber(value);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (compact) {
    return (
      <div className="h-32">
        <Bar data={getChartData()} options={options} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          User Growth
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('stacked')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              activeView === 'stacked'
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Stacked
          </button>
          <button
            onClick={() => setActiveView('separated')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              activeView === 'separated'
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Separated
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <Bar data={getChartData()} options={options} />
      </div>

      {/* User Growth Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">Companies</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatNumber(data[data.length - 1]?.companies || 0)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">+12.8% growth</p>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">Individuals</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {formatNumber(data[data.length - 1]?.individuals || 0)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">+8.4% growth</p>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-400">Customers</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {formatNumber(data[data.length - 1]?.customers || 0)}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400">+18.2% growth</p>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;