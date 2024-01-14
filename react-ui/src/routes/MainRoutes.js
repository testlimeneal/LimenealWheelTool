import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// assesments routing
const Assesment = Loadable(lazy(() => import('../views/assesment')));
const Report = Loadable(lazy(() => import('../views/profile/reports')));

const Careers = Loadable(lazy(() => import('../views/superadmin/careers')));
const Superadminusers = Loadable(lazy(() => import('../views/superadmin/users/super-admin/users')));
const Adminusers = Loadable(lazy(() => import('../views/superadmin/users/admin/users')));
const ClientAdminusers = Loadable(lazy(() => import('../views/superadmin/users/client-admin/users')));
const ClientSubAdminusers = Loadable(lazy(() => import('../views/superadmin/users/client-subadmin/users')));

const AdminOperators = Loadable(lazy(() => import('../views/superadmin/admin')));
const ClientAdminOperators = Loadable(lazy(() => import('../views/superadmin/clientadmin')));
const ClientSubAdminOperators = Loadable(lazy(() => import('../views/superadmin/clientsubadmin')));

const TalentCareers = Loadable(lazy(() => import('../views/talent/careers')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/sample-page')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
  const location = useLocation();
  const account = useSelector((state) => state.account);

  const roleRoutes = {
    user: ['/dashboard', '/profile/assesments', '/profile/settings', '/profile/reports'],
    superadmin: [
      '/dashboard',
      '/superadmin/jobs',
      '/limeneal/superadmin/users',
      '/limeneal/admin/users',
      '/limeneal/clientadmin/users',
      '/limeneal/clientsubadmin/users',
      '/operator/admin',
      '/operator/clientadmin',
      '/operator/clientsubadmin',
    ],
    admin: [
      '/dashboard',
      '/superadmin/jobs',
      '/limeneal/superadmin/users',
      '/limeneal/admin/users',
      '/limeneal/clientadmin/users',
      '/limeneal/clientsubadmin/users',
      '/operator/admin',
      '/talent/request',
      '/operator/clientadmin',
      '/operator/clientsubadmin',
      '/operator/talent/request',
    ],
  };

  const path = account.user?.role
    ? roleRoutes[account.user.role] || []
    : [...roleRoutes.user, ...roleRoutes.superadmin, ...roleRoutes.admin];

  return (
    <Route path={path}>
      <MainLayout>
        <Switch location={location} key={location.pathname}>
          <AuthGuard>
            <Route path="/dashboard" component={DashboardDefault} />

            {/* User Routes */}
            <Route path="/profile/assesments" component={Assesment} />
            <Route path="/profile/reports" component={Report} />

            {/* Super Admin Routes */}
            <Route path="/superadmin/jobs" component={Careers} />
            <Route path="/limeneal/superadmin/users" component={Superadminusers} />
            <Route path="/limeneal/admin/users" component={Adminusers} />
            <Route path="/limeneal/clientadmin/users" component={ClientAdminusers} />
            <Route path="/limeneal/clientsubadmin/users" component={ClientSubAdminusers} />
            <Route path="/operator/admin" component={AdminOperators} />
            <Route path="/operator/clientadmin" component={ClientAdminOperators} />
            <Route path="/operator/clientsubadmin" component={ClientSubAdminOperators} />

            {/* Talent Routes */}
            <Route path="/operator/talent/request" component={TalentCareers} />
          </AuthGuard>
        </Switch>
      </MainLayout>
    </Route>
  );
};

export default MainRoutes;
