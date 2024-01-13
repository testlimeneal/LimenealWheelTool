// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
  IconDashboard: IconDashboard,
  IconDeviceAnalytics,
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const operatortalent = {
  id: 'superadmin_talent',
  title: 'Talent Careers',
  type: 'group',
  children: [
    {
      id: 'careers',
      title: 'Request Talent Careers',
      type: 'item',
      url: '/operator/talent/request',
      icon: icons['IconDashboard'],
      breadcrumbs: false,
    },
  ],
};
