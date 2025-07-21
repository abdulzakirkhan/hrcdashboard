// "use client";

// import React, { useEffect } from "react";
// import { useState } from "react";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup"; // For validation
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import { useGetpaymentHistryQuery } from "@/redux/payments/paymentApi";
// const page = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   const validationSchema = Yup.object({
//     searchId: Yup.string().required("Search ID is required"),
//     startDate: Yup.date().required("Start Date is required"),
//     endDate: Yup.date()
//       .required("End Date is required")
//       .min(Yup.ref("startDate"), "End Date must be later than Start Date"),
//   });
  
//   const { user } = useSelector((state) => state.auth) || {};
//   const {
//     data: paymentHistory,
//     isLoading: paymentHistoryLoading,
//     refetch: paymentHistoryRefech,
//   } = useGetpaymentHistryQuery(user?.userid);

//   const [payments, setPayments] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 9;

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentPayments = payments.slice(indexOfFirstEntry, indexOfLastEntry);

//   const totalPages = Math.ceil(payments.length / entriesPerPage);
//   useEffect(() => {
//     if (paymentHistory && paymentHistory.length > 0) {
//       setPayments(paymentHistory);
//     }
//   }, [paymentHistory]);

//   return (
//     <>
//       <section className="mt-20">
//         <div className="container mx-auto px-6">
//           <h1 className=" text-center py-3 md:py-0 md:text-start">
//             Payment History
//           </h1>

//           <div className="grid grid-cols-12">
//             <div className="w-full flex justify-center md:justify-end col-span-12">
//               <button
//                 className="bg-[#312E81] text-white text-btnText w-[219px] h-[40px] rounded-lg"
//                 onClick={() => setShowFilters(!showFilters)}
//               >
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>
//             </div>
//           </div>

//           {/* Filter Form */}
//           {showFilters && (
//             <div className="mt-4">
//               <Formik
//                 initialValues={{
//                   searchId: "",
//                   startDate: "",
//                   endDate: "",
//                 }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values) => {
//                   console.log(values);
//                   // handle form submission logic here
//                 }}
//               >
//                 <div className="px-0">
//                   <Form className="space-y-4 grid md:grid-cols-9 justify-center gap-10">
//                     {/* Search ID */}
//                     <div className="w-full md:col-span-2 mt-4">
//                       <label
//                         htmlFor="searchId"
//                         className="block text-sm font-semibold"
//                       >
//                         Search ID
//                       </label>
//                       <Field
//                         type="text"
//                         id="searchId"
//                         name="searchId"
//                         placeholder="Search Order By Id"
//                         className="mt-1 p-2 border rounded-md w-full"
//                       />
//                       <ErrorMessage
//                         name="searchId"
//                         component="div"
//                         className="text-red-600 text-xs"
//                       />
//                     </div>

//                     {/* Start Date */}
//                     <div className="w-full md:col-span-2">
//                       <label
//                         htmlFor="startDate"
//                         className="block text-sm font-semibold"
//                       >
//                         Start Date
//                       </label>
//                       <Field
//                         type="date"
//                         id="startDate"
//                         name="startDate"
//                         className="mt-1 p-2 border rounded-md w-full"
//                       />
//                       <ErrorMessage
//                         name="startDate"
//                         component="div"
//                         className="text-red-600 text-xs"
//                       />
//                     </div>

//                     {/* End Date */}
//                     <div className="w-full md:col-span-2">
//                       <label
//                         htmlFor="endDate"
//                         className="block text-sm font-semibold"
//                       >
//                         End Date
//                       </label>
//                       <Field
//                         type="date"
//                         id="endDate"
//                         name="endDate"
//                         className="mt-1 p-2 border rounded-md w-full"
//                       />
//                       <ErrorMessage
//                         name="endDate"
//                         component="div"
//                         className="text-red-600 text-xs"
//                       />
//                     </div>

//                     {/* Submit Button */}
//                     <div className="mt-4 w-full md:col-span-2 flex justify-center items-center">
//                       <button
//                         type="submit"
//                         className="bg-[#312E81] py-2 px-6 mt-5 text-white text-btnText rounded-lg"
//                       >
//                         Search
//                       </button>
//                     </div>
//                   </Form>
//                 </div>
//               </Formik>
//             </div>
//           )}
//         </div>

