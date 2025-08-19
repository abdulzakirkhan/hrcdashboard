"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik'; // Import Formik
import * as Yup from 'yup'; // Import Yup for validation

const page = () => {
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const formik = useFormik({
    initialValues: {
      orderType: '',
      meetingType: '',
      academicLevel: '',
      category: '',
      course: '',
    },
    validationSchema: Yup.object({
      orderType: Yup.string().required('Order Type is required'),
      meetingType: Yup.string().required('Meeting Type is required'),
      academicLevel: Yup.string().required('Academic Level is required'),
      category: Yup.string().required('Category is required'),
      course: Yup.string().required('Course is required'),
    }),
    onSubmit: (values) => {
      console.log(values); // Form submission logic
      setShowPopup(true); // Show the popup after form submission
    },
  });

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here
    console.log("Popup form submitted");
    setShowPopup(false); // Close the popup after submission
  };

  return (
    <>
      <section className={`mt-20`}>
        <div className="container mx-auto px-6 mt-4">
          <div className="grid md:grid-cols-12 ">
            <div className="w-full md:col-span-12 flex justify-center items-center">
              <div className="w-70 py-4">
                <div className="bg-primary flex justify-center items-center py-2">
                  <h1 className="text-white text-center">Initiate Order</h1>
                </div>
                <div className="border-2 w-full mt-5 rounded-lg p-12">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Row: Order Type & Type of Meeting */}
                      <div className="flex flex-col">
                        <label htmlFor="orderType" className="text-sm font-medium text-gray-700">Order Type</label>
                        <select
                          id="orderType"
                          name="orderType"
                          className="p-3 border border-gray-300 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.orderType}
                        >
                          <option value="">Select Order Type</option>
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                        </select>
                        {formik.touched.orderType && formik.errors.orderType ? (
                          <div className="text-red-500 text-sm">{formik.errors.orderType}</div>
                        ) : null}
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="meetingType" className="text-sm font-medium text-gray-700">Type of Meeting</label>
                        <select
                          id="meetingType"
                          name="meetingType"
                          className="p-3 border border-gray-300 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.meetingType}
                        >
                          <option value="">Select Meeting Type</option>
                          <option value="one-on-one">One-on-One</option>
                          <option value="group">Group</option>
                        </select>
                        {formik.touched.meetingType && formik.errors.meetingType ? (
                          <div className="text-red-500 text-sm">{formik.errors.meetingType}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Second Row: Academic Level & Category */}
                      <div className="flex flex-col">
                        <label htmlFor="academicLevel" className="text-sm font-medium text-gray-700">Academic Level</label>
                        <select
                          id="academicLevel"
                          name="academicLevel"
                          className="p-3 border border-gray-300 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.academicLevel}
                        >
                          <option value="">Select Academic Level</option>
                          <option value="undergraduate">Undergraduate</option>
                          <option value="graduate">Graduate</option>
                        </select>
                        {formik.touched.academicLevel && formik.errors.academicLevel ? (
                          <div className="text-red-500 text-sm">{formik.errors.academicLevel}</div>
                        ) : null}
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                        <select
                          id="category"
                          name="category"
                          className="p-3 border border-gray-300 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.category}
                        >
                          <option value="">Select Category</option>
                          <option value="math">Math</option>
                          <option value="science">Science</option>
                          <option value="history">History</option>
                        </select>
                        {formik.touched.category && formik.errors.category ? (
                          <div className="text-red-500 text-sm">{formik.errors.category}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Course */}
                      <div className="flex flex-col">
                        <label htmlFor="course" className="text-sm font-medium text-gray-700">Course</label>
                        <select
                          id="course"
                          name="course"
                          className="p-3 border border-gray-300 rounded-md"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.course}
                        >
                          <option value="">Select type of Course</option>
                          <option value="course1">course1</option>
                          <option value="course2">course2</option>
                        </select>
                        {formik.touched.course && formik.errors.course ? (
                          <div className="text-red-500 text-sm">{formik.errors.course}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="w-full mt-5">
                      <h3>Description</h3>
                      <div className="border-2 rounded-lg px-3 pt-3 mt-3 pb-14">
                        <p className="text-grey p3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-center">
                      <button
                        type="submit"
                        className="bg-primary text-white py-3 px-6 rounded-md"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popup form */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center" style={{top:"94px",}}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2 mod">
            <p className="font-semibold mb-4 text-center">Please provide credentials from where your assistant will attend meeting.</p>
            <form onSubmit={handlePopupSubmit}>
              <div className="flex flex-col mb-4">
                <label htmlFor="email" className="text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="password" className="text-sm font-medium text-black">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="py-3">
                <p className="p3 m-0"> <b className="text-black">Schedule Meeting </b> (set date and Time)</p>
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid md:grid-cols-12 gap-4 mb-4">
                <div className="w-full md:col-span-8 flex flex-col mb-4">
                  <label htmlFor="fromTime" className="text-sm font-medium text-gray-700">From (HH:MM:SS)</label>
                  <input
                    type="time"
                    id="fromTime"
                    name="fromTime"
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="w-full md:col-span-8 flex flex-col">
                  <label htmlFor="toTime" className="text-sm font-medium text-gray-700">To (HH:MM:SS)</label>
                  <input
                    type="time"
                    id="toTime"
                    name="toTime"
                    className="p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="py-3">
                <p>Meeting  scheduled 29/09/2023 from 9:00 AM to 10:00 PM </p>
              </div>
              <div className="flex justify-center">
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md">
                  Submit
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
