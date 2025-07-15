"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
// import { ordersData } from '../../data';
import Image from "next/image";
import { RiBankCardFill } from "react-icons/ri";
import Link from "next/link";
import { FaCircleInfo } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import {
  FaCcAmex,
  FaCcDiscover,
  FaCcMastercard,
  FaCcVisa,
  FaCreditCard,
  FaRegCreditCard,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { useSelector } from "react-redux";
import { ORDERS_TYPES, PAYMENT_ERROR } from "@/constants";
import { getOrderTypeValues } from "@/config/myWebHelpers";
import {
  useGetOrderByPaymentTypeQuery,
  useGetUserCurrencyAndCountryQuery,
} from "@/redux/order/ordersApi";
import {
  calculatePaymentFees,
  getConsumableAmounts,
  getCurrency,
  getCurrencyNameFromPhone,
  getFormattedPriceWith3,
  getIntOrderConsumableAmnts,
} from "@/config/helpers";
import {
  useAddCardMutation,
  useGetAllCardsQuery,
  useGetWalletAllCardsQuery,
  useGetWalletAmountQuery,
  useInitateOrderPaymentMutation,
  useMakePaymentMutation,
  useTipToWriterPayemntMutation,
} from "@/redux/payments/paymentApi";
import toast from "react-hot-toast";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
const OrderDetail = ({ params }) => {
  const { orderId } = React.use(params); // Acc
  const orderType = ORDERS_TYPES.ALL_ORDERS;
  const user = useSelector((state) => state.auth?.user);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [amount, setAmount] = useState();
  const [islive, setIslive] = useState(false);
  const [liv, setLiv] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [summaryTab, setSummaryTab] = useState("");

  const getAllorderBody = new FormData();
  getAllorderBody.append("id", user?.userid);
  getAllorderBody.append("paymentorderstatus", getOrderTypeValues(orderType));
  const {
    data: getAllOrders = { result: { orderAll: [] } },
    isFetching: getAllOrdersLoading,
  } = useGetOrderByPaymentTypeQuery(getAllorderBody);
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

  const ordersData = getAllOrders?.result?.orderAll || [];

  const order = ordersData.find((o) => o.order_id === orderId);
  const handleCheckboxChange = () => {
    if (walletAmount?.amount > order?.balanceamount) {
      setIsChecked(!isChecked);
    }
  };

  const vatFee = (Number(amount) * 20) / 100;

  const handleProceedToPay = () => {
    setShowCheckout(true);
    setSummaryTab(true);
  };
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };
  const handleCardSelectStp = (card) =>{
    setSelectedCardId(card)
  }
  const handleTabSwitch = (tab, mode) => {
    setActiveTab(tab);
    handleCardSelect(mode);
  };
  const shared = useSelector((state) => state?.shared || {});
  const { serviceChargePercentage, vatFeePercentage } = shared;
  const serviceChargeFee = serviceChargePercentage;
  const vatChargeFee = (order?.balanceamount * 20) / 100;
  const processingFee = (order?.balanceamount * 4) / 100;
  const totalAmount = Number(amount) + processingFee + vatChargeFee; // Total amount including all feeses
  const [addCardModal, setAddCardModal] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [tipToWriterPayment, { isLoading: tipToWriterPaymentLoading }] =
    useTipToWriterPayemntMutation();

      const [makePayment, { isLoading: makePaymentLoading }] =
    useMakePaymentMutation();


    const total=order?.balanceamount
      const consumableObj = getConsumableAmounts(
    setIsChecked ? walletAmount?.amount : 0,
    setIsChecked ? walletAmount?.rewardsamount : 0,
    total
  );

  const handleViewModal = () => {
    setAddCardModal(!addCardModal);
  };

  const [createOrder, { isLoading: createOrderLoading }] =
    useInitateOrderPaymentMutation();

  const [addCard, { isLoading: addCardLoading }] = useAddCardMutation();
  const {
    data: getAllCards = { result: { result: {} } },
    isLoading: allCardsLoading,
    refetch: allCardsRefech,
  } = useGetWalletAllCardsQuery(user?.userid);


  const cardConsumableAmount = consumableObj.cardConsumableAmount;
   const acutalServiceFee = calculatePaymentFees(cardConsumableAmount);

  const handleAddCard = async (cardData) => {
    try {
      const res = await addCard({
        clientid: user?.userid,
        cardtype: cardData?.cardDetails?.brand,
        Lastfourdigit: cardData?.cardDetails?.last4,
        Stripekey: cardData?.stripeToken,
      });

      const { data: respData, error } = res;

      // Network or API error
      if (error) {
        toast.error(
          "Something went wrong while adding the card. Please try again."
        );
        return false;
      }

      // API returned an error in the response
      if (respData?.error) {
        toast.error(respData?.result?.result?.result || "Failed to add card.");
        return false;
      }

      // Success case
      toast.success(
        respData?.result?.result?.result || "Card added successfully."
      );
      return true;
    } catch (err) {
      // Fallback for unexpected exceptions
      toast.error("An unexpected error occurred.");
      console.error("Add card error:", err);
      return false;
    }
  };
  console.log("selected",order)



  // capture data as an image
  const generateSummaryImage = (data) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Set background and text styles
    ctx.fillStyle = '#ffffff'; // White background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000'; // Black text
    ctx.font = '20px Arial';

    // Draw text lines
    let y = 40;
    ctx.fillText('📋 Payment Summary', 20, y);

    y += 40;
    ctx.fillText(`Order ID: ${data.orderid}`, 20, y);

    y += 30;
    ctx.fillText(`Amount: ${data.amount} ${data.currency}`, 20, y);

    y += 30;
    ctx.fillText(`Service Charges: ${data.serviceCharges}`, 20, y);

    y += 30;
    ctx.fillText(`Reward Amount: ${data.rewardamount}`, 20, y);

    y += 30;
    ctx.fillText(`Wallet Amount: ${data.walletamount}`, 20, y);

    y += 30;
    ctx.fillText(`VAT: ${data.vat}`, 20, y);

    y += 30;
    ctx.fillText(`Additional Amount: ${data.additionalAmount}`, 20, y);

    // Convert to blob
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
};

  const handlePayment = async () => {
    try {
      // const selectedCard = selectedCardId?.id;

      const stripToken = selectedCardId?.stripekey ? selectedCardId?.stripekey : getAllCards[0]?.stripekey;

      let totalAmount = 0;

      let orderIds = [];
      let orders = [];
      orders?.forEach((order) => {
        totalAmount = totalAmount + Number(order.price);
        orderIds?.push(order?.order_id);
      });

      const formData = new FormData();
      // stripe payment form
      formData.append("token", stripToken);
      formData.append("currency", getCurrency(order?.currency));
      formData.append("amount", getFormattedPriceWith3(cardConsumableAmount));
      formData.append(
        "serviceCharges",
        getFormattedPriceWith3(acutalServiceFee)
      );
      formData.append("orderid", order?.id);
      formData.append(
        "rewardamount",
        getFormattedPriceWith3(consumableObj.rewardConsumableAmount)
      );
      formData.append(
        "walletamount",
        getFormattedPriceWith3(consumableObj.walletConsumableAmount)
      );
      formData.append("vat", getFormattedPriceWith3(actualVatFee));
      formData.append(
        "additionalAmount",
        getFormattedPriceWith3(consumableObj.additionalAmount)
      );
      const payload = {
        token: stripToken,
        currency: getCurrency(order?.currency),
        amount: getFormattedPriceWith3(cardConsumableAmount),
        serviceCharges: getFormattedPriceWith3(acutalServiceFee),
        orderid: order?.id,
        rewardamount: getFormattedPriceWith3(consumableObj.rewardConsumableAmount),
        walletamount: getFormattedPriceWith3(consumableObj.walletConsumableAmount),
        vat: getFormattedPriceWith3(actualVatFee),
        additionalAmount: getFormattedPriceWith3(consumableObj.additionalAmount),
      };

      const summaryImageBlob = await generateSummaryImage(payload);

      console.log("summaryImageBlob :",summaryImageBlob)
      return;
      if (summaryImageBlob) {
        formData.append('screenshot', summaryImageBlob, summaryImageBlob);
      }

      const res = await makePayment(formData);

      const { data: respData, error } = res || {};

      if (respData) {
          if (respData?.result == 'Successfully Paid') {
            toast.success("Successfully Paid")
          } else if (respData?.result == PAYMENT_ERROR) {
            toast.error(respData?.result || PAYMENT_ERROR)
          } else{
            toast.error(respData?.result)
          }
        }
        if (error){
          toast.error("Something Went Wrong.")
        }
    } catch (error) {}
  };

  const getCardLogo = (brand) => {
    const brandLower = brand?.toLowerCase();
    const iconSize = 24; // Adjust size as needed

    switch (brandLower) {
      case "visa":
        return <FaCcVisa size={iconSize} className="text-blue-900" />;
      case "mastercard":
        return <FaCcMastercard size={iconSize} className="text-red-600" />;
      case "amex":
        return <FaCcAmex size={iconSize} className="text-blue-500" />;
      case "discover":
        return <FaCcDiscover size={iconSize} className="text-orange-600" />;
      default:
        return <FaCreditCard size={iconSize} className="text-gray-500" />;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      toast.error("Card input is not ready yet.");
      return;
    }

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

    if (stripeError) {
      toast.error(stripeError.message);
      return;
    }

    try {
      const res = await addCard({
        clientId: user?.userid,
        cardType: paymentMethod?.card?.brand,
        Lastfourdigit: paymentMethod?.card?.last4,
        Stripekey: paymentMethod?.id,
      });

      const { data: respData, error: apiError } = res;
      console.log("res", respData);
      if (respData?.error == true) {
        toast.error(apiError?.data?.message);
        return false;
      }

      if (respData?.status == 200) {
        toast.success("Card added successfully");
        setAddCardModal(false);
        return true;
      } else {
        toast.error("Error while adding card");
        return false;
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      console.error("Card submission error:", err);
      return false;
    }
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
  if (summaryTab === "summary") {
    return (
      <div className="mt-20 !w-full relative">
        <div className="flex justify-between items-center py-2">
          <button
            onClick={() => setSummaryTab(null)}
            className="flex my-4 items-center gap-2 hover:text-[#312E81]"
          >
            <FaArrowLeftLong /> Back
          </button>
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

        <div className="grid !w-full lg:grid-cols-2 justify-items-center gap-8 items-center">
          <div className="w-full">
            <div className="border-2 p-5 rounded-xl h-64">
              <div className="flex items-center gap-2">
                <FaRegCreditCard size={40} className="text-primary" />
                <div className="">
                  <p className="text-primary">Order Summary</p>
                  <p className="text-xs">Qty: 1</p>
                </div>
              </div>
              <div className="py-2">
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">Price :</span>
                  <span className="text-primary font-bold">
                    {order.balanceamount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    Processing Fee (4%) :
                  </span>
                  <span className="text-primary font-bold">
                    {processingFee}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold line-through">
                    Vat Fee (20%) :
                  </span>
                  <span className="text-primary font-bold">
                    {walletAmount?.currency} {vatChargeFee}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    Total Payable Amount:
                  </span>
                  <span className="text-primary font-bold">
                    {walletAmount?.currency}{" "}
                    {order?.balanceamount + processingFee + vatChargeFee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="border-2 rounded-xl p-5 h-64">
              <div className="flex items-center gap-3">
                <MdPayment size={43} className="text-primary" />
                <h3 className="text-primary">Payment Method</h3>
              </div>
              <div className="">
                <div className="flex px-1 items-start pt-3 gap-2">
                  <FaWallet size={20} className="text-primary" />
                  <div className="">
                    <p className="text-sm">Wallet</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-grey">Available:</span>
                      <span className="text-xs text-grey">$0.04</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-grey">
                        Includes Reward Amount
                      </span>
                      <span className="text-xs text-grey">$0.05 & </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-grey">Wallet Amount</span>
                      <span className="text-xs text-grey">$0.00</span>
                    </div>
                  </div>
                </div>

                <div className="flex bg-amber-50 rounded-xl px-1 items-start mt-2 gap-2">
                  <FaCircleInfo size={30} className="text-primary" />
                  <div className="">
                    <p className="text-sm font-bold">Payment Info Message</p>
                    <p className="text-xs text-grey px-2">
                      Looks like this order is higher than your wallet credit.
                      We will charge the remaing amount to your payment method
                      below.
                    </p>
                  </div>
                </div>

                <div className="flex px-1 items-start mt-2 gap-2">
                  <RiBankCardFill size={20} className="text-primary" />
                  <div className="">
                    <p className="text-sm font-bold">Payment Info Message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-3">
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

          {getAllCards && getAllCards?.length > 0 && (
            <div className="md:col-span-12 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Select Payment Method
              </h3>
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
                      onClick={() => handleCardSelectStp(card)}
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
                            <span key={i} className="text-xl">
                              •
                            </span>
                          ))}
                          <span className="text-lg font-medium text-gray-800">
                            {card?.fourdigit}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <span className="block text-xs text-gray-400">
                            Expires
                          </span>
                          {card.exp_month}/{card.exp_year}
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-blue-500 text-white rounded-full p-1">
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
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="w-full py-2 text-center">
            <button
              onClick={handlePayment} disabled={selectedCardId ? false : true}
              className="px-12 py-2 md:me-24 rounded-lg bg-primary text-white"
            >
              Pay {walletAmount?.currency}{" "}
              {order?.balanceamount + processingFee + vatChargeFee}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // useEffect(() => {
  //   if(getAllOrders?.result?.orderAll){
  //     setOrdersData(getAllOrders?.result?.orderAll)
  //   }
  // }, [getAllOrders])

  return (
    <>
      {/* Display Checkout Page if showCheckout is true */}
      {showCheckout ? (
        <div className="mt-20">
          <button
            onClick={() => setShowCheckout(false)}
            className="flex my-4 items-center gap-2 hover:text-[#312E81]"
          >
            <FaArrowLeftLong /> Back
          </button>
          <div className="container">
            <h2>Select Payment Method</h2>
            <div className="grid md:grid-cols-3 gap-4 py-12">
              {/* Display Selected Card Info */}
              {selectedCard ? (
                <div className="w-full md:col-span-12">
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="w-full md:col-span-6 border-2 p-4 rounded-lg">
                      <div
                        className="flex justify-between items-center"
                        onClick={() => handleTabSwitch("Full", "wallet")}
                      >
                        <div className="flex items-center gap-3">
                          <p>Full Payment</p>
                          <span className="text-xs text-grey">
                            (Pay Full amount)
                          </span>
                        </div>

                        <div className="">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="wallet"
                              checked={selectedCard === "wallet"}
                              onChange={() => handleCardSelect("wallet")}
                              className="h-4 w-4"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div
                      className="w-full md:col-span-6 border-2 p-4 rounded-lg flex justify-between items-center"
                      onClick={() => handleTabSwitch("Partial", "partial")}
                    >
                      <div className="flex items-center gap-3">
                        <p>partial Payment</p>
                        <span className="text-xs text-grey">
                          (Enter amount you want to pay)
                        </span>
                      </div>

                      <div className="">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="partial"
                            checked={selectedCard === "partial"}
                            onChange={() => handleCardSelect("partial")}
                            className="h-4 w-4"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-12 justify-center items-center mt-12">
                    {activeTab === "Full" && (
                      <div className="w-full md:col-span-6 flex flex-col gap-4">
                        <div className="border-2 rounded-xl p-5">
                          <h1>Order Summary</h1>
                          <div className="flex gap-6 mt-5 items-center">
                            <p className="text-sm text-grey">Price :</p>
                            <p className="text-grey">
                              {walletAmount?.currency} {order?.balanceamount}
                            </p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">
                              Processing Fee (4%) :
                            </p>
                            <p className="text-grey">$0.04</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">VAT (20%) :</p>
                            <p className="text-grey">$ {vatChargeFee}</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">Payment Method:</p>
                            <p className="text-grey">Payment Gateway</p>
                          </div>
                          <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                            <p className="text-primary">Payable Amount:</p>
                            <p className="text-primary">
                              {walletAmount?.currency}{" "}
                              {order?.balanceamount +
                                processingFee +
                                vatChargeFee}
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="text-white px-6 py-2 rounded-lg bg-primary"
                            onClick={() => setSummaryTab("summary")}
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "Partial" && (
                      <div className="w-full md:col-span-6">
                        <div className="">
                          <input
                            type="number"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border w-full py-2 px-4 my-2 rounded-md outline-none"
                          />
                          <div className="border-2 rounded-xl p-5">
                            <h1>Order Summary</h1>
                            <div className="flex gap-6 mt-5 items-center">
                              <p className="text-sm text-grey">Price :</p>
                              <p className="text-grey">
                                {order?.balanceamount}
                              </p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">
                                Processing Fee (4%) :
                              </p>
                              <p className="text-grey">
                                {walletAmount?.currency} {processingFee}
                              </p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">VAT (20%) :</p>
                              <p className="text-grey">
                                {walletAmount?.currency} {vatChargeFee}
                              </p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">
                                Payment Method:
                              </p>
                              <p className="text-grey">Payment Gateway</p>
                            </div>
                            <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                              <p className="text-primary">Payable Amount:</p>
                              <p className="text-primary">
                                {walletAmount?.currency}{" "}
                                {order?.balanceamount +
                                  processingFee +
                                  vatChargeFee}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center py-4">
                          {/* <button type='button' className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab(true)}>Pay Now</button> */}
                          <button
                            type="button"
                            className="text-white px-6 py-2 rounded-lg bg-primary"
                            onClick={() => setSummaryTab("summary")}
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "Payment" && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <p>Payment</p>
                          <span className="text-xs text-grey">
                            (Make Partial Payment)
                          </span>
                        </div>

                        <div>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="wallet"
                              checked={selectedCard === "wallet"}
                              onChange={() => handleCardSelect("wallet")}
                              className="h-4 w-4"
                            />
                            <span className="text-grey">Wallet</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full">
                    <p className="text-sm text-grey py-2">
                      Recommended Method(s)
                    </p>

                    <div
                      className={`flex justify-between border-2 h-48 rounded-xl p-5 ${
                        selectedCard === "wallet" ? "border-blue-500" : ""
                      }`}
                      // onClick={() => handleCardSelect("wallet")}
                    >
                      <div>
                        <div className="flex gap-2 items-center">
                          <FaWallet size={30} className="text-primary" />
                          <p className="p1 text-grey">Wallet</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green">Available:</span>
                          <span className="text-green">
                            {order?.totalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Reward Amount:
                          </span>
                          <span className="text-sm text-gray-600">
                            ${" "}
                            {walletAmount?.rewardsamount
                              ? Number(walletAmount?.rewardsamount).toFixed(2)
                              : "2.3"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Wallet Amount:
                          </span>
                          <span className="text-sm text-gray-600">
                            ${" "}
                            {walletAmount?.amount
                              ? Number(walletAmount?.amount).toFixed(2)
                              : "0:00"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center cursor-pointer relative">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="opacity-0 absolute" // Hides the default checkbox
                          />
                          <span
                            className={`w-12 h-6 bg-gray-300 rounded-full relative transition-all duration-300 
                                      ${isChecked ? "bg-primary" : ""}`}
                          >
                            <span
                              className={`w-6 h-6 bg-white rounded-full absolute top-0 left-0 transition-all duration-300 
                                        ${isChecked ? "translate-x-6" : ""}`}
                            ></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="md:py-8 w-full">
                    <div
                      className={`md:py-8 w-full border-2 h-48 rounded-xl px-5 py-3 ${
                        selectedCard === "bank" ? "border-blue-500" : ""
                      }`}
                      onClick={() => handleCardSelect("bank")}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MdPayments size={38} className="text-primary" />
                          <p className="p1 text-grey">Bank Transfer</p>
                        </div>
                        <div>
                          <FaCircleInfo size={30} className="text-primary " />
                        </div>
                      </div>
                      <div className="ps-4">
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">Price:</span>
                          <span className="text-grey text-sm">
                            {order?.balanceamount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">
                            Processing fee (4%):
                          </span>
                          <span className="text-grey text-sm">
                            $ {processingFee}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm line-through">
                            VAT (20%):
                          </span>
                          <span className="text-grey text-sm">$0.40</span>
                        </div>
                        <div className="text-end mt-3">
                          <span className="text-lg text-primary">
                            Total : {order.balanceamount + processingFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:py-8 w-full">
                    <div
                      className={`md:py-8 w-full border-2 h-48 rounded-xl px-5 py-3 ${
                        selectedCard === "stripe" ? "border-blue-500" : ""
                      }`}
                      onClick={() => handleCardSelect("stripe")}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            width="35"
                            height="35"
                          >
                            <circle cx="50" cy="50" r="45" fill="#312E81" />
                            <text
                              x="50"
                              y="55"
                              fontFamily="Arial"
                              fontSize="20"
                              fill="white"
                              textAnchor="middle"
                            >
                              STRIPE
                            </text>
                            <text
                              x="50"
                              y="55"
                              fontFamily="Arial"
                              fontSize="20"
                              fill="white"
                              textAnchor="middle"
                            >
                              STRIPE
                            </text>
                          </svg>
                          <p className="p1 text-grey">Payment Gateway</p>
                        </div>
                        <div>
                          <FaCircleInfo size={30} className="text-primary " />
                        </div>
                      </div>
                      <div className="ps-4">
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">Price:</span>
                          <span className="text-grey text-sm">
                            {walletAmount?.currency} {order?.balanceamount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">
                            Processing fee (4%):
                          </span>
                          <span className="text-grey text-sm">
                            {walletAmount?.currency} {processingFee}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">VAT (20%):</span>
                          <span className="text-grey text-sm">
                            {walletAmount?.currency} {vatChargeFee}
                          </span>
                        </div>
                        <div className="text-end mt-3">
                          <span className="text-lg text-primary">
                            Total : {walletAmount?.currency}{" "}
                            {order?.balanceamount +
                              processingFee +
                              vatChargeFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <section className="mt-20">
          <div className="container mx-auto md:px-6 pb-10">
            <div>
              <motion.div
                className="md:w-full md:col-span-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div
                  className={`bg-no-repeat bg-center md:w-full bg-cover flex justify-center items-center rounded-tl-2xl ${
                    order?.payment_status === 0 ? "min-h-32 px-4" : ""
                  } rounded-tr-2xl`}
                  style={{
                    height: `${order?.payment_status === 0 ? "300px" : ""}`,
                    backgroundImage: `url(${
                      order?.payment_status === 1
                        ? "/orders/banner.svg"
                        : order?.payment_status === 2
                        ? "/orders/yellobanner.svg"
                        : "/orders/red.svg"
                    })`,
                  }}
                >
                  <div className="grid w-full px-8 md:grid-cols-12 justify-between items-center">
                    {order?.payment_status === 1 ||
                    order?.payment_status === 2 ? (
                      <>
                        <motion.div
                          className="w-full md:col-span-6 mt-5 md:mt-0"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <h2>Completed</h2>
                          <p className="fs-25">
                            Your Order has been Completed!
                          </p>
                        </motion.div>
                        <motion.div
                          className="w-full md:col-span-6 flex justify-end"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          <div className="relative size-36 md:size-60">
                            <svg
                              className="size-full -rotate-90"
                              viewBox="0 0 42 42"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="21"
                                cy="21"
                                r="13"
                                fill="none"
                                className="stroke-current text-grey dark:text-neutral-700"
                                strokeWidth="2.7"
                              ></circle>
                              <circle
                                cx="21"
                                cy="21"
                                r="13"
                                fill="none"
                                className={`stroke-current ${
                                  order?.payment_status === 1
                                    ? "text-[#3BB537]"
                                    : order?.payment_status === 2
                                    ? "text-yellow"
                                    : order?.payment_status === 0
                                    ? "text-grey"
                                    : ""
                                } dark:text-blue-500`}
                                strokeWidth="2.7"
                                strokeDasharray="100"
                                strokeDashoffset={order?.remaining}
                                strokeLinecap="round"
                              ></circle>
                            </svg>
                            <div
                              className={`absolute top-1/2 ${
                                order?.payment_status === 2
                                  ? "!right-16"
                                  : "!right-14"
                              } md:right-10 transform -translate-y-1/2 -translate-x-1/2`}
                            >
                              <span className="text-center text-2xl font-bold text-black dark:text-blue-500">
                                {order?.payment_status === 2
                                  ? 50
                                  : order?.payment_status === 1
                                  ? 100
                                  : 0}
                                %
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <motion.p
                        className="w-full md:col-span-12 flex gap-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <span>Note:</span> Please complete the payment to
                        proceed with your order. Work on your order will only
                        begin once the payment is confirmed.
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Order Details Section */}
                <motion.div
                  className="flex wrap px-3 justify-between items-start py-3 mt-9"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <div className="flex p3 items-center gap-3">
                    <span className="font-bold">Order ID:</span>{" "}
                    <span className="font-semibold">{order?.order_id}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex p3 items-center gap-3">
                      <span>Order placed:</span>{" "}
                      <span>{order?.order_place_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="p2">Deadline:</span>
                      <span className="p3">{order?.order_deadline}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex justify-center items-center mt-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <div className="flex wrap gap-3 items-center">
                    {order?.payment_status === 1 ? (
                      <button className="btnText mx-2 text-white bg-primary flex justify-center items-center gap-3 rounded-md w-219 w-[219] h-[40]">
                        <Image
                          src={"/orders/meeting.svg"}
                          width={13}
                          height={16}
                          alt=""
                        />
                        Schedule Meeting
                      </button>
                    ) : (
                      <button
                        onClick={handleProceedToPay}
                        className="btnText text-white flex justify-center items-center bg-primary rounded-md w-[219] w-219 h-[40]"
                      >
                        Proceed to Pay
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default OrderDetail;