//         <div className="container mx-auto md:px-6 mt-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {currentPayments.map((payment, index) => (
//               <motion.div
//                 key={index}
//                 className="border-2 p-6 rounded-lg shadow-sm bg-white min-h-[180px]"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 {/* Order ID & Price */}
//                 <div className="flex justify-between items-center mb-4">
//                   <p className="text-sm text-gray-600">
//                     Order ID:{" "}
//                     <span className="font-semibold">{payment?.id}</span>
//                   </p>
//                   <h2 className="font-bold text-lg">{payment.price}</h2>
//                 </div>

//                 {/* Payment Source */}
//                 <p className="text-gray-700 text-sm mb-3">
//                   Payment Source: <b>{payment?.transactionkey}</b>
//                 </p>

//                 {/* Wallet Section */}
//                 <div className="bg-gray-100 p-4 rounded-lg space-y-2">
//                   <h3 className="font-semibold text-gray-800">Wallet</h3>
//                   <p className="text-sm">
//                     Includes Reward Amount:{" "}
//                     <span className="font-semibold">
//                       {payment?.rewardsdeduction}
//                     </span>
//                   </p>
//                   <p className="text-sm">
//                     Wallet Amount:{" "}
//                     <span className="font-semibold">
//                       {payment.walletdeduction}
//                     </span>
//                   </p>
//                 </div>

//                 {/* Card Section */}
//                 <div className="bg-gray-100 p-4 rounded-lg mt-4 space-y-2">
//                   <h3 className="font-semibold text-gray-800">
//                     Debit or Credit Card
//                   </h3>
//                   <p className="text-sm">
//                     Includes Service Charges:{" "}
//                     <span className="font-semibold">
//                       {payment?.serviceCharges}
//                     </span>
//                   </p>
//                   <p className="text-sm">
//                     VAT:{" "}
//                     <span className="font-semibold">
//                       {payment?.vat === null ? 0 : payment?.vat}
//                     </span>
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex py-3 justify-center items-center gap-4 mt-8">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 border-2 border-gray-500 rounded-md text-sm disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="text-sm border-2 border-gray-500 py-2 px-3 rounded-md">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 border-2 border-gray-500 rounded-md text-sm disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default page;








// code updated






"use client";

import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetpaymentHistryQuery } from "@/redux/payments/paymentApi";

