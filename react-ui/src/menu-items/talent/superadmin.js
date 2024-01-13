// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
  IconDashboard: IconDashboard,
  IconDeviceAnalytics,
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const superadmintalent = {
  id: 'talent',
  title: 'Talent Careers',
  type: 'group',
  children: [
    {
      id: 'talent_careers',
      title: 'Map Talent Careers',
      type: 'item',
      url: '/superadmin/talent/careers',
      icon: icons['IconDashboard'],
      breadcrumbs: false,
    },
  ],
};
