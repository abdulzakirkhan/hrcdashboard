"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useState } from "react";
// import { ordersData } from '../../data';
import Image from "next/image";
import { RiBankCardFill } from "react-icons/ri";
import Link from "next/link";
import { FaCircleInfo } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { useSelector } from "react-redux";
import { ORDERS_TYPES } from "@/constants";
import { getOrderTypeValues } from "@/config/myWebHelpers";
import { useGetOrderByPaymentTypeQuery } from "@/redux/order/ordersApi";
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

  const ordersData = getAllOrders?.result?.orderAll || [];
  const order = ordersData.find((o) => o.order_id === orderId);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const processingFee = (Number(amount) * 4) / 100;
  const vatFee = (Number(amount) * 20) / 100;

  const handleProceedToPay = () => {
    setShowCheckout(true);
    setSummaryTab(true);
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleTabSwitch = (tab, mode) => {
    setActiveTab(tab);
    handleCardSelect(mode);
  };

  const totalAmount = Number(amount) + processingFee + vatFee; // Total amount including all feeses

  console.log("order", order);
  console.log("getAllOrders", getAllOrders);

  if (summaryTab === "summary") {
    return (
      <div className="mt-20">
        <button
          onClick={() => setSummaryTab(null)}
          className="flex my-4 items-center gap-2 hover:text-[#312E81]"
        >
          <FaArrowLeftLong /> Back
        </button>
        <div className="grid md:grid-cols-12 justify-items-center gap-8 items-center">
          <div className="w-full md:col-span-5">
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
                    {order.totalPrice}
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
                  <span className="text-primary font-bold line-through">
                    {vatFee}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    Total Payable Amount:
                  </span>
                  <span className="text-primary font-bold">{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:col-span-5">
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
          <div className="w-full text-center md:col-span-12">
            <button className="px-12 py-2 md:me-24 rounded-lg bg-primary text-white">
              Pay $21
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                            <p className="text-grey">{order.totalPrice}</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">
                              Processing Fee (4%) :
                            </p>
                            <p className="text-grey">$0.04</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">VAT (20%) :</p>
                            <p className="text-grey">$0.20</p>
                          </div>
                          <div className="flex gap-6 mt-2 items-center">
                            <p className="text-sm text-grey">Payment Method:</p>
                            <p className="text-grey">Payment Gateway</p>
                          </div>
                          <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                            <p className="text-primary">Payable Amount:</p>
                            <p className="text-primary">{order.totalPrice}</p>
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
                              <p className="text-grey">{order.totalPrice}</p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">
                                Processing Fee (4%) :
                              </p>
                              <p className="text-grey">${processingFee}</p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">VAT (20%) :</p>
                              <p className="text-grey">${vatFee}</p>
                            </div>
                            <div className="flex gap-6 mt-2 items-center">
                              <p className="text-sm text-grey">
                                Payment Method:
                              </p>
                              <p className="text-grey">Payment Gateway</p>
                            </div>
                            <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                              <p className="text-primary">Payable Amount:</p>
                              <p className="text-primary">{totalAmount}</p>
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
                      onClick={() => handleCardSelect("wallet")}
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
                          <span className="text-sm text-gray-600">$0.05</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Wallet Amount:
                          </span>
                          <span className="text-sm text-gray-600">$0.00</span>
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
                            {order.totalPrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">
                            Processing fee (4%):
                          </span>
                          <span className="text-grey text-sm">$0.40</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm line-through">
                            VAT (20%):
                          </span>
                          <span className="text-grey text-sm">$0.40</span>
                        </div>
                        <div className="text-end mt-3">
                          <span className="text-lg text-primary">
                            Total : {order.totalPrice}
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
                            {order.totalPrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">
                            Processing fee (4%):
                          </span>
                          <span className="text-grey text-sm">$0.40</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-grey text-sm">VAT (20%):</span>
                          <span className="text-grey text-sm">$2.00</span>
                        </div>
                        <div className="text-end mt-3">
                          <span className="text-lg text-primary">
                            Total : {order.totalPrice}
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
                    order.payment_status === 0 ? "min-h-32 px-4" : ""
                  } rounded-tr-2xl`}
                  style={{
                    height: `${order?.payment_status === 0 ? "300px" : ""}`,
                    backgroundImage: `url(${
                      order.payment_status === 1
                        ? "/orders/banner.svg"
                        : order.payment_status === 2
                        ? "/orders/yellobanner.svg"
                        : "/orders/red.svg"
                    })`,
                  }}
                >
                  <div className="grid w-full px-8 md:grid-cols-12 justify-between items-center">
                    {order.payment_status === 1 ||
                    order.payment_status === 2 ? (
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
                                    : order.payment_status === 2
                                    ? "text-yellow"
                                    : order.payment_status === 0
                                    ? "text-grey"
                                    : ""
                                } dark:text-blue-500`}
                                strokeWidth="2.7"
                                strokeDasharray="100"
                                strokeDashoffset={order?.remaining}
                                strokeLinecap="round"
                              ></circle>
                            </svg>
                            <div className={`absolute top-1/2 ${order?.payment_status === 2 ? "!right-16" : "!right-14"} md:right-10 transform -translate-y-1/2 -translate-x-1/2`}>
                              <span className="text-center text-2xl font-bold text-black dark:text-blue-500">
                                {order.payment_status === 2
                                  ? 50
                                  : order.payment_status === 1
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
                    {order.payment_status === 1 ? (
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
