"use client";

import React, {  useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import CustomerSupportModal from './CustomerSupport';

// Different modal components for each payment method
const FullPaymentModal = ({ showModal, onClose }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-primary flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
          <button
            onClick={onClose}
            className="bg-[#FFFFFF] w-[25] h-[25] rounded-full flex justify-center items-center"
          >
            <Image src={"/orders/close.svg"} width={12} height={13} alt="" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
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
                <span className='text-red'>-$50:00</span>
            </div>
            <div className="flex justify-between items-center">
                <p className='text-primary'>Paying amount:</p>
                <span className='text-primary'>$19:00</span>
            </div>
            <div className="flex justify-between items-center">
                <p className='text-green'>Remainging amount:</p>
                <span className='text-green'>$40:00</span>
            </div>


            <div className="flex justify-center  items-center py-4">

             <button className='w-[159] h-[40] bg-primary text-center text-white rounded-md'>Pay Now</button>
            </div>


        </div>
      </div>
    </div>
  );
};

const PartialPaymentModal = ({ showModal, onClose }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-primary flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
          <button
            onClick={onClose}
            className="bg-[#FFFFFF] w-[25] h-[25] rounded-full flex justify-center items-center"
          >
            <Image src={"/orders/close.svg"} width={12} height={13} alt="" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
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
                    <span className='text-red'>-$50:00</span>
                </div>
                <div className="flex justify-between items-center">
                    <p>Subtotal:</p>
                    <span className=''>$59:00</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className='text-primary'>Partial payment (20%):</p>
                    <span className='text-primary'>$11:00</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className='text-green'>Remaining amount:</p>
                    <span className='text-green'>$47:02</span>
                </div>


                <div className="flex justify-center  items-center py-4">

                <button className='w-[159] h-[40] bg-primary text-center text-white rounded-md'>Pay Now</button>
                </div>


            </div>
        </div>


    </div>
  );
};

const OtherAmountModal = ({ showModal, onClose }) => {
  
  
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-primary flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
          <button
            onClick={onClose}
            className="bg-[#FFFFFF] w-[25] h-[25] rounded-full flex justify-center items-center"
          >
            <Image src={"/orders/close.svg"} width={12} height={13} alt="" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
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
                    <span className='text-red'>-$50:00</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className='text-primary'>paying amount (20%):</p>
                    <span className='text-primary'>$19:00</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className='text-green'>Remaining amount:</p>
                    <span className='text-green'>$40:02</span>
                </div>


                <div className="flex justify-center  items-center py-4">

                <button className='w-[159] h-[40] bg-primary text-center text-white rounded-md'>Pay Now</button>
                </div>


            </div>
        </div>
    </div>
  );
};
const NegotiateModal = ({ showModal, onClose }) => {
    const [showContactModal, setShowContactModal] = useState(false); // State to control customer support modal
  
    const handleClick = () => {
      setShowContactModal(true); // Show the customer support modal when "Contact Now" is clicked
    };
  
    if (!showModal) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="bg-primary flex justify-end py-4 rounded-tl-lg rounded-tr-lg">
            <button onClick={onClose} className="bg-[#FFFFFF] w-[25px] h-[25px] rounded-full flex justify-center items-center">
              <Image src="/orders/close.svg" width={12} height={13} alt="Close" />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p>Payment Method:</p>
              <span>Stripe</span>
            </div>
            <div className="flex justify-between items-center">
              <p>Price:</p>
              <span>$100:00</span>
            </div>
            <div className="flex justify-between items-center">
              <p>Processing Fee (4%):</p>
              <span>$4:00</span>
            </div>
            <div className="flex justify-between items-center">
              <p>VAT (5%):</p>
              <span>$5:00</span>
            </div>
            <div className="flex justify-between items-center">
              <p>Wallet:</p>
              <span className="text-red">-$50:00</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-green">Remaining Amount:</p>
              <span className="text-green">$40:02</span>
            </div>
  
            <div className="flex justify-center items-center py-4">
              <button
                onClick={handleClick}
                className="w-[159px] h-[40px] bg-primary text-center text-white rounded-md"
              >
                Contact Now
              </button>
            </div>
          </div>
        </div>
  
        {/* Customer Support Modal */}
        <CustomerSupportModal
          showModal={showContactModal}
          onClose={() => setShowContactModal(false)} // Close the support modal
        />
      </div>
    );
  };

