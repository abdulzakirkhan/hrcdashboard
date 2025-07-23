// import React from 'react'

// const page = () => {
//   return (
//     <div>
//         <p>Phone Number Verification</p>
//     </div>
//   )
// }

// export default page


"use client";

import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const page = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // const auth = getAuth(app);

//   // 🔐 Initialize Recaptcha
  // const setupRecaptcha = () => {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //       size: "invisible",
  //       callback: () => {
  //         console.log("Recaptcha verified");
  //       },
  //     });
  //   }
  // };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!phone) {
      setError("Please enter a valid phone number.");
      return;
    }

    // 🚫 Block Pakistan numbers manually
    // if (phone.startsWith("+92")) {
    //   setError("Phone numbers from Pakistan are not allowed.");
    //   window.alert("Phone numbers from Pakistan are not allowed.")
    //   return;
    // }

    // try {
    //   setLoading(true);
    //   setupRecaptcha();
    //   const appVerifier = window.recaptchaVerifier;

    //   const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
    //   window.confirmationResult = confirmation;

    //   setMessage("OTP has been sent. Please check your phone.");
    //   // Redirect or show OTP input here
    // } catch (err) {
    //   console.error("Firebase error:", err);
    //   setError("Failed to send OTP. Try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Phone Number Verification</h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <PhoneInput
            international
            defaultCountry="US"
            value={phone}
            onChange={setPhone}
            className="phone-input"
            limitMaxLength
          />

          <div id="recaptcha-container"></div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
