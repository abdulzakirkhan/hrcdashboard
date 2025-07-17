"use client";

import { APP_NAMES } from "@/config/constants";
import { logOut } from "@/redux/auth/authSlice";
import { useGetRewardAmountsQuery } from "@/redux/rewards/rewardsApi";
import { api } from "@/redux/service";
import { useGetProfileQuery } from "@/redux/user/profileApi";
import { ClipboardDocumentIcon, ShareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import branch from "branch-sdk";


const Header = ({ profileName, profileImage }) => {
  const [link, setLink] = useState("second");
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
  const { data: rewardAmounts } = useGetRewardAmountsQuery();
  

    const invitationMsg = `I highly recommend the ${
      APP_NAMES.HYBRID_RESEARCH_CENTER
    } for research, thesis, and assignments - it's easy to use and more affordable than other platforms! If you're interested in trying it out, you can sign up using the link below and receive an amount of ${
      rewardAmounts?.result?.referbyamount ?? "5"
    } free credit in your native currency after placing your first order.`;

  const user = useSelector((state) => state.auth?.user);
  const { data: profileData } = useGetProfileQuery(user?.userid);





    const [userData, setUserData] = useState({
      profileImage: profileData?.path
        ? "https://staging.portalteam.org" + profileData?.path
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
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
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
      profileImage: "https://staging.portalteam.org" + profileData?.path,
      name: profileData?.name,
    };
    setUserData(updatedUser);
  }
}, [profileData]);

  useEffect(() => {
    setShowModal(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // console.log("suerData", userData);
  const brachUrl = process.env.NEXT_PUBLIC_BRANCH_TEST_KEY;

    const generateLink = async () => {
      try {
        // ✅ Initialize only once
        if (!branch.initialized) {
          branch.init(brachUrl); // Use your real public Branch key
        }
  
        // Branch data payload
        const data = {
          canonicalIdentifier: "referral",
          title: "Hybrid Research Center",
          contentDescription: "Install this app using my referral link.",
          contentMetadata: {
            customMetadata: {
              userId: user?.userid,
            },
          },
        };
  
        // Link options
        const linkData = {
          data,
          feature: "referral",
          channel: "web",
          // Optional: redirect URLs
          $fallback_url: "https://www.hybridresearchcenter.com/",
        };
  
        // Generate link
        branch.link(linkData, (err, url) => {
          if (err) {
            console.error("Branch link error:", err);
          } else {
            console.log("Generated Branch link:", url);
            setLink(url); // Set the generated link in state
          }
        });
      } catch (error) {
        console.error("Error generating Branch link:", error);
      }
    };
  
    useEffect(() => {
      generateLink();
    }, []);
  return (
    <>
      <header className="bg-[#312E81] px-2 md:px-0 fixed w-full z-50">
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
                          ? "bg-red text-white"
                          : ""
                      } py-2 hover:bg-red cursor-pointer`}
                      onClick={handleProfile}
                    >
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-red cursor-pointer">
                      Settings
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-red cursor-pointer"
                      onClick={LogOutUserFunction}
                    >
                      Logout
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
                          0.05 USD
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
    </>
  );
};

export default Header;
