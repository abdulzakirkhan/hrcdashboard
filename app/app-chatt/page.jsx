"use client";
import { RxCross2 } from "react-icons/rx";
import {
  useGetAllChatsQuery,
  useInsertClientMesageThroughAppMutation,
  useSeenAllMessagesMutation,
} from "@/redux/chat/chatApi";
import { useGetUserCurrencyAndCountryQuery } from "@/redux/order/ordersApi";
import pusher from "@/utils/pusher";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPaperclip, FaMicrophone, FaTelegramPlane } from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";
import { format, isToday, isYesterday, parseISO } from "date-fns";
const ChatPage = () => {
  const dummyData = [
    {
      sender: "Customer",
      content: "Hello, I need help with my order.",
      date: "2025-01-20 11:17:03",
    },
    {
      sender: "Support",
      content:
        "Sure, I'd be happy to assist you. What seems to be the problem?",
      date: "2025-01-20 11:17:03",
    },
    {
      sender: "Customer",
      content: "I haven't received my item yet.",
      date: "2025-01-20 11:17:03",
    },
    {
      sender: "Support",
      content: "Let me check your order status.",
      date: "2025-01-20 11:17:03",
    },
  ];
  const user = useSelector((state) => state.auth?.user);
  const [page, setPage] = useState(0);
  // State to manage the message input and chat history
  const [message, setMessage] = useState("");
  const [messageIdToReply, setMessageIdToReply] = useState();
  const [selectedDocmunet, setSelectedDocument] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const {
    data: getAllChats,
    isLoading: getAllChatLoading,
    refetch: getAllChatsReftech,
    isFetching: getAllChatsFeching,
  } = useGetAllChatsQuery({
    id: user?.userid,
    page,
  });
  const [insertMesage, { isLoading: insertMessageLoading }] =
    useInsertClientMesageThroughAppMutation();

  const currencyForm = new FormData();
  currencyForm.append("clientid", user?.userid);
  const { data: userCurrencyAndCountry } =
    useGetUserCurrencyAndCountryQuery(currencyForm);
  const [messages, setMessages] = useState(getAllChats?.result || []);
  const [userCurrencyToSend, setUserCurrencyToSend] = useState();
  const [searchFilterData, setSearchFilterData] = useState();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [allchats, setAllChats] = useState();
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [sudoName, setSudoName] = useState("Customer Support");



  // Sort by date first, then time (ascending = oldest to newest)
  const sortedMessages = [...messages].sort((a, b) => {
    const aDateTime = new Date(`${a.date}T${a.time}`);
    const bDateTime = new Date(`${b.date}T${b.time}`);
    return aDateTime - bDateTime; // ascending
  });
  const groupedMessages = sortedMessages.reduce((groups, message) => {
    const parsed = parseISO(message.date); // Ensure it's a valid Date
    const dateKey = format(parsed, "yyyy-MM-dd"); // Normalize to 'YYYY-MM-DD'

    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(message);

    return groups;
  }, {});

  // Handle new message input
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };


  // Handle file input change
  const fileInputRef = useRef(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const [payloadImages, setPayloadImages] = useState()

  // Handle file selection
  // This function will be called when the user selects a file
  const onFileChange = (e) => {
    const files = e.target.files;
    console.log("files:", files);

    // return
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).map((file) => ({
      uri: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));
    

    console.log("📂 fileArray:", fileArray);

    // Check if the first file is an image (you can also do per-file if needed)
    const isImage = files[0].type.startsWith("image");

    if (isImage) {
      setSelectedImage(fileArray);
      setPayloadImages(Array.from(files))
    } else {
      setSelectedDocument(fileArray);
    }

    // ✅ Reset input to allow selecting the same file again
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    if (selectedImage && selectedImage.length > 0) {
      const updatedImages = [...selectedImage];
      updatedImages.splice(index, 1); // Remove the image at the specified index
      setSelectedImage(updatedImages); // Update state with the new array
    }
  }


  console.log("payloadImages",payloadImages?.length);
  // payloadImages.map((file) => {
  //   console.log("📂 file:", file);
  // });
  // Add a new message to the chat
  const handleSendMessage = async () => {
    setSearchFilterData(undefined);
    setCurrentItemIndex(0);
    setCurrentSectionIndex(0);
    const body = new FormData();

    body.append("clientid", user?.userid);

    if(payloadImages.length > 0){
      payloadImages.forEach((file) => {
        body.append("filemsg[]", file);
      });
    }else{
      body.append("msg", message.trim());
      body.append("currency", userCurrencyToSend);
    }

    // stoping api call
    for (let [key, value] of body.entries()) {
      console.log(`${key}:`, value);
    }

    // return;
    const res = await insertMesage(body);
    const { error, data: respData } = res || {};
    if (error) {
      toast.error("Something went wrong.");
    }
    setMessage("");
    setSelectedImage(); // Reset selected image after sending
    setPayloadImages([])
  };

  const [seenAllMessages] = useSeenAllMessagesMutation();
  const handleSeenAllMessages = async () => {
    await seenAllMessages({ userId: user?.userid });
  };

  useEffect(() => {
    if (getAllChats?.result) {
      setMessages(getAllChats?.result);
    }
  }, [getAllChats]);

  const userCurrency = userCurrencyAndCountry?.result?.currency;

  const isFocusedRef = useRef(false);
  // 7a130211dc840dcf7005

  useEffect(() => {
    // console.log("⏳ Subscribing to Pusher...");
    const channel = pusher.subscribe("demo_pusher");

    pusher.connection.bind("connected", () => {
      console.log("✅ Pusher connected!");
    });

    pusher.connection.bind("error", (err) => {
      console.error("❌ Pusher connection error:", err);
    });

    channel.bind_global((eventName, data) => {
      // console.log("📨 New message received:", eventName, data);
      let message = data.message;

      // let msg = message.msg;
      let msgfrom = message?.msgfrom;
      let responseTo = message?.respondTo;
      let obj = {
        id: message?.mid,
        message: message?.msg,
        msgfile: message?.msgfile,
        messagefrom: message?.msgfrom,
        orderSummary: message?.orderSummary,
        msgstatus: message?.msgstatus,
        date: message?.msgdate,
        time: message?.tsdate,
        transfer: "",
        respondTo: responseTo,
      };

      if (msgfrom == user?.userid || message?.msgto == user?.userid) {
        setMessages((prevChats) => [...prevChats, obj]);
        setRealTimeMessages((prevMessages) => [...prevMessages, obj]);
        setSudoName(message?.sudoname);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);


  // Load more data when the user scrolls to the top
  const loadMoreData = async () => {
    setPage(messages[messages?.length - 1]?.id);
  };

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // Handle scroll event to load more data when scrolled to the top
  const onScrollEnd = (e) => {
    const target = e.target;
    const scrollTop = target.scrollTop;
    if (scrollTop === 0) {
      loadMoreData();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" }); // or "smooth"
    }
  }, []);

  // console.log("getAllChats:", getAllChats);
  return (
    <>
      <section className="mt-20">
        {/* Header */}
        <div className="bg-[#4B67DB] fixed w-full top-[75px] z-10">
          <div className="container mx-auto px-6 py-2">
            <h2 className="text-white">Customer Support</h2>
          </div>
        </div>

        {/* Chat container */}
        <div className="container mt-28 md:mt-14 mx-auto md:px-6">
          <div
            className="messagesContainer flex flex-col overflow-y-auto h-[70vh] py-10 space-y-6"
            ref={containerRef}
            onScroll={(e) => onScrollEnd(e)}
          >
            {Object.entries(groupedMessages).map(([date, msgs]) => {
              const parsedDate = parseISO(date); // "2025-07-08" -> Date object
              const displayDate = isToday(parsedDate)
                ? "Today"
                : isYesterday(parsedDate)
                ? "Yesterday"
                : format(parsedDate, "dd MMM yyyy");

              return (
                <div key={date}>
                  {/* 🗓️ Date separator */}
                  <div className="text-center my-4">
                    <span className="bg-gray-300 text-gray-800 px-4 py-1 rounded-full text-sm font-medium">
                      {displayDate}
                    </span>
                  </div>

                  {/* 💬 Messages */}
                  {msgs.map((msg, index) => (
                    <div key={index} className="mb-4">
                      <div
                        className={`flex ${
                          msg.messagefrom == user?.userid
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`p-3 max-w-[60%] rounded-lg ${
                            msg.messagefrom == user?.userid
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <p>{msg.message}</p>
                        </div>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          msg.messagefrom == user?.userid
                            ? "text-blue-500 text-start"
                            : "text-gray-500 text-end"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area fixed at the bottom */}
        <div className="fixed bottom-0 w-full lg:w-[calc(100%-208px)] bg-white py-4 border-t-2">
          <div className="flex w-full items-center gap-3 pe-8">
            <div className="relative ">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => onFileChange(e)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                multiple
              />

              {/* Visible trigger button */}
              <button className="bg-primary py-2 px-3 rounded-lg text-white" onClick={handleButtonClick}>
                <FaPaperclip className="text-2xl cursor-pointer" />
              </button>
            </div>

            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type a message..."
              className="w-1/2 md:w-[73%] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-primary py-2 px-3 rounded-lg text-white">
              <FaMicrophone className="text-2xl cursor-pointer" />
            </button>
            <button
              className="bg-primary flex items-center gap-2 px-6 py-2 rounded-lg text-white"
              onClick={handleSendMessage}
            >
              Send
              <FaTelegramPlane className="text-2xl cursor-pointer" />
            </button>

            {selectedImage?.length > 0 && (
                <div className={`absolute ${selectedImage?.length === 1 ? "w-1/3" : "w-1/2"} h-44 -top-52 left-[20%] bg-white p-2 rounded-lg shadow-lg`}>
                  {selectedImage.map((img, index) => (
                    <div className={`shadow-lg relative border-2 border-gray-300 rounded-md ${selectedImage.length === 1 ? "w-1/2 h-full" : "w-32 h-16"} `} key={index}>
                      <img
                        key={index}
                        src={img.uri}
                        alt={`Selected ${index}`}
                        className={`object-cover rounded-md object-center mb-2 ${selectedImage?.length === 1 ? "w-full" : "w-full"} h-full`}
                      />
                      <RxCross2 size={26} className="absolute -top-2 -right-3 cursor-pointer hover:text-rose-600" onClick={() => handleRemoveImage(index)} />
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatPage;
