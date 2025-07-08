"use client"
import React, { useState } from 'react';
import { useFormik } from 'formik'; // Import Formik
import * as Yup from 'yup'; // Import Yup for validation
import { motion } from 'framer-motion'; // Import framer-motion for animations
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Link from 'next/link';
import { FaArrowLeftLong } from 'react-icons/fa6';
const Page = () => {
  const [image, setImage] = useState(null); // State to store the image preview URL
const [value, setValue] = useState("");
  const formik = useFormik({
    initialValues: {
      file: null, // Ensure that file starts as null
      fullName: '',
      email: ''
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required('Profile picture is required'),
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string().required("Email is required")
    }),
    onSubmit: (values) => {
      alert('Profile updated successfully');
      console.log(values);

      // Create the image preview only when the file is valid
      if (values.file) {
        const imageUrl = URL.createObjectURL(values.file); // Create a preview URL for the uploaded file
        setImage(imageUrl); // Set the preview URL
      }
    }
  });

  return (
    <>
      <section className="mt-20">
        <Link href={"/account-setting"} className="flex items-center gap-2 hover:text-[#312E81]"><FaArrowLeftLong /> Back</Link>
        <div className="container mx-auto px-0 md:px-6 py-8">
          <div className="flex justify-center">
            <motion.div
              className="w-full md:w-1/2 bg-white shadow-xl md:p-8 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center flex justify-center">Update Your Profile</h2>

              <form onSubmit={formik.handleSubmit}>
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*" // Ensure only images are selected
                    className="w-full p-3 border border-gray-300 rounded-md"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      formik.setFieldValue("file", file); // Set the file in Formik state
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.file && formik.errors.file ? (
                    <div className="text-red-500 text-sm">{formik.errors.file}</div>
                  ) : null}
                </motion.div>

                {/* Image Preview */}
                {image && (
                  <motion.div
                    className="mb-4 flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image src={image} width={200} height={200} alt="Profile Picture" className="rounded-full" />
                  </motion.div>
                )}

                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName" placeholder='Enter Your Full Name'
                    className="w-full p-3 border border-gray-300 rounded-md"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fullName}
                  />
                  {formik.touched.fullName && formik.errors.fullName ? (
                    <div className="text-red-500 text-sm">{formik.errors.fullName}</div>
                  ) : null}
                </motion.div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="text"
                    id="email"
                    name="email" placeholder="Enter your Email"
                    className="w-full p-3 border placeholder:text-sm border-gray-300 rounded-md"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                  ) : null}
                </motion.div>
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={value}
                      onChange={setValue}
                      className="w-full custInput p-3 border border-gray-300 rounded-md"
                    />
                    {/* Optional: Add validation message if needed */}
                    {!value && <div className="text-red-500 text-sm">Phone number is required</div>}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  Update Profile
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
