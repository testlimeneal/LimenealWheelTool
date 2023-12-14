import { user_dashboard,superadmin_dashboard } from './dashboard';
import { profile } from './profile';
import { utilities } from './utilities';
import { other } from './other';
import { jobs } from './admin/jobs';
import { systemusers } from './admin/systemusers';

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
    // items: [dashboard, profile,utilities, other]
    items: {'user':[user_dashboard, profile],'superadmin':[superadmin_dashboard,jobs,systemusers]}
};

export default menuItems;
