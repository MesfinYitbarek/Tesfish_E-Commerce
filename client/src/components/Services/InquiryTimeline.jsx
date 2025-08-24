// components/Services/InquiryTimeline.jsx
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../../utils/helpers';

const InquiryTimeline = ({ inquiry }) => {
  const getTimelineEvents = () => {
    const events = [];

    // Initial submission
    events.push({
      id: 'submitted',
      type: 'submitted',
      title: 'Inquiry Submitted',
      description: `Service inquiry for ${inquiry.serviceType.replace('-', ' ')} was submitted`,
      timestamp: inquiry.createdAt,
      icon: DocumentTextIcon,
      color: 'blue'
    });

    // Status changes
    if (inquiry.status !== 'pending') {
      events.push({
        id: 'status-updated',
        type: 'status',
        title: `Status Updated to ${inquiry.status.replace('-', ' ')}`,
        description: `Inquiry status changed from pending to ${inquiry.status}`,
        timestamp: inquiry.updatedAt,
        icon: inquiry.status === 'completed' ? CheckCircleIcon : 
              inquiry.status === 'cancelled' || inquiry.status === 'rejected' ? XCircleIcon :
              ClockIcon,
        color: inquiry.status === 'completed' ? 'green' : 
               inquiry.status === 'cancelled' || inquiry.status === 'rejected' ? 'red' :
               'yellow'
      });
    }

    // Quotes
    if (inquiry.quotes && inquiry.quotes.length > 0) {
      inquiry.quotes.forEach((quote, index) => {
        events.push({
          id: `quote-${index}`,
          type: 'quote',
          title: `Quote Submitted`,
          description: `Quote for ${quote.amount.toLocaleString()} ${quote.currency} submitted`,
          timestamp: quote.submittedAt,
          icon: CurrencyDollarIcon,
          color: 'purple'
        });

        if (quote.status === 'accepted') {
          events.push({
            id: `quote-accepted-${index}`,
            type: 'quote-response',
            title: 'Quote Accepted',
            description: `Customer accepted the quote`,
            timestamp: quote.acceptedAt || inquiry.updatedAt,
            icon: CheckCircleIcon,
            color: 'green'
          });
        } else if (quote.status === 'rejected') {
          events.push({
            id: `quote-rejected-${index}`,
            type: 'quote-response',
            title: 'Quote Rejected',
            description: `Customer rejected the quote`,
            timestamp: quote.rejectedAt || inquiry.updatedAt,
            icon: XCircleIcon,
            color: 'red'
          });
        }
      });
    }

    // Consultation
    if (inquiry.consultation?.scheduled) {
      events.push({
        id: 'consultation-scheduled',
        type: 'consultation',
        title: 'Consultation Scheduled',
        description: `${inquiry.consultation.location} consultation scheduled for ${new Date(inquiry.consultation.dateTime).toLocaleDateString()}`,
        timestamp: inquiry.consultation.scheduledAt || inquiry.updatedAt,
        icon: CalendarIcon,
        color: 'indigo'
      });

      if (inquiry.consultation.status === 'completed') {
        events.push({
          id: 'consultation-completed',
          type: 'consultation',
          title: 'Consultation Completed',
          description: 'Consultation session completed successfully',
          timestamp: inquiry.consultation.completedAt,
          icon: CheckCircleIcon,
          color: 'green'
        });
      }
    }

    // Messages (only show milestone messages)
    if (inquiry.messages && inquiry.messages.length > 0) {
      const milestoneMessages = inquiry.messages.filter(msg => 
        msg.message.toLowerCase().includes('update') ||
        msg.message.toLowerCase().includes('progress') ||
        msg.message.toLowerCase().includes('milestone')
      );

      milestoneMessages.forEach((message, index) => {
        events.push({
          id: `message-${index}`,
          type: 'message',
          title: 'Project Update',
          description: message.message.substring(0, 100) + (message.message.length > 100 ? '...' : ''),
          timestamp: message.timestamp,
          icon: ChatBubbleLeftRightIcon,
          color: 'gray'
        });
      });
    }

    // Sort by timestamp
    return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800'
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800'
      },
      gray: {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-600'
      }
    };
    return colors[color] || colors.gray;
  };

  const timelineEvents = getTimelineEvents();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
        Project Timeline
      </h3>

      {timelineEvents.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No timeline events yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon;
            const colors = getColorClasses(event.color);
            const isLast = index === timelineEvents.length - 1;

            return (
              <div key={event.id} className="relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200 dark:bg-gray-600"></div>
                )}

                {/* Event */}
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-6 w-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Future Events (if any) */}
      {inquiry.status === 'accepted' && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Upcoming Milestones
          </h4>
          <div className="space-y-3">
            {inquiry.consultation?.scheduled && new Date(inquiry.consultation.dateTime) > new Date() && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Scheduled Consultation
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {new Date(inquiry.consultation.dateTime).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {inquiry.quotes?.some(q => q.status === 'accepted' && q.timeline?.milestones?.length > 0) && (
              <div className="space-y-2">
                {inquiry.quotes
                  .find(q => q.status === 'accepted')
                  ?.timeline?.milestones?.filter(m => new Date(m.date) > new Date())
                  .map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {milestone.name}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Due: {new Date(milestone.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryTimeline;