"use client";

import { APP_NAMES } from "@/config/constants";
import { getCurrency, getCurrencyNameFromPhone } from "@/config/helpers";
import { BASE_URL } from "@/constants/apiUrls";
import { logOut } from "@/redux/auth/authSlice";
import { useGetAllNotificationsQuery, useSeenAllNotificationsMutation, useSeenSingleNotificationMutation } from "@/redux/notifications/notificationsApi";
import { useGetUserCurrencyAndCountryQuery } from "@/redux/order/ordersApi";
import { useGetWalletAmountQuery } from "@/redux/payments/paymentApi";
import { useGetRewardAmountsQuery } from "@/redux/rewards/rewardsApi";
import { api } from "@/redux/service";
import { useGetProfileQuery } from "@/redux/user/profileApi";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiSearch } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const Header = ({ profileName, profileImage }) => {
  const [link, setLink] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isShowNotifications, setIsShowNotifications] = useState(false);

  const { data: rewardAmounts } = useGetRewardAmountsQuery();
  const Branch = dynamic(() => import("branch-sdk"), { ssr: false });

  const invitationMsg = `I highly recommend the ${
    APP_NAMES.HYBRID_RESEARCH_CENTER
  } for research, thesis, and assignments - it's easy to use and more affordable than other platforms! If you're interested in trying it out, you can sign up using the link below and receive an amount of ${
    rewardAmounts?.result?.referbyamount ?? "5"
  } free credit in your native currency after placing your first order.`;

  const user = useSelector((state) => state.auth?.user);
  const { data: profileData } = useGetProfileQuery(user?.userid);

  const currencyFormData = new FormData();
  currencyFormData.append("clientid", user?.userid);
  const { data: userDataCurrencies } =
    useGetUserCurrencyAndCountryQuery(currencyFormData);
  const {
    data: walletAmount,
    isLoading: walletAmountLoading,
    refetch: walletAmountRefech,
  } = useGetWalletAmountQuery({
    clientId: user?.userid,
    currency: getCurrency(getCurrencyNameFromPhone(user?.user_contact_no)),
    nativecurrency: userDataCurrencies?.result?.currency
      ? getCurrency(userDataCurrencies?.result?.currency)
      : getCurrency(getCurrencyNameFromPhone(user?.user_contact_no)),
  });

  const [userData, setUserData] = useState({
    profileImage: profileData?.path
      ? BASE_URL + profileData?.path
      : "/header/profile.svg",
    name: profileData?.name || "Hello, User",
  });

  const modalRef = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleInviteClick = () => {
    setShowInviteForm(!showInviteForm);
  };
  const handleClick = () => {
    setShowModal(!showModal);
  };

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setShowModal(false);
    }
  };

  const LogOutUserFunction = () => {
    console.log("User logged out");
    dispatch(logOut()); // Clear redux state
    dispatch(api.util.resetApiState());
    router.push("/sign-in"); // Redirect to login
  };

  const handleProfile = () => {
    router.push("/profile-update");
  };

  // Close modal on route change
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) || isShowNotifications) {
        setShowModal(false);
        setIsShowNotifications(false);
      }
    };

    if (showModal || isShowNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (profileData) {
      const updatedUser = {
        profileImage: BASE_URL + profileData?.path,
        name: profileData?.name,
      };
      setUserData(updatedUser);
    }
  }, [profileData]);

  useEffect(() => {
    setShowModal(false);
    setIsDropdownOpen(false);
    setIsShowNotifications(false)
  }, [pathname]);

  // console.log("suerData", userData);
  const brachUrl = process.env.NEXT_PUBLIC_BRANCH_TEST_KEY;

  useEffect(() => {
    const initBranch = async () => {
      if (typeof window === "undefined") return;

      try {
        const key = process.env.NEXT_PUBLIC_BRANCH_TEST_KEY;
        if (!key && !brachUrl) {
          console.error("Branch key missing!");
          return;
        }

        const branchLib =
          (await import("branch-sdk")).default || (await import("branch-sdk"));
        if (!branchLib.initialized) {
          branchLib.init(key);
        }

        const data = {
          canonicalIdentifier: "referral",
          title: "Hybrid Research Center",
          contentDescription: "Install this app using my referral link.",
          contentMetadata: { customMetadata: { userId: user?.userid } },
        };
        const linkData = {
          data,
          feature: "referral",
          channel: "web",
          $fallback_url: "https://www.hybridresearchcenter.com/",
        };

        branchLib.link(linkData, (err, url) => {
          if (!err && url) setLink(url);
        });
      } catch (e) {
        console.error("Branch init error", e);
      }
    };

    initBranch();
  }, []);

  const formData = new FormData();
  formData.append("userId", user?.userid);

  const {data: notificationsData,error,isLoading,} = useGetAllNotificationsQuery(formData);

  const [seenAllNotifications, { error: seenAllNotificationsError, isLoading: seenAllNotificationsLoading }] = useSeenAllNotificationsMutation();

 

  const notifications = notificationsData?.data || [
    {
      clientid: "3751",
      id: "112",
      notification:
        "Dear, your final file for Order ID 17821 has been uploaded on the app. Please download the file.",
      orderid: "17821",
      show_date: "2025-07-28T01:17:31+00:00",
      status: "Viewed",
      subject: "Final File Uploaded",
      ts: "2025-07-28T01:17:31+00:00",
    },
  ];

  // Helper functions
