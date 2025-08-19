"use client";

import { auth } from "@/utils/firebase";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useVerifyClientNumberMutation } from "@/redux/auth/authApi";
import { useDispatch } from "react-redux";
import { ChangeUser } from "@/redux/auth/authSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
export default function Page() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phase, setPhase] = useState("enter-phone"); // enter-phone | enter-otp | done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  // const auth = getAuth(app);
  const recaptchaVerifierRef = useRef(null);
  const confirmationResultRef = useRef(null);


    const [verifyPhoneNumber, { isLoading: verifyPhoneNumberLoading }] =
    useVerifyClientNumberMutation();
  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current?.clear?.();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  // Initialize (or reuse) invisible reCAPTCHA
  const setupRecaptcha = () => {
      if (!recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved — signInWithPhoneNumber will continue
            },
            "expired-callback": () => {
              recaptchaVerifierRef.current?.reset?.();
            },
          });
        } catch (error) {
          console.warn("reCAPTCHA Enterprise failed, falling back to v2:", error);
          recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal", // Try visible widget if invisible fails
          });
        }
    }
    return recaptchaVerifierRef.current;
  };

  async function handleSendOTP(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!phone) {
      setError("Please enter a valid phone number.");
      return;
    }

    // 🚫 Example denylist rule (client-side only; can be bypassed — enforce on server if needed)
    // if (phone.startsWith("+92")) {
    //   setError("Phone numbers from Pakistan are not allowed.");
    //   return;
    // }

    try {
      setLoading(true);
      const verifier = setupRecaptcha();
      // Ensure the widget is rendered (safe even for invisible)
      await verifier.render();
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      confirmationResultRef.current = confirmation;
      setPhase("enter-otp");
      setMessage("OTP has been sent. Please check your phone.");
    } catch (err) {
      console.error("Firebase error:", err);
      setError(err?.message || "Failed to send OTP. Try again.");
      recaptchaVerifierRef.current?.reset?.();
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmOTP(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length < 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    try {
      setLoading(true);
      const result = await confirmationResultRef.current.confirm(otp);
      const userres = result.user;
      const body = new FormData();
      body.append('userid', user?.userid);
      body.append('number', userres?.phoneNumber);
      const verifyNumberRes = await verifyPhoneNumber(body);
      const { data: respData, error } = verifyNumberRes || {};
      // return;
      if(respData?.result == "User Number Verify Successfully"){
        dispatch(ChangeUser({
          ...user,
          isVerified:true,
          user_contact_no: userres?.phoneNumber
        }))
      }
      toast.success("User verified Successfully");
      setPhase("done");
      setMessage(`Verified! Welcome ${userres.phoneNumber}.`);

      router.push("/dashboard");
    } catch (err) {
      console.error("Confirm error:", err);
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Optional: resend uses the same verifier (reset first for good measure)
  async function handleResend() {
    try {
      setLoading(true);
      setError("");
      recaptchaVerifierRef.current?.reset?.();
      await handleSendOTP(new Event("submit"));
    } finally {
      setLoading(false);
    }
  }

  // console.log('Host:', window.location.hostname);                 // must be afd5a24a0ac0.ngrok-free.app
  // console.log('Project ID:', auth.app.options.projectId);         // must be your Firebase project (e.g. pro-writing-firm)
  // console.log('API key:', auth.app.options.apiKey);   
  // if(typeof window !== "undefined"){
  //   console.log("self.FIREBASE_APPCHECK_DEBUG_TOKEN : ",self.FIREBASE_APPCHECK_DEBUG_TOKEN); // should be true if debug token is set
  // }



 

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Phone Number Verification</h2>

        {phase === "enter-phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <PhoneInput
              international
              defaultCountry="US"
              value={phone}
              onChange={setPhone}
              className="phone-input"
              limitMaxLength
            />
            {/* Invisible reCAPTCHA mounts here */}
            <div id="recaptcha-container" />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {phase === "enter-otp" && (
          <form onSubmit={handleConfirmOTP} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full border rounded px-3 py-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 border-2 py-2 rounded hover:bg-green-700 transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="w-full border py-2 rounded"
            >
              Resend code
            </button>
          </form>
        )}

        {phase === "done" && (
          <div className="text-center space-y-3">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        {(error || message) && (
          <p className={`mt-4 text-center ${error ? "text-red-600" : "text-green-600"}`}>
            {error || message}
          </p>
        )}
      </div>
    </div>
  );
}
