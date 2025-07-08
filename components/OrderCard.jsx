import Link from 'next/link'
import React from 'react'

const OrderCard = ({order}) => {
  return (
    <div className='border-2 p-4 rounded-xl'>
        <Link href={`/orders/${order.id}`} className=" px-2">
            <div className="flex flex-col flex-wrap gap-2">
              
              {/* progressbarr */}
              <div className="md:flex md:items-center md:justify-between gap-0">
                <div className="relative size-24 lg:size-36">
                  <svg className="size-full -rotate-90" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="21" r="13" fill="none" className="stroke-current text-grey dark:text-neutral-700" strokeWidth="2.7"></circle>
                    <circle cx="21" cy="21" r="13" fill="none" className={`stroke-current ${order.status === "paid" ? "text-[#3BB537]" : order.status === "remaining" ? "text-yellow" : order.status === "unpaid" ? "text-grey" : ""} dark:text-blue-500`} strokeWidth="2.7" strokeDasharray="100" strokeDashoffset={order.remaining} strokeLinecap="round"></circle>
                  </svg>

                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <span className="text-center text-xl font-bold text-black dark:text-blue-500">{order.success}%</span>
                  </div>
                </div>
                {order.status === "paid" ? (
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
                  <p className="p3">{order.topic}</p>
                </div>
                <div className="flex flex-wrap md:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className='fs-18 md:w-[100]'>Paper Type:</p>
                    <p className="p3">{order.paperType}</p>
                  </div>
                  <div className="flex flex-wrap md:items-center gap-2">
                    <span className='fs-18'>Level:</span>
                    <p className="p3">{order.level}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className='fs-18'>Category:</span>
                    <p className="p3">{order.category}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className='fs-18'>Pages:</span>
                    <p className="p3">{order.pages}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start md:justify-between flex-wrap items-center mt-3">
                <div className="flex flex-col gap-2">
                  <div className="flex p3 md:items-center gap-3">
                    <span>Order ID:</span> <span>{order.orderId}</span>
                  </div>
                  <div className="flex p3 items-center gap-3">
                    <span>Order Placed:</span> <span>{order.orderPlace}</span>
                  </div>
                  <div className="flex md:items-center gap-2">
                    <span className="p2">Deadline:</span>
                    <span className='p3'>30/12/2024</span>
                  </div>
                </div>
                <div className="flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="fs-18">Total Price:</span>
                    <span className="p3">{order.totalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`p2 ${order.status === "paid" ? "text-green" : "text-red"}`}>Status:</span>
                    <span className={`p3 capitalize ${order.status === "paid" ? "text-green" : "text-red"}`}>{order.status}</span>
                  </div>
                  {order.status === "remaining" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-red">Remaining Amount:</span>
                      <span className="text-red">{order.remaining}</span>
                    </div>
                  ) : ""}
                </div>
              </div>
            </div>
        </Link>
    </div>
  )
}

export default OrderCard
