"use client";

import React, {  useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrderId } from '@/hooks/useOrderId';
const CustomerSupportModal = ({ showModal, onClose  }) => {
  const [message, setMessage] = useState(''); 
  const [isSupportActive, setIsSupportActive] = useState(false); 
  const { orderId } = useOrderId();
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = () => {
    if (message.trim()) {

      console.log("Sending message:", message);
      setMessage('');
      alert("Your message has been sent successfully!");
      onClose(); 
    } else {
      alert("Please write a message before sending.");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed top-0 lg:top-6 right-0 bg-black bg-opacity-50 z-50 h-[120vh] lg:h-[93vh] w-[500px]"> {/* Modal container on the right side */}
      <div className="bg-white  rounded-l-lg shadow-lg h-full flex flex-col">
        <div className="bg-primary flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
          <button
            onClick={onClose}
            className="bg-[#FFFFFF] w-[25px] h-[25px] rounded-full flex justify-center items-center"
          >
            <Image src={"/orders/close.svg"} width={12} height={13} alt="Close" />
          </button>
        </div>

        <div className="flex justify-end lg:pe-8">
            <div className="bg-white rounded-lg shadow-lg w-[320] lg:w-[60%] mt-2">
                <div className="bg-primary flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
                    <p className="text-white text-center w-full">Order summary</p>
                </div>
                <div className="px-4 flex flex-col gap-2 pb-2 h-full">
                {/* Display payment information card first */}
                {!isSupportActive ? (
                    <>
                    <div className="flex justify-between items-center">
                        <p>Payment Method:</p>
                        <span>Stripe</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Price:</p>
                        <span>$100:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Processing fee (4%):</p>
                        <span>$4:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>VAT(5%):</p>
                        <span>$5:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Wallet:</p>
                        <span className="text-red">-$50:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Total:</p>
                        <span className="">$59:00</span>
                    </div>
                    </>
                ) : (
                    // Display Customer Support Input
                    <>
                    <h2 className="text-xl font-semibold">Customer Support</h2>
                    <p className="text-sm">Please describe your issue or question, and we will get back to you soon.</p>

                    <input
                        type="text"
                        value={message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        className="border border-gray-300 rounded-md p-2 mt-4 w-full"
                    />

                    <div className="flex justify-end mt-4">
                        <button
                        onClick={handleSubmit}
                        className="w-[159px] h-[40px] bg-primary text-center text-white rounded-md"
                        >
                        Send Message
                        </button>
                    </div>
                    </>
                )}
                </div>
            </div>

        </div>

        <div className="flex  justify-end lg:ps-8">
            <div className="bg-white rounded-lg shadow-lg w-[320] lg:w-[60%] my-4">
                <div className="bg-green flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
                    <p className="text-white w-full text-center">Congratulation</p>
                </div>
                <div className="px-4 flex flex-col gap-2 h-full">
                {/* Display payment information card first */}
                    <div className="flex justify-between items-center">
                        <p>Payment Method:</p>
                        <span>Stripe</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Price:</p>
                        <span>$100:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Processing fee (4%):</p>
                        <span>$4:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>VAT(5%):</p>
                        <span>$5:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Wallet:</p>
                        <span className="text-red">-$50:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="">Total:</p>
                        <span className="">$59:00</span>
                    </div>
                    <div className="flex justify-center bg-primary items-center py-2 w-full">
                        <Link href={`/orders/${orderId}/proceed-payment/adds-on`}
                        className="w-[159px] h-[40px] bg-primary text-center text-white rounded-md"
                        onClick={() => setIsSupportActive(true)} // Switch to support modal
                        >
                        Redeam offer
                        </Link>
                    </div>
                </div>
            </div>

        </div>

        <div className="flex gap-3 pb-5 px-3">

        <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type your message here..."
            className="border  border-gray-300 rounded p-2 mt-4 w-full"
        />
        <div className="flex justify-end mt-4">
            <button
            onClick={handleSubmit}
            className="w-[52px] flex justify-center items-center  h-[39px] bg-primary text-center text-white rounded-md"
            >
            <Image src={"/orders/send.svg"} width={24}  height={24} alt=''/>
            </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportModal;
