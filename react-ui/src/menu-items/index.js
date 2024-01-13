import { user_dashboard, superadmin_dashboard } from './dashboard';
import { profile } from './profile';
import { utilities } from './utilities';
import { other } from './other';
import { jobs } from './admin/jobs';
import { systemusers } from './admin/systemusers';
import { operatortalent } from './talent/operator';
import { superadmintalent } from './talent/superadmin';

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
  // items: [dashboard, profile,utilities, other]
  items: {
    user: [user_dashboard, profile],
    superadmin: [superadmin_dashboard, jobs,superadmintalent, systemusers],
    admin: [superadmin_dashboard, operatortalent, systemusers],
  },
};

export default menuItems;
