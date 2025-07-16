"use client";
import React, { useState } from "react";
import { useFormik } from "formik"; // Import Formik
import * as Yup from "yup"; // Import Yup for validation
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion for animations

import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useChangePasswordMutation } from "@/redux/user/profileApi";
import toast from "react-hot-toast";
const Page = () => {
  const user = useSelector((state) => state.auth?.user);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] =
    useState(false);

  const [changePassword, { isLoading: changePasswordLoading }] =
    useChangePasswordMutation();
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Old Password is required")
        .min(6, "Old Password should be at least 6 characters long"),
      newPassword: Yup.string()
        .required("New Password is required")
        .min(6, "New Password should be at least 6 characters long"),
      confirmNewPassword: Yup.string()
        .required("Confirm New Password is required")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("clientid", user?.userid);
        formData.append("oldpassword", values?.oldPassword);
        formData.append("newpassword", values?.newPassword);
        formData.append("confirmpassword", values?.confirmNewPassword);

        const res = await changePassword(formData);
        const { data: respData, error } = res || {};

        if (respData?.result === "Password Updated Successfully") {
          toast.success(respData?.result || "Password updated successfully");
          resetForm(); // ✅ reset form fields
        } else {
          toast.error(respData?.result || "Error updating password");
        }

        if (error) {
          toast.error(
            typeof error === "string"
              ? error
              : error?.data?.message || "Something went wrong"
          );
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Unexpected error occurred."
        );
      }
    },
  });

  return (
    <>
      <section className="mt-20" style={{ top: "75px" }}>
        <Link
          href={"/account-setting"}
          className="flex items-center gap-2 hover:text-[#312E81]"
        >
          <FaArrowLeftLong /> Back
        </Link>
        <div className="container mx-auto px-2 md:px-6 py-8">
          <div className="flex justify-center">
            <motion.div
              className="w-full md:w-1/2 bg-white shadow-xl p-4 md:p-8 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Update Password
              </h2>

              <form onSubmit={formik.handleSubmit}>
                {/* Old Password */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={oldPasswordVisible ? "text" : "password"}
                      id="oldPassword"
                      name="oldPassword"
                      placeholder="Enter Old Password"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.oldPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                      className="absolute top-3 right-3 text-xl"
                    >
                      {oldPasswordVisible ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formik.touched.oldPassword && formik.errors.oldPassword ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.oldPassword}
                    </div>
                  ) : null}
                </motion.div>

                {/* New Password */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={newPasswordVisible ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter New Password"
                      name="newPassword"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                      className="absolute top-3 right-3 text-xl"
                    >
                      {newPasswordVisible ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.newPassword}
                    </div>
                  ) : null}
                </motion.div>

                {/* Confirm New Password */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={confirmNewPasswordVisible ? "text" : "password"}
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      placeholder="Confirm New Password"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmNewPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmNewPasswordVisible(!confirmNewPasswordVisible)
                      }
                      className="absolute top-3 right-3 text-xl"
                    >
                      {confirmNewPasswordVisible ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.confirmNewPassword}
                    </div>
                  ) : null}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  Update Password
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
