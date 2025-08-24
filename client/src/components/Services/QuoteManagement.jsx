import { useState } from 'react';
import {
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

const QuoteManagement = ({ inquiry, isAdmin, isCustomer, onQuoteSubmit, onQuoteReview }) => {
  const [expandedQuote, setExpandedQuote] = useState(null);

  const getQuoteStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      accepted: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      expired: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getQuoteStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      accepted: CheckCircleIcon,
      rejected: XCircleIcon,
      expired: ExclamationTriangleIcon
    };
    return icons[status] || ClockIcon;
  };

  const isQuoteExpired = (quote) => {
    return new Date(quote.validUntil) < new Date();
  };

  const canAcceptReject = (quote) => {
    return isCustomer && quote.status === 'pending' && !isQuoteExpired(quote);
  };

  if (!inquiry.quotes || inquiry.quotes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Quotes Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isAdmin 
              ? "You haven't submitted any quotes for this inquiry yet."
              : "No quotes have been submitted for your inquiry yet."
            }
          </p>
          {isAdmin && inquiry.status === 'pending' && (
            <Button onClick={onQuoteSubmit} leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}>
              Submit Quote
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Quotes ({inquiry.quotes.length})
        </h3>
        {isAdmin && inquiry.status !== 'completed' && inquiry.status !== 'cancelled' && (
          <Button
            onClick={onQuoteSubmit}
            leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
            size="sm"
          >
            Submit New Quote
          </Button>
        )}
        {isCustomer && inquiry.quotes.some(q => q.status === 'pending') && (
          <Button
            onClick={onQuoteReview}
            leftIcon={<DocumentTextIcon className="h-4 w-4" />}
            size="sm"
          >
            Review All Quotes
          </Button>
        )}
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {inquiry.quotes.map((quote, index) => {
          const StatusIcon = getQuoteStatusIcon(quote.status);
          const expired = isQuoteExpired(quote);
          const isExpanded = expandedQuote === index;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Quote Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(quote.amount, quote.currency)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getQuoteStatusColor(expired ? 'expired' : quote.status)}`}>
                    <StatusIcon className="h-3 w-3 inline mr-1" />
                    {expired ? 'Expired' : quote.status}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div>Submitted {formatRelativeTime(quote.submittedAt)}</div>
                    <div>Valid until {new Date(quote.validUntil).toLocaleDateString()}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedQuote(isExpanded ? null : index)}
                  >
                    {isExpanded ? 'Show Less' : 'Show Details'}
                  </Button>
                </div>
              </div>

              {/* Quote Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Timeline</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {quote.timeline?.estimatedDays ? `${quote.timeline.estimatedDays} days` : 'TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {quote.timeline?.startDate ? new Date(quote.timeline.startDate).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Currency</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {quote.currency}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Cost Breakdown */}
                  {quote.breakdown && quote.breakdown.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Cost Breakdown</h4>
                      <div className="space-y-2">
                        {quote.breakdown.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{item.item}</p>
                              {item.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                              )}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(item.cost, quote.currency)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-2 bg-primary-50 dark:bg-primary-900/20 rounded font-bold">
                          <span className="text-primary-900 dark:text-primary-100">Total</span>
                          <span className="text-primary-900 dark:text-primary-100">
                            {formatCurrency(quote.amount, quote.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline & Milestones */}
                  {quote.timeline?.milestones && quote.timeline.milestones.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Project Milestones</h4>
                      <div className="space-y-2">
                        {quote.timeline.milestones.map((milestone, milestoneIndex) => (
                          <div key={milestoneIndex} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{milestone.name}</p>
                              {milestone.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(milestone.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  {quote.terms && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Terms & Conditions</h4>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {quote.terms}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {canAcceptReject(quote) && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => onQuoteReview()}
                    leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Accept Quote
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onQuoteReview()}
                    leftIcon={<XCircleIcon className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Decline Quote
                  </Button>
                </div>
              )}

              {/* Warning for expired quotes */}
              {expired && quote.status === 'pending' && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This quote has expired. Please contact the service provider for an updated quote.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quote Summary for Customer */}
      {isCustomer && inquiry.quotes.length > 1 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quote Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300">Lowest Quote:</span>
              <div className="font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(Math.min(...inquiry.quotes.map(q => q.amount)), inquiry.quotes[0].currency)}
              </div>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Highest Quote:</span>
              <div className="font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(Math.max(...inquiry.quotes.map(q => q.amount)), inquiry.quotes[0].currency)}
              </div>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Average:</span>
              <div className="font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(
                  inquiry.quotes.reduce((sum, q) => sum + q.amount, 0) / inquiry.quotes.length,
                  inquiry.quotes[0].currency
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteManagement;