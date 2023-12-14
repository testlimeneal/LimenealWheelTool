import React from 'react';

// material-ui
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
// project imports
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const account = useSelector((state) => state.account);
    const navItems = (account.user && account.user.role) ? menuItem.items[account.user.role].map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    }) : [];

    return navItems;
};

export default MenuList;
