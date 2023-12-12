import { user_dashboard,superadmin_dashboard } from './dashboard';
import { profile } from './profile';
import { utilities } from './utilities';
import { other } from './other';

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
    // items: [dashboard, profile,utilities, other]
    items: {'user':[user_dashboard, profile],'super-admin':[superadmin_dashboard]}
};

export default menuItems;
