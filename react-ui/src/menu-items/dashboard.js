// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const user_dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        }
    ]
};

export const superadmin_dashboard = {
    id: 'dashboard',
    title: 'Access Control',
    type: 'group',
    children: [
        {
            id: 'createadminuser',
            title: 'Admin Acess',
            type: 'item',
            url: '/operator/admin',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        {
            id: 'createclientadminuser',
            title: 'Client-Admin Acess',
            type: 'item',
            url: '/operator/clientadmin',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        {
            id: 'createsubadminuser',
            title: 'Client Sub-Admin Acess',
            type: 'item',
            url: '/operator/clientsubadmin',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        }
    ]
};