const Page = () => {
  const [showFilters, setShowFilters] = useState(false);

  // Validation schema (dates optional, no invalid date errors)
  const validationSchema = Yup.object({
    searchId: Yup.string().nullable(),
    // startDate: Yup.date()
    //   .transform((value, originalValue) => (originalValue === "" ? null : value))
    //   .nullable(),
    // endDate: Yup.date()
    //   .transform((value, originalValue) => (originalValue === "" ? null : value))
    //   .nullable()
    //   .when("startDate", (startDate, schema) => {
    //     return startDate
    //       ? schema.min(startDate, "End Date must be later than Start Date")
    //       : schema;
    //   }),
  });

  const { user } = useSelector((state) => state.auth) || {};
  const {
    data: paymentHistory,
    isLoading: paymentHistoryLoading,
  } = useGetpaymentHistryQuery(user?.userid);

  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentPayments = payments.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(payments.length / entriesPerPage);







  useEffect(() => {
    if (paymentHistory && paymentHistory.length > 0) {
      setPayments(paymentHistory);
    }
  }, [paymentHistory]);

  
  return (
    <section className="mt-20">
      <div className="container mx-auto px-6">
        <h1 className="text-center py-3 md:py-0 md:text-start">
          Payment History
        </h1>

        {/* <div className="grid grid-cols-12">
          <div className="w-full flex justify-center md:justify-end col-span-12">
            <button
              className="bg-[#312E81] text-white text-btnText w-[219px] h-[40px] rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
          </div>
        </div> */}

          <div className="">
            <Formik
              initialValues={{
                searchId: "",
                startDate: "",
                endDate: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                let filtered = paymentHistory;

                if (values.searchId) {
                  filtered = filtered.filter((p) =>
                    String(p.id).includes(values.searchId.trim())
                  );
                }

                // if (values.startDate && values.endDate) {
                //   const start = new Date(values.startDate);
                //   const end = new Date(values.endDate);
                //   filtered = filtered.filter((p) => {
                //     const date = new Date(p.date); // replace with actual date field from API
                //     return date >= start && date <= end;
                //   });
                // }

                if (!values.searchId && !values.startDate && !values.endDate) {
                  filtered = paymentHistory;
                }

                setPayments(filtered);
                setCurrentPage(1); // reset pagination
              }}
            >
              {({ setFieldValue }) => (
                <div className="px-0">
                  <Form className="w-1/5 mt-2 ms-auto">
                    {/* Search by ID */}
                    <div className="">
                      <label
                        htmlFor="searchId"
                        className="block text-sm font-semibold"
                      >
                        Search By Order ID
                      </label>
                      <Field
                        type="text"
                        id="searchId"
                        name="searchId"
                        placeholder="Search Order By Id"
                        className="mt-1 p-2 border rounded-md w-full"
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          setFieldValue("searchId", value);

                          if (value === "") {
                            setPayments(paymentHistory);
                          } else {
                            const filtered = paymentHistory.filter((p) =>
                              String(p.id).includes(value)
                            );
                            setPayments(filtered);
                          }
                          setCurrentPage(1);
                        }}
                      />
                      <ErrorMessage
                        name="searchId"
                        component="div"
                        className="text-red-600 text-xs"
                      />
                    </div>

                    {/* Start Date */}
                    {/* <div className="w-full md:col-span-2">
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-semibold"
                      >
                        Start Date
                      </label>
                      <Field
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                      <ErrorMessage
                        name="startDate"
                        component="div"
                        className="text-red-600 text-xs"
                      />
                    </div> */}

                    {/* End Date */}
                    {/* <div className="w-full md:col-span-2">
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-semibold"
                      >
                        End Date
                      </label>
                      <Field
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="mt-1 p-2 border rounded-md w-full"
                      />
                      <ErrorMessage
                        name="endDate"
                        component="div"
                        className="text-red-600 text-xs"
                      />
                    </div> */}

                    {/* Submit Button */}
                      {/* <div className="mt-4 w-full md:col-span-2 flex justify-center items-center">
                        <button
                          type="submit"
                          className="bg-[#312E81] py-2 px-6 mt-5 text-white text-btnText rounded-lg"
                        >
                          Search
                        </button>
                      </div> */}
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        {/* {showFilters && (
        )} */}
      </div>

      <div className="container mx-auto md:px-6 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentPayments.map((payment, index) => (
            <motion.div
              key={index}
              className="border-2 p-6 rounded-lg shadow-sm bg-white min-h-[180px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  Order ID:{" "}
                  <span className="font-semibold">{payment?.id}</span>
                </p>
                <h2 className="font-bold text-lg">{payment.price}</h2>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                Payment Source: <b>{payment?.transactionkey}</b>
              </p>
              <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-gray-800">Wallet</h3>
                <p className="text-sm">
                  Includes Reward Amount:{" "}
                  <span className="font-semibold">
                    {payment?.rewardsdeduction}
                  </span>
                </p>
                <p className="text-sm">
                  Wallet Amount:{" "}
                  <span className="font-semibold">
                    {payment.walletdeduction}
                  </span>
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mt-4 space-y-2">
                <h3 className="font-semibold text-gray-800">
                  Debit or Credit Card
                </h3>
                <p className="text-sm">
                  Includes Service Charges:{" "}
                  <span className="font-semibold">
                    {payment?.serviceCharges}
                  </span>
                </p>
                <p className="text-sm">
                  VAT:{" "}
                  <span className="font-semibold">
                    {payment?.vat === null ? 0 : payment?.vat}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
  <div className="flex py-3 justify-center items-center gap-2 mt-8 flex-wrap">
    {/* Previous Button */}
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 border-2 border-gray-500 rounded-md text-sm disabled:opacity-50"
    >
      Previous
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }).map((_, index) => {
      const page = index + 1;

      // Always show all if pages <= 7
      if (totalPages <= 7) {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border-2 rounded-md text-sm ${
              currentPage === page
                ? "bg-gray-800 text-white border-gray-800"
                : "border-gray-400 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      }

      // Show first, last, current, neighbors
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border-2 rounded-md text-sm ${
              currentPage === page
                ? "bg-gray-800 text-white border-gray-800"
                : "border-gray-400 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      }

      // Ellipses for skipped pages
      if (
        (page === 2 && currentPage > 3) ||
        (page === totalPages - 1 && currentPage < totalPages - 2)
      ) {
        return (
          <span key={page} className="px-3 py-1 text-gray-500">
            ...
          </span>
        );
      }

      return null;
    })}

    {/* Next Button */}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border-2 border-gray-500 rounded-md text-sm disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      </div>
    </section>
  );
};

export default Page;
