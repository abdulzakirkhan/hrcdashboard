"use client"
import { motion } from 'framer-motion'; // Import framer-motion
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
const page = () => {
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef(null);



    useEffect(() => {
      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          setShowModal(false);
        }
      };
  
      if (showModal) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showModal]);
  return (
    <>
      <section className="mt-20">
        <div className="container mt-12 mx-auto md:px-6">
          <div className="grid md:grid-cols-12 gap-4">
            {/* Card 1 - Personal Information */}
            <motion.div
              className="w-full md:col-span-4 bg-[#FFFFFF] shadowCustomClass rounded-xl"

              initial={{ opacity: 0, x: -100 }} // Start off-screen
              animate={{ opacity: 1, x: 0 }} // Move to its final position
              transition={{ duration: 0.6, ease: 'easeOut' }} // Add smooth transition
            >
              <Link href="/profile-update">
                <div className="p-8">
                  <div className="flex justify-between items-center">
                    <p className='p1 text-grey'>Personal Information</p>
                    <div className="bg-[#E8E8FF] h-[80] w-[80] flex flex-col justify-center items-center rounded-xl" style={{width:"80px",height:"80px"}}>
                      <Image src={"/account/user.png"} width={50} height={40} alt="user information" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Card 2 - Update Password */}
            <motion.div
              className="w-full md:col-span-4 bg-[#FFFFFF] shadowCustomClass rounded-xl"
              initial={{ opacity: 0, x: -100 }} // Start off-screen
              animate={{ opacity: 1, x: 0 }} // Move to its final position
              transition={{ duration: 0.8, ease: 'easeOut' }} // Add smooth transition
            >
              <Link href="/update-password">
                <div className="p-8">
                  <div className="flex justify-between items-center">
                    <p className='p1 text-grey'>Update Password</p>
                    <div className="bg-[#FFF1DB] h-[80] w-[80] flex flex-col justify-center items-center rounded-xl" style={{width:"80px",height:"80px"}}>
                      <Image src={"/account/key.png"} width={50} height={40} alt="user information" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Card 3 - Delete Account */}
            <motion.div
              className="w-full md:col-span-4 bg-[#FFFFFF] shadowCustomClass rounded-xl"
              initial={{ opacity: 0, x: -100 }} // Start off-screen
              animate={{ opacity: 1, x: 0 }} // Move to its final position
              transition={{ duration: 1, ease: 'easeOut' }} // Add smooth transition
            >
              <div className="cursor-pointer" onClick={() => setShowModal(!showModal)}>
                <div className="p-8">
                  <div className="flex justify-between items-center">
                    <p className='p1 text-grey'>Delete Account</p>
                    <div className="bg-[#FFDCDC] h-[80] w-[80] flex flex-col justify-center items-center rounded-xl" style={{width:"80px",height:"80px"}}>
                      {/* <Image src={"/account/bin_red.png"} width={50} height={40} alt="user information" /> */}
                      <MdDelete  size={55} className='text-red' />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {showModal && (
              <div className="fixed inset-0 flex justify-center items-center" onClick={() => setShowModal(false)}>
                <div ref={modalRef} className="fixed rounded-lg flex border-2 flex-col shadow-xl items-center gap-2 w-1/3 backdrop-blur-xl p-3 md:p-6" style={{ top: "30%", left: "40%" }} onClick={(e) => e.stopPropagation()} >
                  <p className="text-lg font-bold">Are You Sure you want to delete Your Account ?</p>

                  <div className="flex items-center gap-3">
                    <button className="bg-grey text-white px-5 py-2 rounded-md" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="px-8 py-2 text-white rounded-md bg-primary" >Yes</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}

export default page;
