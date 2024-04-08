import React from 'react'
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { IoSettings, IoSettingsOutline, IoHomeOutline, IoHome } from "react-icons/io5";
import { FaList, FaListAlt } from "react-icons/fa";
import { RiFileList3Line, RiFileList3Fill } from "react-icons/ri";

export default function BottomNavigation() {
  const location = useLocation();

  const { pathname } = location;

  const bottomNavList = [
    {
      pageName: "Home",
      pathname: "/",
      icon: pathname === '/' ? <IoHome size={21} /> : <IoHomeOutline size={21} />
    },
    {
      pageName: "Products List",
      pathname: "/products-list",
      icon: pathname === '/products-list' ? <FaListAlt size={21} /> : <FaList size={21} />
    },
    {
      pageName: "Create Bill",
      pathname: "/create-bill",
      icon: pathname === '/create-bill' ? <RiFileList3Fill size={21} /> : <RiFileList3Line size={21} />
    },
    {
      pageName: "Settings",
      pathname: "/settings",
      icon: pathname === '/settings' ? <IoSettings size={21} /> : <IoSettingsOutline size={21} />
    },
  ]

  return (
    <div className="d-md-none d-block bottom-nav">
      <div
        style={{
          borderTopRightRadius: "40px",
          borderTopLeftRadius: "40px",
        }}
        className="row fixed-bottom bg-primary py-2">
        {bottomNavList?.map((data, index) => {
          return (
            <Link
              to={data?.pathname}
              className={`col-3 nav-text text-center text-light d-flex flex-column gap-1 align-items-center text-decoration-none`}
              key={index}
            >
              {data?.icon}
              <div
                className={`text-light`}
              >
                <p className={`mb-0 ${pathname === data?.pathname && `fw-bold`}`}>
                  {data?.pageName}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
