// components/Services/QuoteReviewModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { respondToQuote } from '../../store/slices/serviceInquirySlice';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const QuoteReviewModal = ({ isOpen, onClose, inquiry }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [action, setAction] = useState(''); // 'accept' or 'reject'
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.serviceInquiry);

  const pendingQuotes = inquiry?.quotes?.filter(quote => 
    quote.status === 'pending' && new Date(quote.validUntil) > new Date()
  ) || [];

  useEffect(() => {
    if (isOpen && pendingQuotes.length > 0) {
      setSelectedQuote(pendingQuotes[0]);
    }
  }, [isOpen, pendingQuotes]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedQuote(null);
      setAction('');
      setMessage('');
      setShowConfirmation(false);
    }
  }, [isOpen]);

  const handleQuoteAction = (actionType) => {
    setAction(actionType);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    if (!selectedQuote || !action) return;

    try {
      await dispatch(respondToQuote({
        inquiryId: inquiry._id,
        quoteId: selectedQuote._id,
        action,
        message: message.trim()
      })).unwrap();

      toast.success(`Quote ${action}ed successfully!`);
      onClose();

    } catch (error) {
      console.error('Quote response error:', error);
      toast.error(error || `Failed to ${action} quote`);
    }
  };

  const getComparisonData = () => {
    if (pendingQuotes.length < 2) return null;

    const amounts = pendingQuotes.map(q => q.amount);
    const timelines = pendingQuotes.map(q => q.timeline?.estimatedDays).filter(Boolean);

    return {
      lowestAmount: Math.min(...amounts),
      highestAmount: Math.max(...amounts),
      averageAmount: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length,
      shortestTimeline: timelines.length > 0 ? Math.min(...timelines) : null,
      longestTimeline: timelines.length > 0 ? Math.max(...timelines) : null
    };
  };

  const comparison = getComparisonData();

  if (!pendingQuotes.length) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Review Quotes" size="md">
        <div className="p-6 text-center">
          <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Pending Quotes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are no pending quotes available for review.
          </p>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`${action === 'accept' ? 'Accept' : 'Reject'} Quote`} size="md">
        <div className="p-6">
          <div className="text-center mb-6">
            {action === 'accept' ? (
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {action === 'accept' ? 'Accept Quote' : 'Reject Quote'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to {action} this quote for{' '}
              <span className="font-medium">
                {formatCurrency(selectedQuote?.amount, selectedQuote?.currency)}
              </span>?
            </p>
          </div>

          {action === 'accept' && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Accepting this quote will automatically reject all other pending quotes</li>
                    <li>This action cannot be undone</li>
                    <li>The service provider will be notified immediately</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {action === 'accept' ? 'Acceptance Message (Optional)' : 'Rejection Reason (Optional)'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                action === 'accept' 
                  ? 'Add any comments or questions about the accepted quote...'
                  : 'Provide a reason for rejecting this quote...'
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              loading={isSubmitting}
              disabled={isSubmitting}
              className={`flex-1 ${action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              leftIcon={action === 'accept' ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
            >
              {action === 'accept' ? 'Accept Quote' : 'Reject Quote'}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Quotes"
      size="xl"
      className="max-w-5xl"
    >
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {/* Quote Comparison Summary */}
        {comparison && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Quote Comparison</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300">Lowest Quote:</span>
                <div className="font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(comparison.lowestAmount, pendingQuotes[0].currency)}
                </div>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">Highest Quote:</span>
                <div className="font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(comparison.highestAmount, pendingQuotes[0].currency)}
                </div>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">Average:</span>
                <div className="font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(comparison.averageAmount, pendingQuotes[0].currency)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote Selection */}
          <div className="lg:col-span-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
              Available Quotes ({pendingQuotes.length})
            </h3>
            <div className="space-y-3">
              {pendingQuotes.map((quote, index) => (
                <button
                  key={quote._id || index}
                  onClick={() => setSelectedQuote(quote)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedQuote === quote
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {formatCurrency(quote.amount, quote.currency)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Quote #{index + 1}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {quote.timeline?.estimatedDays && (
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{quote.timeline.estimatedDays} days</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs">
                      Submitted {formatRelativeTime(quote.submittedAt)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quote Details */}
          <div className="lg:col-span-2">
            {selectedQuote ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Quote Details
                  </h3>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(selectedQuote.amount, selectedQuote.currency)}
                  </div>
                </div>

                {/* Timeline Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Timeline</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Estimated Duration:</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedQuote.timeline?.estimatedDays ? `${selectedQuote.timeline.estimatedDays} days` : 'TBD'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Proposed Start:</span>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedQuote.timeline?.startDate 
                          ? new Date(selectedQuote.timeline.startDate).toLocaleDateString()
                          : 'TBD'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {selectedQuote.breakdown && selectedQuote.breakdown.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Cost Breakdown</h4>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {selectedQuote.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.item}</p>
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.cost, selectedQuote.currency)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 font-bold">
                        <span className="text-primary-900 dark:text-primary-100">Total</span>
                        <span className="text-primary-900 dark:text-primary-100">
                          {formatCurrency(selectedQuote.amount, selectedQuote.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {selectedQuote.timeline?.milestones && selectedQuote.timeline.milestones.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Project Milestones</h4>
                    <div className="space-y-2">
                      {selectedQuote.timeline.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
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

                {/* Terms */}
                {selectedQuote.terms && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Terms & Conditions</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedQuote.terms}
                    </div>
                  </div>
                )}

                {/* Quote Validity */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      <p className="font-medium">Quote Validity</p>
                      <p>This quote is valid until {new Date(selectedQuote.validUntil).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => handleQuoteAction('accept')}
                    className="flex-1"
                    leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                  >
                    Accept This Quote
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuoteAction('reject')}
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                    leftIcon={<XCircleIcon className="h-4 w-4" />}
                  >
                    Reject Quote
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a quote from the left to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          >
            Contact Provider
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuoteReviewModal;