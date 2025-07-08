"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MdPayment } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'; 
const page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentGateway, setIsPaymentGateway] = useState(false)
    const [addCard, setAddCard] = useState(false)
    const [amount, setAmount] = useState(0)
    // Function to open the modal
    const openModal = () => setIsModalOpen(!isModalOpen);

    const [isBank, setisBank] = useState(false)
    // Function to close the modal
    const closeModal = () => setIsModalOpen(false);
    const handleIsPayment = () => {
        setIsPaymentGateway(!isPaymentGateway)
    }
    const handleViewModal = () => {
        setAddCard(!addCard)
    }





      const [amountBank, setAmountBank] = useState('');
      const [selectedAmount, setSelectedAmount] = useState('');
    
      // Function to handle the button click and update the input
      const handleButtonClick = (value) => {
        setAmount(value); // Update input field with the selected value
        setSelectedAmount(value); // Save the selected amount
      };
    
      // Function to handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Top-up of $${amount} submitted!`);
      };
  return (
    <>
        <section className="mt-20">
            {isPaymentGateway ? (
                <div className="container relative mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl">
                    {/* Back Button */}
                    <button 
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition"
                    onClick={handleIsPayment}
                    >
                    ⬅ Back
                    </button>
                
                    {/* Available Credit Section */}
                    <div className="bg-gray-100 p-5 rounded-lg flex justify-between items-center mt-4">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-700">Available Credit</h1>
                        <p className="text-sm text-gray-500">Includes Reward Amount: <span className="text-green-600 font-medium">$0.5</span></p>
                        <p className="text-sm text-gray-500">& Wallet Amount: <span className="text-green-600 font-medium">$0.00</span></p>
                    </div>
                    <h1 className="text-2xl font-bold text-blue-600">$ 0.04</h1>
                    </div>
                
                    {/* Form Section */}
                    <div className="grid md:grid-cols-12 gap-6 py-8">
                        {/* Top-Up Input */}
                        <div className="md:col-span-4 space-y-2">
                            <label htmlFor="topup" className="text-gray-700 font-medium">Top-Up Amount</label>
                            <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                id="topup"
                                placeholder="300"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            </div>
                        </div>
                    
                        {/* Payment Method */}
                        <div className="md:col-span-6">
                            <div className="bg-gray-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <MdPayment className="text-blue-600" size={30} />
                                <p className="text-blue-600 font-semibold">Payment Method</p>
                            </div>
                            <div onClick={handleViewModal} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition">
                                <div className="rounded-full border border-blue-600 w-7 h-7 text-blue-600 flex justify-center items-center font-bold">
                                +
                                </div>
                                <span className="text-gray-700 font-medium">Add New Debit Card</span>
                            </div>
                            </div>
                        </div>
                    
                        {/* Top-Up Confirmation */}
                        <div className="md:col-span-12 flex justify-between items-center bg-blue-50 p-4 rounded-lg shadow">
                            <p className="text-gray-700 font-medium">Top-Up Amount: <span className="text-blue-600 font-bold">${amount}</span></p>
                            <button className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            Confirm Top-Up
                            </button>
                        </div>
                    </div>
                    {addCard && (
                        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 shadow-xl rounded-md backdrop-blur-md bg-white p-6 w-96 md:max-w-screen-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Card</h2>

                            {/* Card Number */}
                            <div className="mb-4">
                            <label className="text-gray-700 font-medium">Card Number</label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            </div>

                            {/* Expiry & CVC Fields */}
                            <div className="grid grid-cols-2 gap-4">
                            {/* MM/YY */}
                            <div>
                                <label className="text-gray-700 font-medium">Expiry (MM/YY)</label>
                                <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength="5"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* CVC */}
                            <div>
                                <label className="text-gray-700 font-medium">CVC</label>
                                <input
                                type="text"
                                placeholder="123"
                                maxLength="4"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex justify-between">
                            <button 
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                onClick={() => setAddCard(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-6 py-2 bg-primary text-white rounded-md shadow-md hover:bg-blue-700 transition"
                            >
                                Add Card
                            </button>
                            </div>
                        </div>
                    )}

                </div>
              
            ) :  isBank ? ( <section>
                <button className="flex items-center gap-2 hover:text-[#312E81]" onClick={() => setIsBank(false)}> <FaArrowLeftLong /> Back</button>
                <div className="container py-8 mx-auto px-6 flex flex-col justify-center items-center">
                  {/* Heading with fade-in animation */}
                  <motion.h1
                    className="w-1/2 py-3 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    Bank Transfer
                  </motion.h1>
        
                  <div className="grid grid-cols-1 md:w-1/2">
                    <div className="w-full md:col-span-12">
        
                      <div className="flex w-full justify-center space-y-3 items-center space-x-4 md:space-x-12 mb-4">
                        {/* Buttons with fade-in and scale-up animation on click */}
                        <motion.button
                          onClick={() => handleButtonClick('100')}
                          className="bg-primary text-white px-6 mt-2 md:mt-2 md:ms-0 py-3 rounded-lg hover:bg-purple-950"
                          whileTap={{ scale: 0.95 }} // Scale effect when clicked
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          $100
                        </motion.button>
        
                        <motion.button
                          onClick={() => handleButtonClick('200')}
                          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-950"
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          $200
                        </motion.button>
        
                        <motion.button
                          onClick={() => handleButtonClick('300')}
                          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-950"
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          $300
                        </motion.button>
                      </div>
        
                      {/* Input field with fade-in animation */}
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                      >
                        <label htmlFor="amountBank" className="block text-sm font-medium text-gray-700">
                          Top up Amount:
                        </label>
                        <input
                          type="number"
                          id="amount"
                          value={amountBank}
                          onChange={(e) => setAmountBank(e.target.value)} // Allows manual input
                          className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter custom amount"
                        />
                      </motion.div>
        
                      {/* Display the selected amount with fade-in */}
                      {selectedAmount && (
                        <motion.p
                          className="text-xl font-medium mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.7 }}
                        >
                          You selected: <b>${selectedAmount}</b>
                        </motion.p>
                      )}
        
                      {/* Submit Button with bounce effect on hover */}
                      <motion.button
                        onClick={handleSubmit}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600"
                        whileHover={{ scale: 1.05 }} // Slight bounce on hover
                        transition={{ duration: 0.2 }}
                      >
                        Submit Top-Up Payment
                      </motion.button>
                    </div>
                  </div>
                </div>
              </section>): (
                <div className="container mx-auto px-6 mt-8">
                    <div className="grid md:grid-cols-12">
                        <div className="w-full md:col-span-12">
                            <div className="flex justify-end">
                            <button onClick={openModal} className="btnText bg-primary px-6 py-3 text-white rounded-lg">Top-Up Wallet</button>
                            </div>
                        </div>
                        <div className="w-full md:col-span-12">
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <motion.div
                                className="bg-white px-8 rounded-lg shadow-xl w-full max-w-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Modal Content */}
                                <div className="flex justify-center items-center mb-4 py-2 relative">
                                    <button onClick={closeModal} className="text-gray-500 absolute top-0 right-0 ">
                                        <span className="text-4xl">×</span>
                                    </button>
                                    <h2 className="text-xl font-semibold text-center">Top-Up Wallet</h2>
                                </div>
                                <div className="text-center p-3 flex flex-col justify-center items-center">
                                    <h3>How do you want to top up your wallet?</h3>
                                    <div className="flex justify-between items-center py-3 gap-3">
                                        <Link href={"/bank-transfer"} className="bg-primary text-white px-3 py-2 rounded-lg">With Bank Transfer</Link>
                                        <button onClick={() => setIsPaymentGateway(true)} className="bg-primary text-white px-3 py-2 rounded-lg">With Payment Gateway</button>
                                    </div>
                                </div>
                            </motion.div>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-12 gap-6 mt-10">
                        <div className="w-full md:col-span-6">
                            <div className="p-6 h-full border-2 rounded-2xl shadow-xl">
                                <h1>Available Credit</h1>
                                <p className="p3 py-2">Rewards Amount: USD 0.05</p>
                                <p className="p3 py-2">Wallet Amount: USD 0.00</p>
                                <p>Total Credit (Rewards + Wallet): USD 0.05</p>
                            </div>
                        </div>
                        <div className="w-full md:col-span-6">
                            <div className="p-6 h-full bg-[#d4d3e4] md:h-[240] flex justify-center items-center rounded-2xl shadow-xl">
                              <div className="flex gap-3 items-start">
                                  <FaInfoCircle className="-mt-2" style={{fontSize:"45px"}} />
                                  <p className="m-0 text-md"> With Bank Transfer Pay,You Will Receive The Wallet amount after a 4% deduction as a services fee, while with Payment Gateway, you will receive the wallet amount after a 24% deduction ,which includes a 4% service s fee and s 20% VAT.</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </section>
    </>
  )
}

export default page