const groupNotificationsByDate = (notifications) => {
  if (!notifications || notifications.length === 0) return [];
  
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const groups = {};
  
  notifications.forEach(notification => {
    // Safely parse the date - use either ts or show_date
    const dateString = notification.ts || notification.show_date;
    if (!dateString) return; // Skip if no date field exists
    
    const notificationDate = new Date(dateString);
    if (isNaN(notificationDate.getTime())) return; // Skip invalid dates
    
    const notificationDay = new Date(notificationDate);
    notificationDay.setHours(0, 0, 0, 0);
    
    let dateLabel;
    const timeDiff = now - notificationDate;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    
    if (minutesDiff < 60) {
      dateLabel = minutesDiff < 1 ? 'Just now' : 
                 minutesDiff === 1 ? '1 minute ago' : 
                 `${minutesDiff} minutes ago`;
    }
    else if (hoursDiff < 24 && notificationDay.getTime() === today.getTime()) {
      dateLabel = hoursDiff === 1 ? '1 hour ago' : `${hoursDiff} hours ago`;
    }
    else if (notificationDay.getTime() === today.getTime()) {
      dateLabel = 'Today';
    }
    else if (notificationDay.getTime() === yesterday.getTime()) {
      dateLabel = 'Yesterday';
    }
    else if (notificationDate >= thisWeekStart) {
      dateLabel = notificationDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
    else {
      dateLabel = notificationDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
    
    const groupKey = notificationDay.getTime();
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        date: notificationDay.getTime(),
        dateLabel,
        notifications: []
      };
    }
    
    groups[groupKey].notifications.push({
      ...notification,
      relativeTime: formatTime(notificationDate),
      isRead: notification.status === "Viewed"
    });
  });
  
  return Object.values(groups)
    .sort((a, b) => b.date - a.date)
    .map(group => ({
      ...group,
      notifications: group.notifications.sort((a, b) => {
        const dateA = new Date(a.ts || a.show_date);
        const dateB = new Date(b.ts || b.show_date);
        return dateB - dateA;
      })
    }));
};

