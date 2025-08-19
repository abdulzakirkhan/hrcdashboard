
"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useMemo, useState } from "react";
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
  calculatePaymentVatFees,
  getConsumableAmounts,
  getCurrency,
  getCurrencyFromCode,
  getCurrencyNameFromPhone,
  getCurrencySymbol,
  getFormattedPriceWith3,
  getIntOrderConsumableAmnts,
} from "@/config/helpers";
import {
  useAddCardMutation,
  useGetAllCardsQuery,
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
import { useRouter } from "next/navigation";

// Small helpers
const toNum = (v) => Number(v || 0);
const fmt3 = (v) => (isNaN(v) ? "0.000" : Number(v).toFixed(3));

const OrderDetail = ({ params }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { orderId } = React.use(params) || {}; // ✅ Correctly read URL param

  // Redux state
  const user = useSelector((state) => state.auth?.user);
  const shared = useSelector((state) => state?.shared || {});

  // UI state
  const [useWallet, setUseWallet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'bank' | 'gateway'
  const [payMode, setPayMode] = useState("full"); // 'full' | 'partial'
  const [partialAmount, setPartialAmount] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [summaryTab, setSummaryTab] = useState(""); // '' | 'summary'
  const [addCardModal, setAddCardModal] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);

  // Queries: orders list for the user
  const getAllorderBody = new FormData();
  getAllorderBody.append("id", user?.userid);
  getAllorderBody.append("paymentorderstatus", getOrderTypeValues(ORDERS_TYPES.ALL_ORDERS));
  const { data: getAllOrders = { result: { orderAll: [] } } } = useGetOrderByPaymentTypeQuery(getAllorderBody);

  // Currency info
  const currencyFormData = new FormData();
  currencyFormData.append("clientid", user?.userid);
  const { data: userDataCurrencies } = useGetUserCurrencyAndCountryQuery(currencyFormData);

  // Wallet
  const { data: walletAmount } = useGetWalletAmountQuery({
    clientId: user?.userid,
    currency: getCurrency(getCurrencyNameFromPhone(user?.user_contact_no)),
    nativecurrency: userDataCurrencies?.result?.currency
      ? getCurrency(userDataCurrencies?.result?.currency)
      : getCurrency(getCurrencyNameFromPhone(user?.user_contact_no)),
  });

  // Saved cards
  const { data: allCardsRaw = [] } = useGetAllCardsQuery(user?.userid);
  const cards = useMemo(() => {
    // Normalize different possible API shapes to a flat array
    if (Array.isArray(allCardsRaw)) return allCardsRaw;
    if (Array.isArray(allCardsRaw?.result)) return allCardsRaw?.result;
    if (Array.isArray(allCardsRaw?.result?.result)) return allCardsRaw?.result?.result;
    return [];
  }, [allCardsRaw]);

  // Derived order
  const ordersData = getAllOrders?.result?.orderAll || [];
  const order = useMemo(() => {
    return ordersData.find((o) => String(o?.order_id) === String(orderId)) || {};
  }, [ordersData, orderId]);



  // Amount math (kept aligned with your original business rules)
  const baseAmount = useMemo(() => {
    const entered = toNum(partialAmount);
    const full = toNum(order?.balanceamount);
    return payMode === "partial" && entered > 0 ? entered : full;
  }, [payMode, partialAmount, order?.balanceamount]);




  const amount = useWallet ? Number(walletAmount?.amount ?? 0) : 0;
  const rewards = useWallet ? Number(walletAmount?.rewardsamount ?? 0) : 0;
    let withVat= true;
    const consumableObj = getConsumableAmounts(
    amount,
    rewards,
    baseAmount,
  );

  const cardConsumableAmount = consumableObj.cardConsumableAmount;
  const isOnlyWalletAmountPayment =
  consumableObj?.totalWalletConsumableAmount > 0 &&
  consumableObj?.cardConsumableAmount == 0
  ? true
  : false;

  console.log("isOnlyWalletAmountPayment",isOnlyWalletAmountPayment)

  const processingFee = useMemo(() => +(baseAmount * 0.04).toFixed(3), [baseAmount]);
  const vatFeeGateway = useMemo(() => +(baseAmount * 0.20).toFixed(3), [baseAmount]);
  const totalForGateway = useMemo(() => +(baseAmount + processingFee + vatFeeGateway).toFixed(3), [baseAmount, processingFee, vatFeeGateway]);
  const totalForBank = useMemo(() => +(baseAmount + processingFee).toFixed(3), [baseAmount, processingFee]);

  // Wallet toggle (only allow if enough funds)
  const handleWalletToggle = () => {
    if (toNum(walletAmount?.amount) > toNum(order?.balanceamount)) {
      setUseWallet((s) => !s);
    }
  };

  const handleProceedToPay = () => setShowCheckout(true);
  const handleOpenAddCard = () => setAddCardModal(true);
  const handleCloseAddCard = () => setAddCardModal(false);
  const handleSelectCard = (card) => setSelectedSavedCard(card);

  // Stripe + API hooks
  const stripe = useStripe();
  const elements = useElements();
  const [addCard] = useAddCardMutation();
  const [makePayment] = useMakePaymentMutation();

  // capture data as an image
  const generateSummaryImage = (data) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 600;
      canvas.height = 400;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.font = "20px Arial";
      let y = 40;
      ctx.fillText("📋 Payment Summary", 20, y);
      y += 40; ctx.fillText(`Order ID: ${data.orderid ?? orderId}`, 20, y);
      y += 30; ctx.fillText(`Amount: ${fmt3(data.amount)} ${data.currency}`, 20, y);
      y += 30; ctx.fillText(`Service Charges: ${fmt3(data.serviceCharges ?? data.servicecharges)}`, 20, y);
      y += 30; ctx.fillText(`Reward Amount: ${fmt3(data.rewardamount)}`, 20, y);
      y += 30; ctx.fillText(`Wallet Amount: ${fmt3(data.walletamount ?? data.walletConsumable)}`, 20, y);
      y += 30; ctx.fillText(`VAT: ${fmt3(data.vat)}`, 20, y);
      y += 30; ctx.fillText(`Additional Amount: ${fmt3(data.additionalAmount)}`, 20, y);
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  // Bank (Meezan) payment
  const meezanPayment = async () => {
    try {
      const payload = {
        currency: getCurrency(order?.currency),
        amount: getFormattedPriceWith3(baseAmount),
        servicecharges: processingFee, // server expects lower-case key for this endpoint per your code
        rewardamount: getFormattedPriceWith3(0),
        walletConsumable: getFormattedPriceWith3(0),
        vat: 0,
      };
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
      formData.append("orderids", String(orderId)); // keep as simple string unless your backend requires []

      const summaryImageBlob = await generateSummaryImage({ ...payload, orderid: orderId });
      if (summaryImageBlob) formData.append("screenshot", summaryImageBlob, "summary.png");

      const paymentResponse = await fetch(`${BASE_URL}/cronejob/genlink_hrc_web`, {
        method: "POST",
        body: formData,
      });

      if (!paymentResponse.ok) throw new Error(`HTTP error! status: ${paymentResponse.status}`);
      const data = await paymentResponse.json();
      if (!data?.url) throw new Error("URL not found in response");
      router.push(data.url);
    } catch (error) {
      console.error(error);
      toast.error("Bank payment failed. Please try again.");
    }
  };

  // Gateway (Stripe) payment
  const handleGatewayPayment = async () => {
    try {
      const cardToken = selectedSavedCard?.stripekey || cards?.[0]?.stripekey;
      if (!cardToken) {
        toast.error("Please select a saved card or add a new one.");
        return;
      }

      const payload = {
        token: cardToken,
        currency: getCurrency(order?.currency),
        amount: getFormattedPriceWith3(cardConsumableAmount),
        serviceCharges: processingFee,
        orderid: orderId,
        rewardamount: getFormattedPriceWith3(0),
        walletamount: getFormattedPriceWith3(0),
        vat: vatFeeGateway,
        additionalAmount: getFormattedPriceWith3(0),
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
      const summaryImageBlob = await generateSummaryImage(payload);
      if (summaryImageBlob) formData.append("screenshot", summaryImageBlob, "summary.png");

      const res = await makePayment(formData);
      const { data: respData, error } = res || {};

      if (respData) {
        if (respData?.result === "Successfully Paid") {
          toast.success("Successfully Paid");
        } else if (respData?.result === PAYMENT_ERROR) {
          toast.error(respData?.result || PAYMENT_ERROR);
        } else {
          toast.error(respData?.result || "Payment failed.");
        }
      }
      if (error) toast.error("Something went wrong processing your payment.");
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred.");
    }
  };

  const handlePayClick = async () => {
    if (paymentMethod === "bank") return meezanPayment();
    if (paymentMethod === "gateway") return handleGatewayPayment();
    toast.error("Select a payment method first.");
  };

  // Add new card (Stripe Elements tokenization)
  const handleSubmitNewCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      toast.error("Card input is not ready yet.");
      return;
    }

    const { token, error: stripeError } = await stripe.createToken(cardNumberElement);
    if (stripeError) {
      toast.error(stripeError.message);
      return;
    }
    if (!token) {
      toast.error("Failed to create Stripe token.");
      return;
    }

    try {
      const res = await addCard({
        clientId: user?.userid,
        cardType: token.card?.brand,
        Lastfourdigit: token.card?.last4,
        Stripekey: token.id,
      });

      const { data: respData, error: apiError } = res || {};
      if (respData?.error === true) {
        toast.error(apiError?.data?.message || "API Error while adding card");
        return;
      }
      if (respData?.status === "success") {
        toast.success("Card added successfully");
        setAddCardModal(false);
      } else {
        toast.error("Error while adding card");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    }
  };

  const stripeInputStyle = {
    style: {
      base: { fontSize: "16px", color: "#424770", "::placeholder": { color: "#aab7c4" } },
      invalid: { color: "#9e2146" },
    },
  };

  const currencySymbol = getCurrencySymbol(getCurrencyFromCode(walletAmount?.currency));

  const getCardLogo = (brand) => {
    const b = brand?.toLowerCase?.();
    const s = 24;
    switch (b) {
      case "visa": return <FaCcVisa size={s} className="text-blue-900" />;
      case "mastercard": return <FaCcMastercard size={s} className="text-red-600" />;
      case "amex": return <FaCcAmex size={s} className="text-blue-500" />;
      case "discover": return <FaCcDiscover size={s} className="text-orange-600" />;
      default: return <FaCreditCard size={s} className="text-gray-500" />;
    }
  };

  const handleFileDownload = () => {
    try {
      const fileUrl = `${BASE_URL}/${order?.downloadfile}`;
      if (!fileUrl) return;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Progress ring numbers
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const progress = Number(order?.completepercentage || 0);
  const offset = circumference - (progress / 100) * circumference;

  // ========================= RENDER =========================
  if (summaryTab === "summary") {
    const showCards = paymentMethod === "gateway";
    const payable = paymentMethod === "bank" ? totalForBank : totalForGateway;

    return (
      <div className="mt-20 !w-full relative">
        {showCards && (
          <div className="flex justify-between items-center py-2">
            <button onClick={() => setSummaryTab("")} className="flex my-4 items-center gap-2 hover:text-primary">
              <FaArrowLeftLong /> Back
            </button>
            <div onClick={handleOpenAddCard} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition">
              <div className="rounded-full border border-blue-600 w-7 h-7 text-blue-600 flex justify-center items-center font-bold">+</div>
              <span className="text-gray-700 font-medium">Add New Debit Card</span>
            </div>
          </div>
        )}

        <div className="grid !w-full lg:grid-cols-2 justify-items-center gap-8 items-center">
          <div className="w-full">
            <div className="border-2 p-5 rounded-xl h-64">
              <div className="flex items-center gap-2">
                <FaRegCreditCard size={40} className="text-primary" />
                <div>
                  <p className="text-primary">Order Summary</p>
                  <p className="text-xs">Qty: 1</p>
                </div>
              </div>
              <div className="py-2">
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">Price :</span>
                  <span className="text-primary font-bold">{fmt3(baseAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">Processing Fee (4%) :</span>
                  <span className="text-primary font-bold">{fmt3(processingFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-primary font-bold ${paymentMethod === "bank" ? "line-through" : ""}`}>Vat Fee (20%) :</span>
                  <span className="text-primary font-bold">{walletAmount?.currency} {fmt3(vatFeeGateway)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">Total Payable Amount:</span>
                  <span className="text-primary font-bold">{walletAmount?.currency} {fmt3(payable)}</span>
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
              <div>
                <div className="flex px-1 items-start pt-3 gap-2">
                  <FaWallet size={20} className="text-primary" />
                  <div>
                    <p className="text-sm">Wallet</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-grey">Available:</span>
                      <span className="text-xs text-grey">{currencySymbol}{fmt3(walletAmount?.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-grey">Includes Reward Amount</span>
                      <span className="text-xs text-grey">{currencySymbol}{fmt3(walletAmount?.rewardsamount)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex bg-amber-50 rounded-xl px-1 items-start mt-2 gap-2">
                  <FaCircleInfo size={30} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold">Payment Info Message</p>
                    <p className="text-xs text-grey px-2">
                      Looks like this order is higher than your wallet credit. We will charge the remaining amount to your payment method below.
                    </p>
                  </div>
                </div>

                <div className="flex px-1 items-start mt-2 gap-2">
                  <RiBankCardFill size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold">{paymentMethod === "bank" ? "Bank Transfer" : "Payment Gateway"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Card Modal */}
        {addCardModal && (
          <>
            <div className="w-full h-full fixed inset-0 bg-black opacity-30" />
            <div className="absolute !top-12 left-1/2 transform z-50 -translate-x-1/2 shadow-xl rounded-md backdrop-blur-md bg-white p-6 w-96 md:max-w-screen-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Card</h2>
              <form onSubmit={handleSubmitNewCard} className="space-y-4 w-full max-w-md mx-auto">
                <label className="block text-sm font-medium">Card Number</label>
                <div className="border p-2 rounded-md"><CardNumberElement options={stripeInputStyle} /></div>
                <label className="block text-sm font-medium">Expiry</label>
                <div className="border p-2 rounded-md"><CardExpiryElement options={stripeInputStyle} /></div>
                <label className="block text-sm font-medium">CVC</label>
                <div className="border p-2 rounded-md"><CardCvcElement options={stripeInputStyle} /></div>
                <div className="flex gap-2">
                  <button type="button" onClick={handleCloseAddCard} className="w-1/2 border rounded-md py-2">Cancel</button>
                  <button type="submit" className="w-1/2 bg-primary text-white py-2 rounded-md" disabled={!stripe}>Add Card</button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Saved cards (only for gateway) */}
        {showCards && cards?.length > 0 && (
          <div className="md:col-span-12 space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Select a Card</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {cards.map((card) => {
                const isSelected = selectedSavedCard?.id === card?.id;
                const logo = getCardLogo(card?.brand || card?.cardtype);
                return (
                  <div key={card?.id} className={`relative bg-white rounded-xl p-5 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${isSelected ? "border-2 border-blue-500 ring-4 ring-blue-100 bg-blue-50" : "border border-gray-200 hover:border-gray-300"}`} onClick={() => handleSelectCard(card)}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-medium text-xs uppercase tracking-wide text-gray-500">{card?.cardtype || card?.brand}</span>
                      {logo}
                    </div>
                    <div className="mb-5">
                      <div className="flex items-center space-x-2">
                        {[...Array(3)].map((_, i) => (<span key={i} className="text-xl">•</span>))}
                        <span className="text-lg font-medium text-gray-800">{card?.fourdigit || card?.last4}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="block text-xs text-gray-400">Expires</span>
                        {(card?.exp_month || "").toString().padStart(2, "0")}/{card?.exp_year}
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-blue-500 text-white rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
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

        <div className="w-full py-6 text-center">
          <button onClick={handlePayClick} disabled={paymentMethod === "bank" ? false : !selectedSavedCard && cards.length === 0} className="px-12 py-2 md:me-24 rounded-lg bg-primary text-white">
            Pay {walletAmount?.currency} {fmt3(paymentMethod === "bank" ? totalForBank : totalForGateway)}
          </button>
        </div>
      </div>
    );
  }


  return (
    <>
      {showCheckout ? (
        <div className="mt-20">
          <button onClick={() => { setShowCheckout(false); }} className="flex my-4 items-center gap-2 hover:text-primary">
            <FaArrowLeftLong /> Back
          </button>
          <div className="container">
            <h2>Select Payment Method</h2>
            <div className="grid md:grid-cols-3 gap-4 py-12">
              {/* If a method is already chosen, show mode selector */}
              {paymentMethod ? (
                <div className="w-full md:col-span-12">
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="w-full md:col-span-6 border-2 p-4 rounded-lg" onClick={() => setPayMode("full")}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <p>Full Payment</p>
                          <span className="text-xs text-grey">(Pay full amount)</span>
                        </div>
                        <input type="radio" name="payMode" className="h-4 w-4" checked={payMode === "full"} onChange={() => setPayMode("full")} />
                      </div>
                    </div>
                    <div className="w-full md:col-span-6 border-2 p-4 rounded-lg" onClick={() => setPayMode("partial")}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <p>Partial Payment</p>
                          <span className="text-xs text-grey">(Enter amount you want to pay)</span>
                        </div>
                        <input type="radio" name="payMode" className="h-4 w-4" checked={payMode === "partial"} onChange={() => setPayMode("partial")} />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-12 justify-center items-center mt-12">
                    {payMode === "full" && (
                      <div className="w-full md:col-span-6 flex flex-col gap-4">
                        <div className="border-2 rounded-xl p-5">
                          <h1>Order Summary</h1>
                          <div className="flex gap-6 mt-5 items-center">
                            <p className="text-sm text-grey">Price :</p>
                            <p className="text-grey">{walletAmount?.currency} {fmt3(order?.balanceamount)}</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">Processing Fee (4%) :</p>
                            <p className="text-grey">{fmt3(processingFee)}</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">VAT (20%) :</p>
                            <p className="text-grey">{fmt3(vatFeeGateway)}</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">Payment Method:</p>
                            <p className="text-grey">{paymentMethod === "bank" ? "Bank Transfer" : "Payment Gateway"}</p>
                          </div>
                          <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                            <p className="text-primary">Payable Amount:</p>
                            <p className="text-primary">{walletAmount?.currency} {fmt3(paymentMethod === "bank" ? totalForBank : totalForGateway)}</p>
                          </div>
                        </div>
                        {/* <div className="text-center">
                          <button type="button" className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab("summary")}>
                            Pay Now
                          </button>
                        </div> */}
                      </div>
                    )}

                    {payMode === "partial" && (
                      <div className="w-full md:col-span-6">
                        <div>
                          <input type="number" name="amount" max={order?.balanceamount ?? undefined} value={partialAmount} onChange={(e) => {
                            const val = e.target.value;

                            // if empty, allow clearing the input
                            if (val === "") {
                              setPartialAmount("");
                              return;
                            }

                            const num = Number(val);

                            // only update if it's a valid number and <= balanceamount
                            if (!isNaN(num) && num <= (order?.balanceamount ?? 0)) {
                              setPartialAmount(num);
                            }
                          }} className="border w-full py-2 px-4 my-2 rounded-md outline-none" />
                          <div className="border-2 rounded-xl p-5">
                            <h1>Order Summary</h1>
                            <div className="flex gap-6 mt-5 items-center">
                              <p className="text-sm text-grey">Price :</p>
                              <p className="text-grey">{walletAmount?.currency} {fmt3(order?.balanceamount)}</p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">Processing Fee (4%) :</p>
                              <p className="text-grey">{walletAmount?.currency} {fmt3(processingFee)}</p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">VAT (20%) :</p>
                              <p className="text-grey">{walletAmount?.currency} {fmt3(vatFeeGateway)}</p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">Payment Method:</p>
                              <p className="text-grey">{paymentMethod === "bank" ? "Bank Transfer" : "Payment Gateway"}</p>
                            </div>
                            <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                              <p className="text-primary">Payable Amount:</p>
                              <p className="text-primary">{walletAmount?.currency} {fmt3(paymentMethod === "bank" ? totalForBank : totalForGateway)}</p>
                            </div>
                          </div>
                        </div>
                        {/* <div className="text-center py-4">
                          <button type="button" className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab("summary")}>
                            Pay Now
                          </button>
                        </div> */}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Wallet toggle card (unchanged except for state) */}
                  <div className="w-full">
                    <p className="text-sm text-grey py-2">Recommended Method(s)</p>
                    <div className={`flex justify-between border-2 h-56 rounded-xl p-5`}>
                      <div>
                        <div className="flex gap-2 items-center">
                          <FaWallet size={30} className="text-primary" />
                          <p className="p1 text-grey">Wallet</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green">Available:</span>
                          <span className="text-green">{fmt3(order?.totalPrice)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Reward Amount:</span>
                          <span className="text-sm text-gray-600">{currencySymbol}{fmt3(walletAmount?.rewardsamount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Wallet Amount:</span>
                          <span className="text-sm text-gray-600">{useWallet ? `${fmt3(walletAmount?.amount) - order?.balanceamount}` : fmt3(walletAmount?.amount)}</span>
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center cursor-pointer relative">
                          <input type="checkbox" checked={useWallet} onChange={handleWalletToggle} className="opacity-0 absolute" />
                          <span className={`w-12 h-6 rounded-full relative transition-all duration-300 ${useWallet ? "bg-primary" : "bg-gray-300"}`}>
                            <span className={`w-6 h-6 bg-white rounded-full absolute top-0 left-0 transition-all duration-300 ${useWallet ? "translate-x-6" : ""}`}></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bank transfer */}
                  <div className="md:py-8 w-full">
                    <div className={`md:py-8 w-full border-2 h-56 rounded-xl px-5 py-3 ${paymentMethod === "bank" ? "border-blue-500" : ""}`} onClick={() => setPaymentMethod("bank")}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MdPayments size={38} className="text-primary" />
                          <p className="p1 text-grey">Bank Transfer</p>
                        </div>
                        <FaCircleInfo size={30} className="text-primary" />
                      </div>
                      <div className="ps-4">
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">Price:</span>
                          <span className="text-grey text-sm">{fmt3(order?.balanceamount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">Processing fee (4%):</span>
                          <span className="text-grey text-sm">{fmt3(processingFee)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm line-through">VAT (20%):</span>
                          <span className="text-grey text-sm">{fmt3(vatFeeGateway)}</span>
                        </div>
                        <div className="text-end mt-3">
                          <span className="text-lg text-primary">Total : {fmt3(totalForBank)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gateway */}
                  <div className="md:py-8 w-full">
                    <div className={`md:py-8 w-full border-2 min-h-48 rounded-xl px-5 py-3 ${paymentMethod === "gateway" ? "border-blue-500" : ""}`} onClick={() => setPaymentMethod("gateway")}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="35" height="35"><circle cx="50" cy="50" r="45" fill="#312E81" /><text x="50" y="55" fontFamily="Arial" fontSize="20" fill="white" textAnchor="middle">STRIPE</text></svg>
                          <p className="p1 text-grey">Payment Gateway</p>
                        </div>
                        <FaCircleInfo size={30} className="text-primary" />
                      </div>
                      <div className="ps-4">
                        <div className="flex justify-between items-center"><span className="text-grey text-sm">Price:</span><span className="text-grey text-sm">{walletAmount?.currency} {fmt3(order?.balanceamount)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-grey text-sm">Processing fee (4%):</span><span className="text-grey text-sm">{walletAmount?.currency} {fmt3(processingFee)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-grey text-sm">VAT (20%):</span><span className="text-grey text-sm">{walletAmount?.currency} {fmt3(vatFeeGateway)}</span></div>
                        <div className="text-end mt-3"><span className="text-lg text-primary">Total : {walletAmount?.currency} {fmt3(totalForGateway)}</span></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer action */}
            {paymentMethod && (
              <div className="text-center">
                <button type="button" className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab("summary")}>
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <section className="mt-20">
          <div className="container mx-auto md:px-6 pb-10">
            <div>
              <motion.div className="md:w-full md:col-span-8" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                <div className={`bg-no-repeat bg-center md:w-full bg-cover flex justify-center items-center rounded-tl-2xl ${order?.payment_status === 0 ? "min-h-32 px-4" : ""} rounded-tr-2xl`} style={{ height: `${order?.payment_status === 0 ? "300px" : ""}`, backgroundImage: `url(${Number(order?.completepercentage) === 100 ? "/orders/banner.svg" : Number(order?.completepercentage) > 0 ? "/orders/yellobanner.svg" : "/orders/red.svg"})` }}>
                  <div className="grid w-full px-8 md:grid-cols-12 justify-between items-center">
                    {order?.payment_status === 1 || order?.payment_status === 2 ? (
                      <>
                        <motion.div className="w-full md:col-span-6 mt-5 md:mt-0" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <h2>Completed</h2>
                          <p className="fs-25">Your Order has been Completed!</p>
                        </motion.div>
                        <motion.div className="w-full md:col-span-6 flex justify-end" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
                          <div className="relative size-36 md:size-60">
                            <svg className="size-full -rotate-90" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="21" cy="21" r="13" fill="none" className="stroke-current text-grey dark:text-neutral-700" strokeWidth="2.7"></circle>
                              <circle cx="21" cy="21" r="13" fill="none" className={`stroke-current ${Number(order?.completepercentage) === 100 ? "text-[#3BB537]" : Number(order?.completepercentage) > 0 ? "text-yellow" : Number(order?.completepercentage) === 0 ? "text-grey" : ""} dark:text-blue-500`} strokeWidth="2.7" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"></circle>
                            </svg>
                            <div className={`absolute top-1/2 ${order?.payment_status === 2 ? "!right-16" : "!right-14"} md:right-10 transform -translate-y-1/2 -translate-x-1/2`}>
                              <span className="text-center text-2xl font-bold text-black dark:text-blue-500">{order?.completepercentage}%</span>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <motion.p className="w-full md:col-span-12 flex gap-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
                        <span>Note:</span> Please complete the payment to proceed with your order. Work on your order will only begin once the payment is confirmed.
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Order meta */}
                <motion.div className="flex wrap px-3 justify-between items-start py-3 mt-9" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
                  <div>
                    {order?.payment_status === 1 && (
                      <div className="pb-4">
                        <button className="bg-green px-6 py-2 rounded-md text-white">Marks : {order?.marks}</button>
                      </div>
                    )}
                    <div className="flex p3 items-center gap-3">
                      <span className="font-bold">Order ID:</span> <span className="font-semibold">{order?.order_id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex p3 items-center gap-3"><span>Order placed:</span> <span>{order?.order_place_date}</span></div>
                    <div className="flex items-center gap-2"><span className="p2">Deadline:</span><span className="p3">{order?.order_deadline}</span></div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div className="flex justify-center items-center mt-5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}>
                  <div className="flex gap-3 items-center ">
                    {order?.payment_status === 1 ? (
                      <div className="flex items-center w-full gap-2">
                        <button className="btnText mx-2 text-white bg-primary flex justify-center items-center gap-3 rounded-md w-219 w-[219] h-[40]">
                          <Image src={"/orders/meeting.svg"} width={13} height={16} alt="" />
                          Schedule Meeting
                        </button>
                        {order?.downloadfile && (
                          <button onClick={handleFileDownload} className="btnText text-white bg-[#13a09d] rounded-md w-[219px] h-[40px] flex items-center justify-center">
                            Download File
                          </button>
                        )}
                      </div>
                    ) : (
                      <button onClick={handleProceedToPay} className="btnText text-white flex justify-center items-center bg-primary rounded-md w-[219] w-219 h-[40]">
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