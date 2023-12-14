// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//
    
export const systemusers = {
    id: 'users',
    title: 'Limeneal Users',
    type: 'group',
    children: [
        {
            id: 'limeneal_users',
            title: 'Manage User',
            type: 'item',
            url: '/superadmin/users',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        }
    ]
};
