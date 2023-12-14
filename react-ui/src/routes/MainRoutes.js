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
const Superadminusers = Loadable(lazy(() => import('../views/superadmin/users')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/sample-page')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
  const location = useLocation();
  const account = useSelector((state) => state.account);

  const roleRoutes = {
    user: ['/dashboard', '/profile/assesments', '/profile/settings', '/profile/reports'],
    superadmin: ['/dashboard', '/superadmin/jobs', '/superadmin/users'],
    // Add more roles and their corresponding routes as needed
  };
  
  const path = account.user?.role ? roleRoutes[account.user.role] || [] : [...roleRoutes.user, ...roleRoutes.superadmin];


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
            <Route path="/superadmin/users" component={Superadminusers} />
          </AuthGuard>
        </Switch>
      </MainLayout>
    </Route>
  );
};

export default MainRoutes;
