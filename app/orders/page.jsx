"use client";
import React, { useEffect, useRef, useState } from "react";
import Orders from "@/components/Orders";
// import { ordersData } from '../data'
import { motion } from "framer-motion";
import OrderCard from "@/components/OrderCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ORDERS_TYPES } from "@/constants";
import { useGetOrderByPaymentTypeQuery } from "@/redux/order/ordersApi";
import { getOrderTypeValues } from "@/config/myWebHelpers";
import { useSelector } from "react-redux";
const OrdersPage = () => {
  const orderType = ORDERS_TYPES.ALL_ORDERS;
  const user = useSelector((state) => state.auth?.user);
  const dropdownRef = useRef(null);
  const router = useRouter();
  // const [allOrders, setAllOrders] = useState([]);
  // const [orderToShown, setOrderToShown] = useState(allOrders);
  const [showFilter, setShowFilter] = useState(false);
  const handleDropdwon = () => {
    setShowFilter(!showFilter);
  };
  const [applyFilter, setApplyFilter] = useState([]);
  const [filters, setFilters] = useState({
    completed: false,
    paid: false,
    unpaid: false,
    partiallyPaid: false,
  });
  const getAllorderBody = new FormData();
  getAllorderBody.append("id", user?.userid);
  getAllorderBody.append("paymentstatus", getOrderTypeValues(orderType));

  const {
    data: getAllOrders = { result: { orderAll: [] } },
    isFetching: getAllOrdersLoading,
  } = useGetOrderByPaymentTypeQuery(getAllorderBody);

  const toggleFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const ordersData = getAllOrders?.result?.orderAll || [];
  const [allOrders, setAllOrders] = useState([])
  const filteredOrders = getAllOrders?.result?.orderAll?.filter((order) => {
    const { completed, paid, unpaid, partiallyPaid } = filters;

    const statusMatch = !completed || order?.orderstatus === "Completed";

    const paymentMatch =
      (!paid && !unpaid && !partiallyPaid) ||
      (paid && order?.payment_status === 1) ||
      (unpaid && order?.payment_status === 0) ||
      (partiallyPaid && order?.payment_status === 2);

    return statusMatch && paymentMatch;
  });

  useEffect(() => {
    const handleRouteChange = () => setShowFilter(false);
    router.events?.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // console.log("filteredOrders", filteredOrders);
//  console.log("user",user) 
  return (
    <>
      <section className="mt-12">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="md:px-4 py-8">Orders</h1>
            {/* Filter Button */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={handleDropdwon}
                className="bg-orange w-219 btnText text-white rounded-md w-h104 w-[104] hover:bg-primary-dark transition-colors h-[40] flex justify-center items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }} // Starts smaller and transparent
                whileInView={{ opacity: 1, scale: 1 }} // Fades in and scales to full size
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }} // Delay for staggered effect
              >
                <Image
                  src={"/icons/home/filter.svg"}
                  width={12}
                  height={5}
                  alt=""
                />
                Filter
              </motion.button>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-48 bg-white border-2 shadow-lg rounded-lg p-4"
                >
                  <div className="flex justify-between items-center gap-2">
                    <label htmlFor="completed">Completed</label>
                    <input
                      type="checkbox"
                      id="completed"
                      name="completed"
                      checked={filters.completed}
                      onChange={() => toggleFilter("completed")}
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <label htmlFor="Paid">Paid</label>
                    <input
                      type="checkbox"
                      id="Paid"
                      name="Paid"
                      checked={filters.paid}
                      onChange={() => toggleFilter("paid")}
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <label htmlFor="Unpaid">Unpaid</label>
                    <input
                      type="checkbox"
                      id="Unpaid"
                      name="Unpaid"
                      checked={filters.unpaid}
                      onChange={() => toggleFilter("unpaid")}
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <label htmlFor="ppaid">Partially Paid</label>
                    <input
                      type="checkbox"
                      id="ppaid"
                      name="ppaid"
                      checked={filters.partiallyPaid}
                      onChange={() => toggleFilter("partiallyPaid")}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-12 lg:w-full gap-12">
            <Orders ordersData={filteredOrders} />
          </div>

          {/* <div className="flex items-center flex-wrap gap-6">
          {ordersData.map((order,index) => (
            <OrderCard key={index} order={order}  />
          ))}
        </div> */}
        </div>
      </section>
    </>
  );
};

export default OrdersPage;
