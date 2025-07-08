"use client";

import { useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const user = useSelector((state) => state.auth?.user);
  //const isVerified = false;
  const isVerified = user?.isVerified;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const alwaysVisibleItems = [
    { title: "Dashboard", path: "/dashboard", icon: "/dashboard.png" },
    { title: "Chat", path: "/app-chatt", icon: "/icons/sidebar/chatt.svg" },
    {
      title: "Terms & Conditions",
      path: "/terms-conditions",
      icon: "/icons/sidebar/terms.svg",
    },
    {
      title: "Account Setting",
      path: "/account-setting",
      pathTwo: "/profile-update",
      pathThree: "/update-password",
      icon: "/user.png",
    },
  ];

  const verifiedOnlyItems = [
    { title: "Orders", path: "/orders", icon: "/icons/sidebar/orders.svg" },
    {
      title: "Payment History",
      path: "/payment-history",
      icon: "/icons/sidebar/payment.svg",
    },
    {
      title: "Wallet",
      path: "/wallet",
      pathTwo: "/bank-transfer",
      icon: "/icons/sidebar/wallet.svg",
    },
    { title: "Rewards", path: "/rewards", icon: "/icons/sidebar/rewards.svg" },
  ];

  const menuItems = isVerified
    ? [...alwaysVisibleItems, ...verifiedOnlyItems]
    : alwaysVisibleItems;

  const handleClick = () => setShowPopUp(!showPopUp);

  const LogOutUser = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.removeItem("authToken");
      router.push("/login");
    }
  };

  if (pathname === "/bank-transfer") {
    if (menuItems[3]?.path === "/wallet") {
      console.log("The third index path is /wallet");
    }
  }

  return (
    <div
      className={`bg-gray-900 sm-screen-side-nav h-screen text-white fixed left-0 z-50 flex flex-col transition-all duration-1000 md:duration-1000 ${
        isCollapsed ? "w-10 md:w-16" : "w-52"
      }`}
      style={{ top: "75px" }}
    >
      {/* Sidebar Toggle Button */}
      <div className="flex justify-end">
        <button
          className="mt-3 md:mt-0 px-2 md:p-4 flex justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Profile Section */}
      {!isCollapsed && (
        <div className="text-center p-3 profile">
          <Image
            src="/header/profile.svg"
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full mx-auto cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          <h2 className="text-lg text-white flex justify-center font-bold mt-2">
            Hello, User
          </h2>
        </div>
      )}

      {/* Sidebar Menu Items */}
      <nav className="mt-1 nav-items flex-grow space-y-3">
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.path ||
            pathname === item.pathTwo ||
            pathname === item.pathThree;
          return (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center px-4 py-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              } transition`}
            >
              <Image
                src={item.icon}
                width={18}
                height={18}
                alt={item.title}
                className="mr-4"
              />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}

        {/* Logout Button */}
        <div className="px-2 md:mt-1">
          <button
            onClick={handleClick}
            className="flex text-white items-center space-x-4 hover:bg-red-700 p-2 rounded"
          >
            <FaSignOutAlt size={16} className="text-white" />
            {!isCollapsed && <span className="text-white">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showPopUp && (
        <div
          className="fixed inset-0 flex justify-center items-center"
          onClick={() => setShowPopUp(false)}
        >
          <div
            className="fixed rounded-lg flex border-2 flex-col shadow-xl items-center gap-2 w-1/3 backdrop-blur-xl p-3 md:p-6"
            style={{ top: "30%", left: "40%" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h1 className="text-black">Confirm Logout</h1>
            <h3 className="text-black">Are you sure you want to logout?</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClick}
                className="text-black px-6 bg-white py-2 rounded-md border-2 border-gray-500"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-md text-white bg-[#DC3545]"
                onClick={LogOutUser}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
