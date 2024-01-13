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
            title: 'Manage Super Admin Level Users',
            type: 'item',
            url: '/limeneal/superadmin/users',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        {
            id: 'limeneal_admin_users',
            title: 'Manage Admin Level Users',
            type: 'item',
            url: '/limeneal/admin/users',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        {
            id: 'limeneal_clientadmin_users',
            title: 'Manage Client-Admin Level Users',
            type: 'item',
            url: '/limeneal/clientadmin/users',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        {
            id: 'limeneal_clientsubadmin_users',
            title: 'Manage Client-SubAdmin Level Users',
            type: 'item',
            url: '/limeneal/clientsubadmin/users',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        }
    ]
};