const CheckBoxs = () => {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedPayment, setSelectedPayment] = useState(''); // Store selected payment method
  // Handle form submission
  const handleSubmit = (values) => {
    setSelectedPayment(values.paymentMethod); // Set the selected payment method
    setShowModal(true); // Show the modal after submission
  };
  return (
    <div>
      <Formik
        initialValues={{
          paymentMethod: '', // This holds the selected payment method
        }}
        validationSchema={Yup.object({
          paymentMethod: Yup.string().required('You must select a payment method'), // Validation for selecting a method
        })}
        onSubmit={handleSubmit} // Use handleSubmit function to control modal visibility
      >
        {({ errors, touched }) => (
          <Form>
            <div className="space-y-4">
              <p>How would you like to pay?</p>

              <div className="md:flex justify-between items-center">
                <div className="w-full md:w-1/2 flex items-center">
                  <label htmlFor="fullPayment" className="mr-2">
                    Full payment <span className="text-grey">(pay full Amount)</span>
                  </label>
                  <Field
                    type="radio"
                    id="fullPayment"
                    name="paymentMethod"
                    value="fullPayment"
                    className="checkbox-style"
                  />
                </div>

                <div className="w-full md:w-1/2 flex items-center">
                  <label htmlFor="partialPayment" className="mr-2">
                    Partial payment (Pay 20% of total amount)
                  </label>
                  <Field
                    type="radio"
                    id="partialPayment"
                    name="paymentMethod"
                    value="partialPayment"
                    className="checkbox-style"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label htmlFor="otherAmount" className="mr-2">
                  Other amount <span className="text-grey">(enter amount you want to pay)</span>
                </label>
                <Field
                  type="radio"
                  id="otherAmount"
                  name="paymentMethod"
                  value="otherAmount"
                  className="checkbox-style"
                />
              </div>

              <div className="w-full h-[1px] bg-grey rounded-lg my-4"></div>

              <div className="py-3">
                <p>Other Method</p>
                <div className="flex items-center">
                  <label htmlFor="negotiatePrice" className="mr-2">
                    Negotiate price <span className="text-grey">(discuss with sales team)</span>
                  </label>
                  <Field
                    type="radio"
                    id="negotiatePrice"
                    name="paymentMethod"
                    value="negotiatePrice"
                    className="checkbox-style"
                  />
                </div>

                {errors.paymentMethod && touched.paymentMethod && (
                  <div className="text-red-500 text-sm">{errors.paymentMethod}</div>
                )}
              </div>

              <div className="mt-4 flex justify-center items-center">
                <button
                  type="submit"
                  className="btnText text-white bg-primary flex justify-center items-center gap-3 rounded-md w-[159px] h-[40px]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>


      {/* Conditionally render modal based on the payment method */}
      {selectedPayment === 'fullPayment' && (
        <FullPaymentModal showModal={showModal} onClose={() => setShowModal(false)} />
      )}
      {selectedPayment === 'partialPayment' && (
        <PartialPaymentModal showModal={showModal} onClose={() => setShowModal(false)} />
      )}
      {selectedPayment === 'otherAmount' && (
        <OtherAmountModal showModal={showModal} onClose={() => setShowModal(false)} />
      )}
      {selectedPayment === 'negotiatePrice' && (
        <NegotiateModal showModal={showModal} onClose={() => setShowModal(false)} />
      )}
      
    </div>
  );
};

export default CheckBoxs;
