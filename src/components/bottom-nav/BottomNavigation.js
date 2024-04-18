import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { IoSettings, IoSettingsOutline, IoHomeOutline, IoHome } from "react-icons/io5";
import { FaList, FaListAlt } from "react-icons/fa";
import { RiFileList3Line, RiFileList3Fill } from "react-icons/ri";
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';

export default function BottomNavigations() {

  const bottomNavStyle = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    borderTopRightRadius: '40px',
    borderTopLeftRadius: '40px',
    backgroundColor: '#3f51b5', // Assuming your primary color is #3f51b5
  };

  const location = useLocation();

  const { pathname } = location;

  const navigate = useNavigate()

  const [value, setValue] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bottomNavList = [
    {
      pageName: "Home",
      pathname: "/",
      icon: pathname === '/' ? <IoHome /> : <IoHomeOutline />
    },
    {
      pageName: "Products List",
      pathname: "/products-list",
      icon: pathname === '/products-list' ? <FaListAlt /> : <FaList />
    },
    {
      pageName: "Create Bill",
      pathname: "/create-bill",
      icon: pathname === '/create-bill' ? <RiFileList3Fill /> : <RiFileList3Line />
    },
    {
      pageName: "Settings",
      pathname: "/settings",
      icon: pathname === '/settings' ? <IoSettings /> : <IoSettingsOutline />
    },
  ]

  // Update the value of the bottom navigation based on the current pathname
  useEffect(() => {
    const selectedItem = bottomNavList.find(item => item.pathname === pathname);
    if (selectedItem) {
      setValue(bottomNavList.indexOf(selectedItem));
    }
  }, [pathname, bottomNavList]);

  const exludeBottomNavPaths = ['/about-us', '/all-prices']

  return (
    <div style={bottomNavStyle}>
      <Box sx={{ display: { xs: `${exludeBottomNavPaths?.includes(pathname) ? 'none' : "block"}`, md: 'none', } }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(bottomNavList[newValue].pathname); // Navigate to the selected pathname
          }}
        >
          {bottomNavList.map((data, index) => {
            return (
              <BottomNavigationAction key={index} label={data.pageName} icon={data.icon} />
            );
          })}
        </BottomNavigation>
      </Box>
    </div>
  )
}
