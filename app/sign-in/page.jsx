"use client";
import { useVerifyLoginFeildsMutation } from "@/redux/auth/authApi";
import { ChangeUser } from "@/redux/auth/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const [verifyLoginFeidls, { isLoading: verifyLoginFeidlsLoading }] =
    useVerifyLoginFeildsMutation();
  // Validation schema
  const validationSchema = Yup.object({
    id: Yup.string().required("User ID is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    ...(isSignUp && {
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    rememberMe: Yup.boolean(),
  });

  // Login handler
  const handleLogin = async (values) => {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("userid", values.id);
    formData.append("secretkey", values.password);
    formData.append("applicationtype", "hrc");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(values.id)) {
      formData.append("isemail", "1");
    } else {
      formData.append("isemail", "0");
    }

    const res = await verifyLoginFeidls(formData);
    const { error, data: respData } = res || {};
    if (respData) {
      if (
        respData?.result?.userdetail?.[0]?.client_verification_status == "1"
      ) {
        dispatch(
          ChangeUser({
            ...respData?.result?.userdetail?.[0],
            isVerified: true,
          })
        );
      } else if (
        respData?.result?.userdetail?.[0]?.client_verification_status == "0"
      )
        dispatch(
          ChangeUser({
            ...respData?.result?.userdetail?.[0],
            isVerified: false,
          })
        );
      else toast.error("Invalid Credentials");
    }

    if (error) {
      toast.error(error || "error");
    }
  };

  //   useEffect(() => {
  //   if (getToken?.result?.token)
  //     dispatch(ChangeUser({ ...user, token: getToken?.result?.token }));
  // }, [getToken]);
  return (
    <>
      <section className="bg-[#FFFFFF]">
        {/* Login/Signup Form */}
        <div className="container mx-auto py-14">
          <div className="grid md:grid-cols-2 justify-center items-center">
            <div className="w-full animate-slowBounce">
              <Image src="/login/login.svg" width={600} height={589} alt="" />
            </div>
            <div className="w-full px-8 border-2 shadow-2xl rounded-xl py-12 flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <div
                  className="bg-no-repeat bg-center w-[133px] h-[133px] flex justify-center items-center bg-cover"
                  style={{ backgroundImage: "url(/login/bg.svg)" }}
                >
                  <Image
                    src="/login/logo.svg"
                    width={107}
                    height={107}
                    alt=""
                  />
                </div>
                <h1 className="text-primary py-8 text-center">
                  Hybrid Research Center
                </h1>

                <Formik
                  initialValues={{
                    id: "",
                    password: "",
                    ...(isSignUp && { confirmPassword: "" }),
                    rememberMe: false,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}
                >
                  {({ isSubmitting }) => (
                    <Form className="w-full">
                      {/* Email Field */}
                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          User ID
                        </label>
                        <Field
                          type="text"
                          id="id"
                          name="id"
                          placeholder="User ID"
                          className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="id"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="mb-4 relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <Field
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                        >
                          {passwordVisible ? (
                            <HiEyeOff size={24} />
                          ) : (
                            <HiEye size={24} />
                          )}
                        </button>
                      </div>

                      {/* Confirm Password Field */}
                      {isSignUp && (
                        <div className="mb-4 relative">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <Field
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmPasswordVisible(!confirmPasswordVisible)
                            }
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
                          >
                            {confirmPasswordVisible ? (
                              <HiEyeOff size={24} />
                            ) : (
                              <HiEye size={24} />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Remember Me Checkbox */}
                      <div className="mb-4 flex items-center">
                        <Field
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          className="h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Remember Me
                        </label>
                      </div>

                      {/* Submit Button */}
                      <div className="flex flex-col justify-center items-center py-10">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-primary w-[219px] h-[40px] text-white px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {isSubmitting
                            ? "Processing..."
                            : isSignUp
                            ? "Sign Up"
                            : "Login"}
                        </button>
                      </div>

                      {/* Form Footer */}
                      <div className="py-3 flex justify-between gap-4">
                        <p className="text-grey p3 text-center">
                          {isSignUp
                            ? "Already have an account?"
                            : "Create New Account"}
                          <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-primary font-bold md:ms-2"
                          >
                            {isSignUp ? "Login" : "Signup"}
                          </button>
                        </p>
                        {!isSignUp && (
                          <p className="text-grey p3 text-center">
                            Forgot Password ?
                          </p>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
