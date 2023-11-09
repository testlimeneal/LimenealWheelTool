// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const profile = {
    id: 'profile',
    title: 'Profile',
    type: 'group',
    children: [
        // {
        //     id: 'settings',
        //     title: 'Settings',
        //     type: 'item',
        //     url: '/profile/settings',
        //     icon: icons['IconDashboard'],
        //     breadcrumbs: false
        // },
        {
            id: 'assesments',
            title: 'Assesments',
            type: 'item',
            url: '/profile/assesments',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        // {
        //     id: 'tool',
        //     title: 'Tool',
        //     type: 'item',
        //     url: '/profile/assesments   ',
        //     icon: icons['IconDashboard'],
        //     breadcrumbs: false
        // },
        {
            id: 'reports',
            title: 'Reports',
            type: 'item',
            url: '/profile/reports',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        // {
        //     id: 'payments',
        //     title: 'Payments',
        //     type: 'item',
        //     url: '/profile/payments   ',
        //     icon: icons['IconDashboard'],
        //     breadcrumbs: false
        // }
    ]
};