// Updated formatTime with null check
const formatTime = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

  const markAllAsRead =async () => {
    try {
      // Your implementation to mark all notifications as read
      const response =await seenAllNotifications(formData);
      console.log("response notifications",response)
    } catch (error) {
      console.log("error with seen all notifications", error);
    }
    
  };





  const [seenSingleNotification, {error:seenSingleNotificationError,isLoading:seenSingleNotificationLoading}] = useSeenSingleNotificationMutation()

  const handleSeenSingleNotification = async (id,orderId) => {
    try {
      const notification = notifications.find((item) => item.id === id);
      console.log("notification",notification)
      if(notification?.status == "Viewed"){
        router.push(`/orders/${orderId}`);
        setIsShowNotifications(false)
        return;
      }else{
        const body = new FormData();
        body.append("notificationId",id)
        const response = await seenSingleNotification(body);
        // console.log("response",response?.data?.message)
        if(response?.data?.message == "Notification marked as viewed."){
          router.push(`/orders/${orderId}`);
          setIsShowNotifications(false)
        }
      }
      // const som = href={`/orders/${notification?.orderid}`}
      console.log("notification",notification)
    } catch (error) {
      console.log("error",error)
    }
  }


  return (
    <>
      <header className="bg-primary px-2 md:px-0 fixed w-full z-50">
        <div
          className="flex items-center gap-4 justify-end px-8 text-white"
          style={{ height: "75px" }}
        >
          <div>
            <button
              onClick={handleClick}
              className="non bg-[#3BB537] p3 white px-2 py-2 md:px-4 md:py-3 rounded-md hover:bg-blue-500 transition duration-300"
            >
              Refer and Earn
            </button>
          </div>

          <div className="relative lg:w-1/3 flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10  pr-4 py-2 w-[90%] md:w-full rounded-md bg-[#FFFFFF] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <HiSearch
              className="absolute right-8 md:right-3 text-gray-400"
              size={20}
            />
          </div>

          <div className="flex items-center md:space-x-3">
            <div className="relative" ref={dropdownRef}>
              <img
                src={userData?.profileImage}
                alt={userData?.name}
                // width={40}
                // height={40}
                className="rounded-full w-14 h-14 customWidth cursor-pointer"
                onClick={toggleDropdown}
              />

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                  <ul>
                    <li
                      className={`px-4 ${
                        pathname === "/profile-update"
                          ? "bg-primary hover:text-white text-white"
                          : ""
                      } py-2 hover:bg-primary hover:text-white cursor-pointer`}
                      onClick={handleProfile}
                    >
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer">
                      Settings
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                      onClick={LogOutUserFunction}
                    >
                      Logout
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                      onClick={() => {
                        setIsShowNotifications(!isShowNotifications);
                        setIsDropdownOpen(false);
                      }}
                    >
                      Notifications
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <span className="text-sm">{userData?.name}</span>
          </div>
        </div>
      </header>

      {showModal && (
        <>
          <div
            className="fixed shadow-2xl z-50 inset-0 w-full h-full flex justify-center items-center"
            onClick={() => setShowModal(false)}
          >
            <div
              ref={modalRef}
              className="flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="z-50 backdrop-blur-xl border-2 w-1/2 rounded-xl shadow-lg fixed top-48"
                style={{ left: "30%" }}
              >
                <button onClick={handleClick} className="px-8 py-2">
                  Back
                </button>
                <div className="mb-8 pt-12 pb-4">
                  <div className="-mt-12">
                    <input
                      type="text"
                      value={link}
                      readOnly
                      className="pr-16 ms-6 border border-gray-300 rounded-lg py-3 px-4"
                      style={{ width: "70%" }}
                    />
                  </div>
                  <div className="px-6 mt-3 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="mt-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          Invite Friends, Earn Credits
                        </h2>
                        <p className="text-gray-600 mt-2">
                          Share your referral link and earn rewards for every
                          friend who joins
                        </p>
                        <div className="mt-4 flex items-center">
                          <span className="text-lg font-medium text-gray-700">
                            Total Earned:
                          </span>
                          <span className="ml-2 text-2xl font-bold text-primary">
                            0.05 {walletAmount?.currency}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="absolute right-2 top-11 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
                      >
                        <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isShowNotifications && (
  <div className="fixed inset-0 z-50">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setIsShowNotifications(false)}
    />

    {/* Notification panel */}
    <div
      className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-primary to-primary dark:from-gray-800 dark:to-gray-900 p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsShowNotifications(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {groupNotificationsByDate(notifications).map((group) => (
          <div key={group.date} className="mb-4">
            {/* Date header */}
            <div className="sticky top-0 px-4 py-2 bg-gray-50 dark:bg-gray-800 z-10">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded-full">
                {group.dateLabel}
              </span>
            </div>

            {/* Notifications */}
            {group.notifications.map((notification) => {
              const notificationDate = new Date(notification.ts || notification.show_date);
              return (
                <div
                  key={notification.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 ${
                    !notification.isRead 
                      ? 'border-primary bg-blue-50 dark:bg-gray-800' 
                      : 'border-transparent'
                  }`}
                  onClick={() => handleSeenSingleNotification(notification?.id,notification?.orderid)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary dark:text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.subject || "Notification"}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {formatTime(notificationDate)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.notification}
                      </p>
                      {notification.orderid && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Order ID: {notification.orderid}
                        </p>
                      )}
                      {notification?.status != "Viewed" && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Unread
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer with Mark All as Read button */}
      <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={markAllAsRead}
          className="w-full py-2 px-4 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Mark All as Read
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Header;
