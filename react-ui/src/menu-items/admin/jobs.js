// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//
    
export const jobs = {
    id: 'jobs',
    title: 'Add Careers',
    type: 'group',
    children: [
        {
            id: 'careers',
            title: 'Manage Careers',
            type: 'item',
            url: '/superadmin/jobs',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        }
    ]
};
