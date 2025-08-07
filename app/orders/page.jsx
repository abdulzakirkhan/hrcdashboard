"use client";
import React, { useEffect, useRef, useState } from "react";
import Orders from "@/components/Orders";
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
  const [allOrders, setAllOrders] = useState([]);
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



  // --- PAGINATION LOGIC ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


    useEffect(() => {
    setCurrentPage(1);
  }, [filters, ordersData]);


  
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
          {currentOrders?.length > 0 ? (
            currentOrders.map((order, index) => <Orders order={order} key={index} />)
          ) : (
            <div className="col-span-12 flex flex-col justify-center items-center">
              <Image src={"/orders/noOrders.svg"} width={382} height={328} alt="" />
              <h2 className="text-black">You have no orders yet.</h2>
              <p>Order now to have it show up in your list and stay updated.</p>
            </div>
          )}
        </div>


        {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    {/* Previous Button */}
    <button
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      onClick={handlePrevPage}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }).map((_, index) => {
      const page = index + 1;

      // Show all pages if there are less than 10
      if (totalPages <= 10) {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      }

      // For long pagination, only show first, last, current, and neighbors
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page ? "bg-gray-800 text-white border-gray-800" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      }

      // Add ellipses (...) for skipped pages
      if (
        page === 2 && currentPage > 3 || 
        page === totalPages - 1 && currentPage < totalPages - 2
      ) {
        return (
          <span key={page} className="px-2">...</span>
        );
      }

      return null;
    })}

    {/* Next Button */}
    <button
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}



        
          {/* <div className="grid md:grid-cols-12 lg:w-full gap-12">
            {filteredOrders?.length > 0 ? (
              filteredOrders?.map((order, index) => (
                <Orders order={order} key={index} />
              ))
            ) : (
              <div className="col-span-12">
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={"/orders/noOrders.svg"}
                    width={382}
                    height={328}
                    alt=""
                  />
                  <h2 className="text-[#000000]">You have no orders yet.</h2>
                  <p>
                    Order now to have it show up in your list and stay updated
                    on its payment_status.
                  </p>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </section>
    </>
  );
};

export default OrdersPage;
