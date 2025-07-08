"use client"
import React from 'react'
import Orders from '@/components/Orders'
import { ordersData } from '../data'
import OrderCard from '@/components/OrderCard'
const page = () => {
  return (
    <>
    <section className="mt-12">

      <div className="container mx-auto">
        <h1 className="md:px-4 py-8">Orders</h1>
        <div className="grid md:grid-cols-12 lg:w-full gap-12">
          <Orders />
        </div>



        {/* <div className="flex items-center flex-wrap gap-6">
          {ordersData.map((order,index) => (
            <OrderCard key={index} order={order}  />
          ))}
        </div> */}
      </div>  
    </section>
    </>
  )
}

export default page
