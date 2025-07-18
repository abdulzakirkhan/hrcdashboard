// src/redux/baseQueryWithReauth.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./auth/authSlice";
import { BASE_URL } from "@/constants/apiUrls";

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Get refresh token from state
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      // Attempt token refresh
      const refreshResult = await baseQuery(
        {
          url: "/api/employee/refreshToken", // Your refresh token endpoint
          method: "POST",
          body: { refreshToken }, // Include the refresh token in the request body
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const {
          accessToken,
          refreshToken: newRefreshToken,
          formattedEmployee,
        } = refreshResult.data;

        // Store the new tokens
        api.dispatch(
          setCredentials({
            user: formattedEmployee,
            token: accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, log the user out
        api.dispatch(logOut());
        api.util.resetApiState();
      }
    } else {
      // No refresh token, log the user out
      api.dispatch(logOut());
      api.util.resetApiState();
    }
  }

  return result;
};

const aa = [
  {
    id: "278164",
    message: "zakir",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:22:29",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278163",
    message: "ssssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:21:45",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278162",
    message: "ssaaa",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:20:50",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278161",
    message: "sssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:14:04",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278160",
    message: "ssssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:13:44",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278159",
    message: "sssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:13:15",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278158",
    message: "sssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:12:42",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278157",
    message: "asasasa",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:10:37",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278156",
    message: "fdfdf",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:09:03",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
  {
    id: "278155",
    message: "ssssss",
    msgfile: "",
    messagefrom: "3751",
    msgstatus: "sent",
    date: "2025-07-08",
    time: "16:04:35",
    transfer: "no",
    replyid: null,
    replymessage: null,
    orderSummary: null,
    is_deleted: "0",
    audio_duration: "0",
  },
];




 <>
            {/* Display Checkout Page if showCheckout is true */}
            {showCheckout ? (
                <div className="mt-20">
                  <button onClick={() => setShowCheckout(false)} className="flex my-4 items-center gap-2 hover:text-[#312E81]"><FaArrowLeftLong /> Back</button>
                  <div className="container">
                    <h2>Select Payment Method</h2>
                    <div className="grid md:grid-cols-3 gap-4 py-12">



                      {/* Display Selected Card Info */}
                      {selectedCard ? (
                        <div className="w-full md:col-span-12">
                          <div className="grid md:grid-cols-12 gap-6">
                            <div className="w-full md:col-span-6 border-2 p-4 rounded-lg">
                              <div className="flex justify-between items-center" onClick={() => handleTabSwitch('Full','wallet')}>
                                <div className="flex items-center gap-3">
                                  <p>Full Payment</p>
                                  <span className="text-xs text-grey">(Pay Full amount)</span>
                                </div>

                                <div className="">
                                  <label className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="wallet"
                                        checked={selectedCard === 'wallet'}
                                        onChange={() => handleCardSelect('wallet')}
                                        className="h-4 w-4"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="w-full md:col-span-6 border-2 p-4 rounded-lg flex justify-between items-center" onClick={() => handleTabSwitch('Partial','partial')}>
                                <div className="flex items-center gap-3">
                                  <p>partial Payment</p>
                                  <span className="text-xs text-grey">(Enter amount you want to pay)</span>
                                </div>

                                <div className="">
                                  <label className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="partial"
                                        checked={selectedCard === 'partial'}
                                        onChange={() => handleCardSelect('partial')}
                                        className="h-4 w-4"
                                    />
                                  </label>
                                </div>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-12 justify-center items-center mt-12">
                            {activeTab === 'Full' && (
                              <div className='w-full md:col-span-6 flex flex-col gap-4'>
                                <div className="border-2 rounded-xl p-5">
                                  <h1>Order Summary</h1>
                                  <div className="flex gap-6 mt-5 items-center">
                                    <p className="text-sm text-grey">Price :</p>
                                    <p className="text-grey">{order.totalPrice}</p>
                                  </div>
                                  <div className="flex gap-6 mt-2 items-center">
                                    <p className="text-sm text-grey">Processing Fee (4%) :</p>
                                    <p className="text-grey">$0.04</p>
                                  </div>
                                  <div className="flex gap-6 mt-2 items-center">
                                    <p className="text-sm text-grey">VAT (20%) :</p>
                                    <p className="text-grey">$0.20</p>
                                  </div>
                                  <div className="flex gap-6 mt-2 items-center">
                                    <p className="text-sm text-grey">Payment Method:</p>
                                    <p className="text-grey">Payment Gateway</p>
                                  </div>
                                  <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                                    <p className="text-primary">Payable Amount:</p>
                                    <p className="text-primary">{order.totalPrice}</p>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <button type='button' className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab("summary")}>Pay Now</button>
                                </div>
                              </div>
                            )}

                            {activeTab === 'Partial' && (
                              <div className="w-full md:col-span-6">
                                <div className="">
                                  <input
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="border w-full py-2 px-4 my-2 rounded-md outline-none"
                                  />
                                  <div className="border-2 rounded-xl p-5">
                                    <h1>Order Summary</h1>
                                    <div className="flex gap-6 mt-5 items-center">
                                      <p className="text-sm text-grey">Price :</p>
                                      <p className="text-grey">{order.totalPrice}</p>
                                    </div>
                                    <div className="flex gap-6 mt-2 items-center">
                                      <p className="text-sm text-grey">Processing Fee (4%) :</p>
                                      <p className="text-grey">${processingFee}</p>
                                    </div>
                                    <div className="flex gap-6 mt-2 items-center">
                                      <p className="text-sm text-grey">VAT (20%) :</p>
                                      <p className="text-grey">${vatFee}</p>
                                    </div>
                                    <div className="flex gap-6 mt-2 items-center">
                                      <p className="text-sm text-grey">Payment Method:</p>
                                      <p className="text-grey">Payment Gateway</p>
                                    </div>
                                    <div className="flex justify-end font-bold gap-6 mt-2 items-center">
                                      <p className="text-primary">Payable Amount:</p>
                                      <p className="text-primary">{totalAmount}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center py-4">
                                  {/* <button type='button' className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab(true)}>Pay Now</button> */}
                                  <button type='button' className="text-white px-6 py-2 rounded-lg bg-primary" onClick={() => setSummaryTab("summary")}>Pay Now</button>
                                </div>
                             </div>
                            )}

                            {activeTab === 'Payment' && (
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <p>Payment</p>
                                  <span className="text-xs text-grey">(Make Partial Payment)</span>
                                </div>

                                <div>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="paymentMethod"
                                      value="wallet"
                                      checked={selectedCard === 'wallet'}
                                      onChange={() => handleCardSelect('wallet')}
                                      className="h-4 w-4"
                                    />
                                    <span className="text-grey">Wallet</span>
                                  </label>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      ) : 
                      <>
                       <div className="w-full">
                        <p className="text-sm text-grey py-2">Recommended Method(s)</p>

                        <div
                              className={`flex justify-between border-2 h-48 rounded-xl p-5 ${selectedCard === 'wallet' ? 'border-blue-500' : ''}`}
                              onClick={() => handleCardSelect('wallet')}
                            >
                              <div>
                                <div className="flex gap-2 items-center">
                                  <FaWallet size={30} className="text-primary" />
                                  <p className="p1 text-grey">Wallet</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-green">Available:</span>
                                  <span className="text-green">{order?.totalPrice}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Reward Amount:</span>
                                  <span className="text-sm text-gray-600">$0.05</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Wallet Amount:</span>
                                  <span className="text-sm text-gray-600">$0.00</span>
                                </div>
                              </div>
                              <div>
                                <label className="flex items-center cursor-pointer relative">
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="opacity-0 absolute" // Hides the default checkbox
                                  />
                                  <span 
                                    className={`w-12 h-6 bg-gray-300 rounded-full relative transition-all duration-300 
                                      ${isChecked ? 'bg-primary' : ''}`}
                                  >
                                    <span 
                                      className={`w-6 h-6 bg-white rounded-full absolute top-0 left-0 transition-all duration-300 
                                        ${isChecked ? 'translate-x-6' : ''}`}
                                    ></span>
                                  </span>
                                </label>
                              </div>
                        </div>

                      </div>

                      <div className="md:py-8 w-full">
                        <div
                          className={`md:py-8 w-full border-2 h-48 rounded-xl px-5 py-3 ${selectedCard === 'bank' ? 'border-blue-500' : ''}`}
                          onClick={() => handleCardSelect('bank')}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <MdPayments size={38} className="text-primary" />
                              <p className="p1 text-grey">Bank Transfer</p>
                            </div>
                            <div>
                              <FaCircleInfo size={30} className="text-primary " />
                            </div>
                          </div>
                          <div className="ps-4">
                            <div className="flex justify-between items-center">
                              <span className="text-grey text-sm">Price:</span>
                              <span className="text-grey text-sm">{order.totalPrice}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-grey text-sm">Processing fee (4%):</span>
                              <span className="text-grey text-sm">$0.40</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-grey text-sm line-through">VAT (20%):</span>
                              <span className="text-grey text-sm">$0.40</span>
                            </div>
                            <div className="text-end mt-3">
                              <span className="text-lg text-primary">Total : {order.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="md:py-8 w-full">
                        <div
                            className={`md:py-8 w-full border-2 h-48 rounded-xl px-5 py-3 ${selectedCard === 'stripe' ? 'border-blue-500' : ''}`}
                            onClick={() => handleCardSelect('stripe')}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="35" height="35">
                                  <circle cx="50" cy="50" r="45" fill="#312E81" />
                                  <text x="50" y="55" fontFamily="Arial" fontSize="20" fill="white" textAnchor="middle">STRIPE</text>
                                  <text x="50" y="55" fontFamily="Arial" fontSize="20" fill="white" textAnchor="middle">STRIPE</text>
                                </svg>
                                <p className="p1 text-grey">Payment Gateway</p>
                              </div>
                              <div>
                                <FaCircleInfo size={30} className="text-primary " />
                              </div>
                            </div>
                            <div className="ps-4">
                              <div className="flex justify-between items-center">
                                <span className="text-grey text-sm">Price:</span>
                                <span className="text-grey text-sm">{order.totalPrice}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-grey text-sm">Processing fee (4%):</span>
                                <span className="text-grey text-sm">$0.40</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-grey text-sm">VAT (20%):</span>
                                <span className="text-grey text-sm">$2.00</span>
                              </div>
                              <div className="text-end mt-3">
                                <span className="text-lg text-primary">Total : {order.totalPrice}</span>
                              </div>
                            </div>
                        </div>
                      </div>
                      </>
                      }
                    </div>
                  </div>

                    
                </div>
            ) : (
                <section className="mt-20">
                    <div className="container mx-auto md:px-6 pb-10">
                        <div>
                            <motion.div
                                className="md:w-full md:col-span-8"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div
                                    className={`bg-no-repeat bg-center md:w-full bg-cover flex justify-center items-center rounded-tl-2xl ${order?.orderstatus === "unpaid" ? "min-h-32 px-4" : ""} rounded-tr-2xl`}
                                    style={{
                                        height: `${order?.orderstatus === "unpaid" ? "300px" : ""}`,
                                        backgroundImage: `url(${order.orderstatus === "paid" ? "/orders/banner.svg" : order?.orderstatus === "remaining" ? "/orders/yellobanner.svg" : "/orders/red.svg"})`
                                    }}
                                >
                                    <div className="grid w-full px-8 md:grid-cols-12 justify-between items-center">
                                        {order?.orderstatus === "paid" || order?.orderstatus === "remaining" ? (
                                            <>
                                                <motion.div
                                                    className="w-full md:col-span-6 mt-5 md:mt-0"
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    transition={{ duration: 0.6, delay: 0.2 }}
                                                >
                                                    <h2>Completed</h2>
                                                    <p className="fs-25">Your Order has been Completed!</p>
                                                </motion.div>
                                                <motion.div
                                                    className="w-full md:col-span-6 flex justify-end"
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    transition={{ duration: 0.6, delay: 0.4 }}
                                                >
                                                    <div className="relative size-36 md:size-60">
                                                        <svg className="size-full -rotate-90" viewBox="2 0 37 37" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="21" cy="22" r="13" fill="none" className="stroke-current text-grey dark:text-neutral-700" strokeWidth="2.7"></circle>
                                                            <circle cx="21" cy="22" r="13" fill="none" className={`stroke-current ${order?.orderstatus === "paid" ? "text-[#3BB537]" : order.orderstatus === "remaining" ? "text-yellow" : order.orderstatus === "unpaid" ? "text-grey" : ""} dark:text-blue-500`} strokeWidth="2.7" strokeDasharray="100" strokeDashoffset={order.remaining} strokeLinecap="round"></circle>
                                                        </svg>
                                                        <div className="absolute top-1/2 right-0 md:right-10 transform -translate-y-1/2 -translate-x-1/2">
                                                            <span className="text-center text-2xl font-bold text-black dark:text-blue-500">{order?.success}%</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </>
                                        ) : (
                                            <motion.p
                                                className="w-full md:col-span-12 flex gap-2"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ duration: 0.6, delay: 0.5 }}
                                            >
                                                <span>Note:</span> Please complete the payment to proceed with your order. Work on your order will only begin once the payment is confirmed.
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Details Section */}
                                <motion.div
                                    className="flex wrap px-3 justify-between items-start py-3 mt-9"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                >
                                    <div className="flex p3 items-center gap-3">
                                        <span className="font-bold">Order ID:</span> <span className="font-semibold">{order?.orderId}</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex p3 items-center gap-3">
                                            <span>Order placed:</span> <span>{order?.orderPlace}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="p2">Deadline:</span>
                                            <span className="p3">30/12/2024</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div
                                    className="flex justify-center items-center mt-5"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.6 }}
                                >
                                    <div className="flex wrap gap-3 items-center">
                                        {order?.orderstatus === "paid" ? (
                                            <button className="btnText mx-2 text-white bg-primary flex justify-center items-center gap-3 rounded-md w-219 w-[219] h-[40]">
                                                <Image src={"/orders/meeting.svg"} width={13} height={16} alt="" />
                                                Schedule Meeting
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleProceedToPay}
                                                className="btnText text-white flex justify-center items-center bg-primary rounded-md w-[219] w-219 h-[40]"
                                            >
                                                Proceed to Pay
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}
        </>













  const onFileChange = (e) => {
    const files = e.target.files;
    console.log("files:", e);

    // return
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).map((file) => ({
      uri: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));

     const nonImageFiles = fileArray.filter((file) => !file.type.startsWith("image/"));
    

      console.log("📂 fileArray:", fileArray);

    // Check if the first file is an image (you can also do per-file if needed)
    const isImage = files[0].type.startsWith("image");

    if (isImage) {
      setSelectedImage(fileArray);
      setPayloadImages(Array.from(files))
    } else {
      setSelectPdf(nonImageFiles);
    }

    // ✅ Reset input to allow selecting the same file again
    e.target.value = "";
  };

































   console.log("brachUrl",brachUrl)
    const generateLinks = async () => {
      try {
        // ✅ Initialize only once
        if (!Branch.initialized) {
          Branch.init(brachUrl); // Use your real public Branch key
        }
  
        // Branch data payload
        const data = {
          canonicalIdentifier: "referral",
          title: "Hybrid Research Center",
          contentDescription: "Install this app using my referral link.",
          contentMetadata: {
            customMetadata: {
              userId: user?.userid,
            },
          },
        };
  
        // Link options
        const linkData = {
          data,
          feature: "referral",
          channel: "web",
          // Optional: redirect URLs
          $fallback_url: "https://www.hybridresearchcenter.com/",
        };
  
        // Generate link
        branch.link(linkData, (err, url) => {
          if (err) {
            console.error("Branch link error:", err);
          } else {
            console.log("Generated Branch link:", url);
            setLink(url); // Set the generated link in state
          }
        });
      } catch (error) {
        console.error("Error generating Branch link:", error);
      }
    };
  
    useEffect(() => {
      generateLinks();
    }, []);