"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik"; // Import Formik
import * as Yup from "yup"; // Import Yup for validation
import { motion } from "framer-motion"; // Import framer-motion for animations
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/user/profileApi";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/constants/apiUrls";
const Page = () => {
  const [image, setImage] = useState(null); // State to store the image preview URL
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const { data: profileData } = useGetProfileQuery(user?.userid);

  const [userData, setUserData] = useState({
    profileImage: profileData?.path
      ? BASE_URL + profileData?.path
      : "/header/profile.svg",
    name: profileData?.name || "Hello, User",
    email: profileData?.email || "",
  });
  const [updateProfile, { isLoading: updateProfileLoading }] =
    useUpdateProfileMutation();
  const [value, setValue] = useState("");
  const formik = useFormik({
    initialValues: {
      file: null, // Ensure that file starts as null
      fullName: "",
      email: "",
    },
    validationSchema: Yup.object({
      file: Yup.mixed().nullable(),
      fullName: Yup.string().nullable(),
      email: Yup.string().email("Invalid email format").nullable(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("clientid", user?.userid);

      // Check if nothing has changed
      const noChange =
        !values.file &&
        values.fullName === profileData?.name &&
        (values.email === profileData?.email || !values.email);

      if (noChange) {
        toast.error(
          "Please fill in at least one field to update your profile."
        );
        return;
      }

      // Handle file if present
      if (values.file) {
        formData.append("imageof", values.file);
        const imageUrl = URL.createObjectURL(values.file);
        setImage(imageUrl);
      }

      // Handle name if changed
      if (values.fullName && values.fullName !== profileData?.name) {
        formData.append("name", values.fullName);
      }

      // Optional: Handle email if it's editable in future
      if (values.email && values.email !== profileData?.email) {
        formData.append("email", values.email);
      }

      const res = await updateProfile(formData);
      if (res?.data) {
        toast.success("Profile updated successfully.");
        dispatch(ChangeUser({ ...user, clientname: values.fullName }));
        setImage(null); // Reset image preview after successful update
      } else if (res?.error) {
        toast.error("Failed to update profile. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (profileData) {
      formik.setValues({
        file: null,
        fullName: profileData.name || "",
        email: profileData.email || "",
      });
    }
  }, [profileData]);


  return (
    <>
      <section className="mt-20">
        <Link
          href={"/account-setting"}
          className="flex items-center gap-2 hover:text-[#312E81]"
        >
          <FaArrowLeftLong /> Back
        </Link>
        <div className="container mx-auto px-0 md:px-6 py-8">
          <div className="flex justify-center">
            <motion.div
              className="w-full md:w-1/2 bg-white shadow-xl md:p-8 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center flex justify-center">
                Update Your Profile
              </h2>

              <form onSubmit={formik.handleSubmit}>
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Picture
                  </label>
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
                    <div className="text-red-500 text-sm">
                      {formik.errors.file}
                    </div>
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
                    <Image
                      src={image}
                      width={200}
                      height={200}
                      alt="Profile Picture"
                      className="rounded-full"
                    />
                  </motion.div>
                )}

                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter Your Full Name"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fullName}
                  />
                  {formik.touched.fullName && formik.errors.fullName ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.fullName}
                    </div>
                  ) : null}
                </motion.div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="email"
                    disabled={profileData?.email ? true : false}
                    name="email"
                    placeholder="Enter your Email"
                    className="w-full p-3 border placeholder:text-sm border-gray-300 rounded-md"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </motion.div>
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={value}
                    onChange={setValue}
                    className="w-full custInput p-3 border border-gray-300 rounded-md"
                  />
                  {/* Optional: Add validation message if needed */}
                  {!value && (
                    <div className="text-red-500 text-sm">
                      Phone number is required
                    </div>
                  )}
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
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default Page;
