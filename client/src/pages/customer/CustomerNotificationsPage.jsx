//import NotificationPanel from '../dashboard/NotificationPanel';

import NotificationPanel from "../dashboard/NotificationPanel";

const CustomerNotificationsPage = () => {
  return (
    <div className="p-6">
      {/* Force NotificationPanel to render as a page */}
      <NotificationPanel isOpen={true} onClose={() => {}} />
    </div>
  );
};

export default CustomerNotificationsPage;
