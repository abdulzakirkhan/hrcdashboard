"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdPayment } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcVisa, FaCreditCard, FaInfoCircle } from "react-icons/fa";
import { useGetUserCurrencyAndCountryQuery } from "@/redux/order/ordersApi";
import { useSelector } from "react-redux";
import { getCurrency, getCurrencyFromCode, getCurrencyNameFromPhone, getCurrencySymbol } from "@/config/helpers";
import {
  useAddWalletCardMutation,
  useGetWalletAllCardsQuery,
  useGetWalletAmountQuery,
  useMakeWalletPaymentMutation,
} from "@/redux/payments/paymentApi";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import toast, { Toaster } from "react-hot-toast";
// import {
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
const page = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentGateway, setIsPaymentGateway] = useState(false);
  const [addCardModal, setAddCardModal] = useState(false);
  const [amount, setAmount] = useState(0);
  // Function to open the modal
  const openModal = () => setIsModalOpen(!isModalOpen);

  const [isBank, setisBank] = useState(false);
  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);
  const handleIsPayment = () => {
    setIsPaymentGateway(!isPaymentGateway);
  };
  const handleViewModal = () => {
    setAddCardModal(!addCardModal);
  };

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






  const stripe = useStripe();
  const elements = useElements();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const {
    data: getAllCards = { result: { result: {} } },
    isLoading: allCardsLoading,
    refetch: allCardsRefech,
  } = useGetWalletAllCardsQuery(user?.userid);
  const [addCard, { isLoading: addCardLoading }] = useAddWalletCardMutation();
  const [makePayment, { isLoading: makePaymentLoading }] =
    useMakeWalletPaymentMutation();
  const allCards = Array.isArray(getAllCards) ? getAllCards : [];

  const [amountBank, setAmountBank] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const currency =
    userDataCurrencies?.result?.currency ??
    getCurrencyNameFromPhone(user?.user_contact_no);
  // Function to handle the button click and update the input
  const handleButtonClick = (value) => {
    setAmount(value); // Update input field with the selected value
    setSelectedAmount(value); // Save the selected amount
  };

  // Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  const cardNumberElement = elements.getElement(CardNumberElement);

  if (!cardNumberElement) {
    toast.error("Card input is not ready yet.");
    return;
  }

  const { token, error } = await stripe.createToken(cardNumberElement);

  if (error) {
    toast.error(error.message);
    return;
  }

  if (!token) {
    toast.error("Failed to create token.");
    return;
  }

  const res = await addCard({
    clientId: user?.userid,
    cardType: token?.card?.brand,
    Lastfourdigit: token?.card?.last4,
    Stripekey: token?.id, // 🔑 This is the token you'll store
  });

  const { data: respData, error: mutationError } = res;

  if (respData?.result === "Client Card Detail Added Successfully") {
    toast.success("Card added successfully");
    setAddCardModal(false);
    return true;
  }

  if (mutationError) {
    toast.error(mutationError?.data?.message || "Error while adding card");
    return false;
  } else {
    toast.error(respData?.result || "Error while adding card");
  }
};






   useEffect(() => {
    if (getAllCards?.length > 0) {
      setSelectedCardId(getAllCards[0]); // Select first card by default
    }
  }, [getAllCards]);

  const handleCardSelect = (cardId) => {
    setSelectedCardId(cardId);
  };


  const stripeInputStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };


  const getCardLogo = (brand) => {
    const brandLower = brand?.toLowerCase();
  const iconSize = 24; // Adjust size as needed

    switch (brandLower) {
      case 'visa':
        return <FaCcVisa size={iconSize} className="text-blue-900" />;
      case 'mastercard':
        return <FaCcMastercard size={iconSize} className="text-red-600" />;
      case 'amex':
        return <FaCcAmex size={iconSize} className="text-blue-500" />;
      case 'discover':
        return <FaCcDiscover size={iconSize} className="text-orange-600" />;
      default:
        return <FaCreditCard size={iconSize} className="text-gray-500" />;
    }
  };



  const handleTopUp = async () => {
    try {


      const stripToken = selectedCardId?.stripekey || getAllCards[0]?.stripekey;
    
      const payload = {
          currency: getCurrency(currency),
          amount: amount,
          userId: user?.userid,
          token: stripToken,
          viafrom: 'stripe',
      }

      const res = await makePayment(payload);

      const { data: respData, error } = res || {};

      if (respData) {
        if (respData?.result == 'Successfully Added Into Wallet') {
          toast.success(respData?.result || "Successfully Added Into Wallet");
          setAmount(0)
        }else{
          toast.error(respData?.result || "Error while topping up wallet");
        }
      }
    } catch (error) {
      toast.error("Error while topping up wallet");
    }
  }

  const currencySymbol = getCurrencySymbol(getCurrencyFromCode(walletAmount?.currency));

  // console.log("currencySymbol",currencySymbol);

 
  return (
    <>
      <section className="mt-20">
        {isPaymentGateway ? (
          <div className="container relative mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl">
            {/* Back Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition"
              onClick={handleIsPayment}
            >
              ⬅ Back
            </button>

            {/* Available Credit Section */}
            <div className="bg-gray-100 p-5 rounded-lg flex justify-between items-center mt-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-700">
                  Available Credit
                </h1>
                <p className="text-sm text-gray-500">
                  Includes Reward Amount:{" "}
                  <span className="text-green-600 font-medium">
                    <span className="font-bold">
                      {" "}
                      {currencySymbol}{" "}
                    </span>
                    {walletAmount?.rewardsamount}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  & Wallet Amount:{" "}
                  <span className="text-green-600 font-medium">
                    {" "}
                    {currencySymbol}{" "}
                    {walletAmount?.amount
                      ? Number(walletAmount.amount).toFixed(2)
                      : "0.00"}
                  </span>
                </p>
              </div>
              <h1 className="text-2xl font-bold text-blue-600">
                {currencySymbol}{" "}
                {walletAmount?.rewardsamountpluswalletamount
                  ? Number(walletAmount.rewardsamountpluswalletamount).toFixed(
                      2
                    )
                  : "0.00"}
              </h1>
            </div>

            {/* Form Section */}
            <div className="grid md:grid-cols-12 gap-6 py-8">
              {/* Top-Up Input */}
              <div className="md:col-span-12 space-y-2">
                <label htmlFor="topup" className="text-gray-700 font-medium">
                  Top-Up Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="topup"
                    placeholder="300"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              {/* stripe old cards */}


              {getAllCards && getAllCards?.length > 0 && (
                <div className="md:col-span-12 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Select Payment Method</h3>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {getAllCards?.map((card) => {
                      const isSelected = selectedCardId?.id === card?.id;
                      const cardLogo = getCardLogo(card.brand); // You would need to implement this function
                      
                      return (
                        <div
                          key={card.id}
                          className={`relative bg-white rounded-xl p-5 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                            isSelected 
                              ? "border-2 border-blue-500 ring-4 ring-blue-100 bg-blue-50" 
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleCardSelect(card)}
                        >
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-4">
                            <span className="font-medium text-xs uppercase tracking-wide text-gray-500">
                              {card?.cardtype}
                            </span>
                            {cardLogo}
                          </div>
                          
                          {/* Card Number */}
                          <div className="mb-5">
                            <div className="flex items-center space-x-2">
                              {[...Array(3)].map((_, i) => (
                                <span key={i} className="text-xl">•</span>
                              ))}
                              <span className="text-lg font-medium text-gray-800">
                                {card?.fourdigit}
                              </span>
                            </div>
                          </div>
                          
                          {/* Card Footer */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <span className="block text-xs text-gray-400">Expires</span>
                              {card.exp_month}/{card.exp_year}
                            </div>
                            
                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <div className="bg-blue-500 text-white rounded-full p-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="md:col-span-12">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 border-b pb-2">
                    <MdPayment className="text-blue-600" size={30} />
                    <p className="text-blue-600 font-semibold">
                      Payment Method
                    </p>
                  </div>
                  <div
                    onClick={handleViewModal}
                    className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition"
                  >
                    <div className="rounded-full border border-blue-600 w-7 h-7 text-blue-600 flex justify-center items-center font-bold">
                      +
                    </div>
                    <span className="text-gray-700 font-medium">
                      Add New Debit Card
                    </span>
                  </div>
                </div>
              </div>

              {/* Top-Up Confirmation */}
              <div className="md:col-span-12 flex justify-between items-center bg-blue-50 p-4 rounded-lg shadow">
                <p className="text-gray-700 font-medium">
                  Top-Up Amount:{" "}
                  <span className="text-blue-600 font-bold">${amount}</span>
                </p>
                <button onClick={handleTopUp} className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                  Confirm Top-Up
                </button>
              </div>
            </div>
            {addCardModal && (
              <>
                <div className="w-full h-full fixed inset-0 bg-black opacity-30" />
                <div className="absolute !top-12 left-1/2 transform -translate-x-1/2 shadow-xl rounded-md backdrop-blur-md bg-white p-6 w-96 md:max-w-screen-md">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Add New Card
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 w-full max-w-md mx-auto"
                  >
                    {/* Card Number */}
                    <label className="block text-sm font-medium">
                      Card Number
                    </label>
                    <div className="border p-2 rounded-md">
                      <CardNumberElement options={stripeInputStyle} />
                    </div>

                    {/* Expiry Date */}
                    <label className="block text-sm font-medium">Expiry</label>
                    <div className="border p-2 rounded-md">
                      <CardExpiryElement options={stripeInputStyle} />
                    </div>

                    {/* CVC */}
                    <label className="block text-sm font-medium">CVC</label>
                    <div className="border p-2 rounded-md">
                      <CardCvcElement options={stripeInputStyle} />
                    </div>

                    <button
                      type="submit"
                      className="bg-primary text-white w-full py-2 rounded-md mt-4"
                      disabled={!stripe}
                    >
                      Add Card
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        ) : isBank ? (
          <section>
            <button
              className="flex items-center gap-2 hover:text-primary"
              onClick={() => setIsBank(false)}
            >
              {" "}
              <FaArrowLeftLong /> Back
            </button>
            <div className="container py-8 mx-auto px-6 flex flex-col justify-center items-center">
              {/* Heading with fade-in animation */}
              <motion.h1
                className="w-1/2 py-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                Bank Transfer
              </motion.h1>

              <div className="grid grid-cols-1 md:w-1/2">
                <div className="w-full md:col-span-12">
                  <div className="flex w-full justify-center space-y-3 items-center space-x-4 md:space-x-12 mb-4">
                    {/* Buttons with fade-in and scale-up animation on click */}
                    <motion.button
                      onClick={() => handleButtonClick("100")}
                      className="bg-primary text-white px-6 mt-2 md:mt-2 md:ms-0 py-3 rounded-lg hover:bg-purple-950"
                      whileTap={{ scale: 0.95 }} // Scale effect when clicked
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      $100
                    </motion.button>

                    <motion.button
                      onClick={() => handleButtonClick("200")}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-950"
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      $200
                    </motion.button>

                    <motion.button
                      onClick={() => handleButtonClick("300")}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-950"
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      $300
                    </motion.button>
                  </div>

                  {/* Input field with fade-in animation */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <label
                      htmlFor="amountBank"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Top up Amount:
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={amountBank}
                      onChange={(e) => setAmountBank(e.target.value)} // Allows manual input
                      className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter custom amount"
                    />
                  </motion.div>

                  {/* Display the selected amount with fade-in */}
                  {selectedAmount && (
                    <motion.p
                      className="text-xl font-medium mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7 }}
                    >
                      You selected: <b>${selectedAmount}</b>
                    </motion.p>
                  )}

                  {/* Submit Button with bounce effect on hover */}
                  <motion.button
                    onClick={handleSubmit}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600"
                    whileHover={{ scale: 1.05 }} // Slight bounce on hover
                    transition={{ duration: 0.2 }}
                  >
                    Submit Top-Up Payment
                  </motion.button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="container mx-auto px-6 mt-8">
            <div className="grid md:grid-cols-12">
              <div className="w-full md:col-span-12">
                <div className="flex justify-end">
                  <button
                    onClick={openModal}
                    className="btnText bg-primary px-6 py-3 text-white rounded-lg"
                  >
                    Top-Up Wallet
                  </button>
                </div>
              </div>
              <div className="w-full md:col-span-12">
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <motion.div
                      className="bg-white px-8 rounded-lg shadow-xl w-full max-w-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Modal Content */}
                      <div className="flex justify-center items-center mb-4 py-2 relative">
                        <button
                          onClick={closeModal}
                          className="text-gray-500 absolute top-0 right-0 "
                        >
                          <span className="text-4xl">×</span>
                        </button>
                        <h2 className="text-xl font-semibold text-center">
                          Top-Up Wallet
                        </h2>
                      </div>
                      <div className="text-center p-3 flex flex-col justify-center items-center">
                        <h3>How do you want to top up your wallet?</h3>
                        <div className="flex justify-between items-center py-3 gap-3">
                          <Link
                            href={"/bank-transfer"}
                            className="bg-primary text-white px-3 py-2 rounded-lg"
                          >
                            With Bank Transfer
                          </Link>
                          <button
                            onClick={() => setIsPaymentGateway(true)}
                            className="bg-primary text-white px-3 py-2 rounded-lg"
                          >
                            With Payment Gateway
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-12 gap-6 mt-10">
              <div className="w-full md:col-span-6">
                <div className="p-6 h-full border-2 rounded-2xl shadow-xl">
                  <h1>Available Credit</h1>
                  <p className="py-2">
                    Rewards Amount:{" "}
                    <span className="font-bold">{currencySymbol}</span>{" "}
                    {walletAmount?.rewardsamount
                      ? Number(walletAmount.rewardsamount).toFixed(2)
                      : "0.00"}
                  </p>
                  <p className="py-2">
                    Wallet Amount:{" "}
                    <span className="font-bold">{currencySymbol}</span>{" "}
                    {walletAmount?.amount
                      ? Number(walletAmount.amount).toFixed(2)
                      : "0.00"}
                  </p>
                  <p>
                    Total Credit (Rewards + Wallet):{" "}
                    <span className="font-bold">{currencySymbol}</span>{" "}
                    {walletAmount?.rewardsamountpluswalletamount
                      ? Number(
                          walletAmount.rewardsamountpluswalletamount
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
              <div className="w-full md:col-span-6">
                <div className="p-6 h-full bg-[#d4d3e4] md:h-[240] flex justify-center items-center rounded-2xl shadow-xl">
                  <div className="flex gap-3 items-start">
                    <FaInfoCircle
                      className="-mt-2"
                      style={{ fontSize: "45px" }}
                    />
                    <p className="m-0 text-md">
                      {" "}
                      With Bank Transfer Pay,You Will Receive The Wallet amount
                      after a 4% deduction as a services fee, while with Payment
                      Gateway, you will receive the wallet amount after a 24%
                      deduction ,which includes a 4% service s fee and s 20%
                      VAT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* show react-hot-toast */}
      <Toaster
        position="top-right" // Position of the toast notifications
        reverseOrder={false} // Order of the toasts (from newest to oldest) 
        />
    </>
  );
};

export default page;
