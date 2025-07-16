"use client"

import { motion } from 'framer-motion';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Orders = ({ordersData}) => {

  return (
    <>
        {ordersData && ordersData.length > 0 ? (
      ordersData.map((order, index) => (
        <motion.div
          className="w-full sm-mobile md:col-span-6 border-2 rounded-xl px-2 md:px-5 pt-0 pb-5 flex gap-2 items-start"
          key={index}
          initial={{ opacity: 0, y: 50 }}  // Start with opacity 0 and slightly below the final position
          whileInView={{ opacity: 1, y: 0 }}  // Fade in and slide to the final position
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}  // Stagger the animation
        >
          <Link href={`/orders/${order?.order_id}`} className="w-full">
            <div className="flex flex-col flex-wrap gap-2">
              
              {/* progressbarr */}
              <div className="md:flex md:items-center md:justify-between gap-0">
                <div className="relative size-24 lg:size-36">
                  <svg className="size-full -rotate-90" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="13" fill="none" className="stroke-current text-grey dark:text-neutral-700" strokeWidth="2.7"></circle>
                    <circle cx="21" cy="21" r="13" fill="none" className={`stroke-current ${order.payment_status === 1 ? "text-[#3BB537]" : order.payment_status === 2 ? "text-yellow" : order.payment_status === 0 ? "text-grey" : ""} dark:text-blue-500`} strokeWidth="2.7" strokeDasharray="100" strokeDashoffset={order?.remaining} strokeLinecap="round"></circle>
                  </svg>

                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <span className="text-center text-xl font-bold text-black dark:text-blue-500">{order.payment_status === 1 ? 100 : order.payment_status === 2 ? 50 : 0}%</span>
                  </div>
                </div>
                {order?.payment_status === "paid" ? (
                  <div className="md:mb-16">
                    <button className="bg-green p3 w-[140] h-[35] w-h flex justify-center items-center text-white rounded-full">
                      Get free Credit
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
              
              <div className="flex flex-col flex-wrap gap-2">
                <div className="flex md:items-center gap-2">
                  <span className='fs-18'>Topic:</span>
                  <p className="p3">{order?.topic}</p>
                </div>
                <div className="flex flex-wrap md:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className='fs-18 md:w-[100]'>Paper Type:</p>
                    <p className="p3">{order?.paper_topic}</p>
                  </div>
                  <div className="flex flex-wrap md:items-center gap-2">
                    <span className='fs-18'>Level:</span>
                    <p className="p3">{order?.academic_level}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className='fs-18'>Category:</span>
                    <p className="p3">{order?.category}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className='fs-18'>Pages:</span>
                    <p className="p3">{order?.pages}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start md:justify-between flex-wrap items-center mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex p3 md:items-center gap-3">
                    <span>Order ID:</span> <span>{order?.order_id}</span>
                  </div>
                  <div className="flex p3 items-center gap-3">
                    <span>Order Placed:</span> <span>{order?.orderPlace}</span>
                  </div>
                  <div className="flex md:items-center gap-2">
                    <span className="p2">Deadline:</span>
                    <span className='p3'>30/12/2024</span>
                  </div>
                </div>
                <div className="flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="fs-18">Total Price:</span>
                    <span className="p3">{order?.totalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`p2 ${order?.payment_status === 1 ? "text-green" : "text-red"}`}>Payment Status:</span>
                    <span className={`p3 capitalize ${order?.payment_status === 1 ? "text-green" : "text-red"}`}>{order.payment_status === 1 ? "Paid" : order.payment_status === 0 ? "Unpaid" : "Partially Paid"}</span>
                  </div>
                  {order?.payment_status === 2 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-red">Remaining Amount:</span>
                      <span className="text-red">{Number(order?.balanceamount).toFixed(2)}</span>
                    </div>
                  ) : ""}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))
) : (
  <div className="col-span-12">
    <div className="flex flex-col justify-center items-center">
      <Image src={"/orders/noOrders.svg"} width={382} height={328} alt="" />
      <h2 className="text-[#000000]">You have no orders yet.</h2>
      <p>Order now to have it show up in your list and stay updated on its payment_status.</p>
    </div>
  </div>
)}
    </>
  )
}

export default Orders
