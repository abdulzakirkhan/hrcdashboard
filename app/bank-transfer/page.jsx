"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import Link from 'next/link';
import { IoMdArrowRoundBack } from "react-icons/io";
const Page = () => {
  // State to manage the amount entered and the selected button value
  const [amount, setAmount] = useState('');
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
          <Link href={"/wallet"} className="flex items-center gap-2 hover:text-primary"> <IoMdArrowRoundBack /> Back</Link>
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
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Top up Amount:
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} // Allows manual input
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
      </section>
    </>
  );
};

export default Page;
// "use client"

// import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Import Framer Motion
// import Link from 'next/link';
// import { FaArrowLeftLong } from "react-icons/fa6";
// const Page = () => {
//   // State to manage the amount entered and the selected button value
//   const [amount, setAmount] = useState('');
//   const [selectedAmount, setSelectedAmount] = useState('');

//   // Function to handle the button click and update the input
//   const handleButtonClick = (value) => {
//     setAmount(value); // Update input field with the selected value
//     setSelectedAmount(value); // Save the selected amount
//   };

//   // Function to handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Top-up of $${amount} submitted!`);
//   };

//   return (
//     <>
//       <section className="mt-20">
//         <Link href={"/wallet"} className="flex items-center gap-2 hover:text-[#312E81]"> <FaArrowLeftLong /> Back</Link>
//         <div className="container py-8 mx-auto px-6 flex flex-col justify-center items-center">
//           {/* Heading with fade-in animation */}
//           <motion.h1
//             className="w-1/2 py-3 text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//           >
//             Bank Transfer
//           </motion.h1>

//           <div className="grid grid-cols-1 md:w-1/2">
//             <div className="w-full md:col-span-12">

//               <div className="flex w-full justify-center space-y-3 items-center space-x-4 md:space-x-12 mb-4">
//                 {/* Buttons with fade-in and scale-up animation on click */}
//                 <motion.button
//                   onClick={() => handleButtonClick('100')}
//                   className="bg-primary text-white px-6 mt-2 md:mt-2 md:ms-0 py-3 rounded-lg hover:bg-purple-950"
//                   whileTap={{ scale: 0.95 }} // Scale effect when clicked
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   $100
//                 </motion.button>

//                 <motion.button
//                   onClick={() => handleButtonClick('200')}
//                   className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-950"
//                   whileTap={{ scale: 0.95 }}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   $200
//                 </motion.button>

//                 <motion.button
//                   onClick={() => handleButtonClick('300')}
//                   className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-950"
//                   whileTap={{ scale: 0.95 }}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   $300
//                 </motion.button>
//               </div>

//               {/* Input field with fade-in animation */}
//               <motion.div
//                 className="mb-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.7 }}
//               >
//                 <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
//                   Top up Amount:
//                 </label>
//                 <input
//                   type="number"
//                   id="amount"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)} // Allows manual input
//                   className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter custom amount"
//                 />
//               </motion.div>

//               {/* Display the selected amount with fade-in */}
//               {selectedAmount && (
//                 <motion.p
//                   className="text-xl font-medium mb-4"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.7 }}
//                 >
//                   You selected: <b>${selectedAmount}</b>
//                 </motion.p>
//               )}

//               {/* Submit Button with bounce effect on hover */}
//               <motion.button
//                 onClick={handleSubmit}
//                 className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600"
//                 whileHover={{ scale: 1.05 }} // Slight bounce on hover
//                 transition={{ duration: 0.2 }}
//               >
//                 Submit Top-Up Payment
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Page;
