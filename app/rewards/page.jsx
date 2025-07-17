"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { FaFacebookSquare, FaTwitterSquare, FaWhatsapp } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useGetUserCurrencyAndCountryQuery } from "@/redux/order/ordersApi";
import { useGetWalletAmountQuery } from "@/redux/payments/paymentApi";
import { getCurrency, getCurrencyNameFromPhone } from "@/config/helpers";
import {
  useGetRewardAmountsQuery,
  useGetRewardPointsQuery,
  useGetRewardsHistoryQuery,
} from "@/redux/rewards/rewardsApi";
import { appNameCode } from "@/config";
import { APP_NAME_CODES, APP_NAMES } from "@/config/constants";

import branch from "branch-sdk";
const Page = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rewardsHistory, setRewardsHistory] = useState([]);

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

  const {
    data: rewardPoints,
    isLoading: rewardPointsLoading,
    refetch: rewardPointsRefech,
  } = useGetRewardPointsQuery(user?.userid);

  const totalRewardAmounts = rewardPoints?.result?.totalrewardamount;
  const rewardAmountCurrency =
    totalRewardAmounts == 0
      ? getCurrency(userDataCurrencies?.result?.currency)
        ? getCurrency(userDataCurrencies?.result?.currency)
        : getCurrency(getCurrencyNameFromPhone(user?.user_contact_no))
      : getCurrency(userDataCurrencies?.result?.currency)
      ? getCurrency(userDataCurrencies?.result?.currency)
      : rewardPoints?.result?.currency;

  const {
    data: getRewardsHistory,
    isLoading: rewardsHistoryLoading,
    refetch: rewardsHistoryRefech,
  } = useGetRewardsHistoryQuery(user?.userid);
  const { data: rewardAmounts } = useGetRewardAmountsQuery();

  const handleInviteClick = () => {
    setShowInviteForm(!showInviteForm);
  };

  const [link, setLink] = useState("");
  const brachUrl = process.env.NEXT_PUBLIC_BRANCH_TEST_KEY;



  console.log("brachUrl",brachUrl)
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

  useEffect(() => {
    if (getRewardsHistory) {
      setRewardsHistory(getRewardsHistory);
    }
  }, [getRewardsHistory]);

  const invitationMsg = `I highly recommend the ${
    APP_NAMES.HYBRID_RESEARCH_CENTER
  } for research, thesis, and assignments - it's easy to use and more affordable than other platforms! If you're interested in trying it out, you can sign up using the link below and receive an amount of ${
    rewardAmounts?.result?.referbyamount ?? "5"
  } free credit in your native currency after placing your first order.`;

  // console.log("link", link);
  const shareWithFacebook = () => {
    try {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}&quote=${encodeURIComponent(invitationMsg)}`;
      window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error sharing to Facebook:", error);
    }
  };

  const shareWithWhatsapp = () => {
    try {
      const message = `${invitationMsg}\n\n${link}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
    }
  };
  const shareWithInstagram = () => {
    try {
      const text = `${invitationMsg}\n\n${link}`;
      navigator.clipboard.writeText(text);
      // alert('Invitation copied to clipboard! Open Instagram and paste it in your story or post.');
      // Optionally open Instagram in a new tab:
      window.open("https://www.instagram.com/", "_blank");
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
    }
  };

  const shareWithX = () => {
    try {
      const tweetText = `${invitationMsg}\n\n${link}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`;
      window.open(twitterUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error sharing to X/Twitter:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${invitationMsg}\n\n${link}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="py-12 bg-gray-50 min-h-screen mt-12">
      <div className="md:max-w-6xl mx-auto md:px-4 lg:px-8">
        {!showInviteForm ? (
          <div className="mb-8">
            <h1 className="text-4xl ps-4 font-bold text-gray-900 mb-2">
              Your Rewards
            </h1>
            <div className="bg-white rounded-xl shadow-lg px-1 py-4 md:p-6 mb-8">
              <div className="flex flex-wrap flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="md:text-2xl font-semibold text-gray-800">
                    Invite Friends, Earn Credits
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Share your referral link and earn rewards for every friend
                    who joins
                  </p>
                  <div className="mt-4 flex items-center">
                    <span className="text-lg font-medium text-gray-700">
                      Total Earned:
                    </span>
                    <span className="ml-2 text-2xl font-bold text-primary">
                      {Number(totalRewardAmounts).toFixed(2)} USD
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleInviteClick}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Invite Friends
                </button>
              </div>
            </div>

            {/* Rewards History */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Reward History
                </h3>
              </div>
              <div className="overflow-x-auto h-[400px]">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rewardsHistory?.map((reward, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {reward?.addedts}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {reward?.descriptionof}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                          {reward?.refferpoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rewardsHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No rewards earned yet</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Invite Friends Section */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              onClick={handleInviteClick}
              className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
            >
              <ChevronRightIcon className="w-5 h-5 transform rotate-180" />
              <span className="ml-2">Back to Rewards</span>
            </button>

            <div className="text-center mb-8">
              <Image
                src="/invite.png"
                width={240}
                height={160}
                alt="Invite friends"
                className="mx-auto"
              />
              <h2 className="text-3xl font-bold text-gray-900 mt-6">
                Invite Friends & Earn ₹10
              </h2>
              <p className="text-gray-600 mt-2">
                Share your unique link with friends
              </p>
            </div>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex gap-2 md:flex-1 flex-wrap md:relative">
                  <input
                    type="text"
                    value={link}
                    readOnly
                    className="w-full pr-16 border border-gray-300 rounded-lg py-3 px-4"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="md:absolute right-2 top-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-2 md:space-x-4">
                <button
                  onClick={shareWithWhatsapp}
                  // href="https://api.whatsapp.com/send?text=https://hybridresearchcenter.app.link/u0Ck3qhUNOb"
                  target="_blank"
                  className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                >
                  <FaWhatsapp className="w-8 h-8 text-green-600" />
                </button>
                <button
                  onClick={shareWithInstagram}
                  // href="https://www.instagram.com/sharer.php?u=https://hybridresearchcenter.app.link/u0Ck3qhUNOb"
                  target="_blank"
                  className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
                >
                  <AiFillInstagram className="w-8 h-8 text-pink-600" />
                </button>
                <button
                  onClick={shareWithFacebook}
                  // href="https://www.facebook.com/sharer/sharer.php?u=https://hybridresearchcenter.app.link/u0Ck3qhUNOb"
                  target="_blank"
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <FaFacebookSquare className="w-8 h-8 text-blue-600" />
                </button>
                <button
                  onClick={shareWithX}
                  // href="https://twitter.com/intent/tweet?url=https://hybridresearchcenter.app.link/u0Ck3qhUNOb"
                  target="_blank"
                  className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 transition-colors"
                >
                  <FaTwitterSquare className="w-8 h-8 text-sky-600" />
                </button>
              </div>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">How it works</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckIcon className="w-6 h-6 text-green-600 mt-1 mr-3" />
                    <p>
                      Your friend gets $5 credit when they sign up using your
                      link and place their first order
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckIcon className="w-6 h-6 text-green-600 mt-1 mr-3" />
                    <p>
                      You get ₹10 credit when they complete their first order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
