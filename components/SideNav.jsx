"use client"


import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Toggle the sidebar state
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle the dropdown menu
  };

  return (
    <div
      className={`fixed md:h-auto z-50 ${!isCollapsed ? "-left-6 " : "left-0"} top-[94] md:left-0 p-0 m-0 ${isCollapsed ? 'w-46' : 'w-10 md:w-20'} border-2 transition-all duration-300 bg-[#FFFFFF]`} style={{top:"94px"}}
    >
      <div className="flex flex-col items-center m-0 p-0 w-full xl:h-[120vh]">
        {/* Top section with profile and sidebar toggle */}
        <div
          className={`flex ${!isCollapsed ? 'px-3' : ''} py-6 items-center space-x-3 border-b-2 relative`}
        >
          <button
            className={`bg-bg w-[23] w-23 h-[23] rounded-full flex justify-center items-center absolute ${!isCollapsed ? "-right-3" : "-right-9"} top-7`}
            onClick={toggleSidebar}
          >
            <Image src={"/icons/sidebar/arrow.svg"} width={8} height={8} alt="" />
          </button>
    
          {/* Profile section with dropdown */}
          {/* fina */}
          <div className="relative">
            <img
              src={"/header/profile.svg"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />

            {isDropdownOpen && (
              <div className="absolute border-2 shadow-md -right-6 mt-2 bg-white text-black rounded-md">
                <ul>
                  <li className="px-4 py-2 cursor-pointer text-black">Profile</li>
                  <li className="px-4 py-2 cursor-pointer text-black">Settings</li>
                  <li className="px-4 py-2 cursor-pointer text-black">Logout</li>
                </ul>
              </div>
            )}
          </div>

          {/* Display the user text only when the sidebar is expanded */}
          {isCollapsed && <span className="text-sm">Hello, User</span>}
        </div>

        {/* Sidebar Menu Items */}
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-col content-end items-start p-4 space-y-6">
            <Link href={"/dashboard"} className="flex active:bg-blue-800 items-center space-x-3">
              <Image src={"/dashboard.png"} width={17} height={19} alt="Orders" />
              {isCollapsed && <span className="text-sm p3">Dashboard</span>}
            </Link>
            <Link href={"/orders"} className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/orders.svg"} width={17} height={19} alt="Orders" />
              {isCollapsed && <span className="text-sm p3">Orders</span>}
            </Link>
            <Link href={"/payment-history"} className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/payment.svg"} width={18} height={18} alt="Payment History" />
              {isCollapsed && <span className="text-sm p3">Payment History</span>}
            </Link>
            <Link href={"/wallet"} className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/wallet.svg"} width={18} height={17} alt="Wallet" />
              {isCollapsed && <span className="text-sm p3">Wallet</span>}
            </Link>
            <Link href={"/app-chatt"} className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/chatt.svg"} width={19} height={19} alt="Chat" />
              {isCollapsed && <span className="text-sm p3">Chat</span>}
            </Link>
            <Link href={"/rewards"} className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/rewards.svg"} width={19} height={18} alt="Rewards" />
              {isCollapsed && <span className="text-sm p3">Rewards</span>}
            </Link>
            <Link href={"terms-conditions"} className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/terms.svg"} width={19} height={18} alt="Terms & Conditions" />
              {isCollapsed && <span className="text-sm p3">Terms & Conditions</span>}
            </Link>
            <Link href={"/account-setting"} className="flex items-center space-x-3">
              <Image src={"/user.png"} width={24} height={14} alt="Account setting" />
              {isCollapsed && <span className="text-sm p3">Account Setting</span>}
            </Link>
            <div className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/agent.svg"} width={16} height={14} alt="Switch to Agent" />
              {isCollapsed && <span className="text-sm p3">Switch to Agent</span>}
            </div>
            <div className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/delete.svg"} width={16} height={14} alt="Delete Account" />
              {isCollapsed && <span className="text-sm p3">Delete Account</span>}
            </div>
          </div>

          {/* Logout Section */}
          <div className="p-4">
            <button className="flex items-center space-x-3">
              <Image src={"/icons/sidebar/Logout.svg"} width={17} height={18} alt="Logout" />
              {isCollapsed && <span className="text-sm p3">logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
