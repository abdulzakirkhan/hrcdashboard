"use client";
import { RxCross1, RxCross2 } from "react-icons/rx";
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
import {
  FaPaperclip,
  FaMicrophone,
  FaTelegramPlane,
  FaFileAudio,
} from "react-icons/fa"; // Import icons
import { useSelector } from "react-redux";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import voiceButtonAnimation from "../../constants/voiceButtonAnimation.json";
import Lottie from "lottie-react";
import { AiOutlineAudio } from "react-icons/ai";
import { baseUrl } from "@/config";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

import mammoth from "mammoth";
import { DateTime } from "luxon";
const ChatPage = () => {
  const user = useSelector((state) => state.auth?.user);
  const [page, setPage] = useState(0);
  // State to manage the message input and chat history
  const [message, setMessage] = useState("");
  const [messageIdToReply, setMessageIdToReply] = useState();
  const [selectedDocmunet, setSelectedDocument] = useState();
  const [selectPdf, setSelectPdf] = useState([]);
  const [selectedPdfPreview, setSelectedPdfPreview] = useState([]);
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
  const [isVoiceStart, setIsVoiceStart] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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

  const [payloadImages, setPayloadImages] = useState();
  const [docxFiles, setDocxFiles] = useState([])
  // Handle file selection
  // This function will be called when the user selects a file
const [docxHtml, setDocxHtml] = useState("");
  const onFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Generate preview for all files
    const previewArray = fileArray.map((file) => ({
      uri: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));

    const docxFilesArr = fileArray.filter(
    (file) =>
      file.name.toLowerCase().endsWith(".docx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if(docxFilesArr?.length > 0) {
      setDocxFiles(docxFilesArr)
    }

    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );
    const pdfFiles = fileArray.filter(
      (file) => file.type === "application/pdf"
    );


    if (imageFiles.length > 0) {
      const imagePreview = imageFiles.map((file) => ({
        uri: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
      }));

      setSelectedImage(imagePreview);
      setPayloadImages(imageFiles);
    }

    if (pdfFiles.length > 0) {
      setSelectPdf(pdfFiles); // ✅ This is now a list of actual PDF `File` objects
      setSelectedPdfPreview(pdfFiles);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    if (selectedImage && selectedImage.length > 0) {
      const updatedImages = [...selectedImage];
      updatedImages.splice(index, 1); // Remove the image at the specified index
      setSelectedImage(updatedImages); // Update state with the new array
    }
  };
useEffect(() => {
  const reader = new FileReader();
  if (docxFiles[0]) {
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxHtml(result.value); // HTML content
    };
    reader.readAsArrayBuffer(docxFiles[0]);
  }
}, [docxFiles]);



  // Add a new message to the chat
  const handleSendMessage = async () => {
    setSearchFilterData(undefined);
    setCurrentItemIndex(0);
    setCurrentSectionIndex(0);
    if (message === "" && payloadImages?.length < 1 && selectPdf?.length < 1 && docxFiles?.length < 1) {
      return;
    }
    const body = new FormData();
    body.append("clientid", user?.userid);
    if (selectPdf?.length > 0) {
      body.append("filemsg[]", selectPdf[0]);
    }

    if(docxFiles?.length > 0){
      body.append("filemsg[]", docxFiles[0]);
    }

    if (payloadImages?.length > 0) {
      payloadImages.forEach((file) => {
        body.append("filemsg", file);
      });
    } else if (recordedBlob) {
      body.append("filemsg", recordedBlob, "voice.webm");
    } else {
      body.append("msg", message.trim());
      body.append("currency", userCurrencyToSend);
    }

    // stoping api call
   

    // return;
    const res = await insertMesage(body);
    const { error, data: respData } = res || {};
    if (error) {
      toast.error("Something went wrong.");
    }
    setRecordedBlob(null);
    setMessage("");
    setSelectedImage();
    setPayloadImages([]);
    setSelectPdf([]);
    setDocxFiles([])
    setDocxHtml("")
  };

  const [seenAllMessages] = useSeenAllMessagesMutation();
  const handleSeenAllMessages = async () => {
    await seenAllMessages({ userId: user?.userid });
  };

  const userCurrency = userCurrencyAndCountry?.result?.currency;

  const isFocusedRef = useRef(false);
  // 7a130211dc840dcf7005

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


  const handleVoiceRecording = async () => {
    if (!isVoiceStart) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setRecordedBlob(blob);
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsVoiceStart(true);
      } catch (err) {
        console.error("Microphone access denied or error", err);
      }
    } else {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsVoiceStart(false);
    }
  };

  useEffect(() => {
    if (getAllChats?.result) {
      setMessages(getAllChats?.result);
    }
  }, [getAllChats]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" }); // or "smooth"
    }
  }, [messages]);

  useEffect(() => {
    const channel = pusher.subscribe("demo_pusher");

    pusher.connection.bind("connected", () => {
      console.log("✅ Pusher connected!");
    });

    pusher.connection.bind("error", (err) => {
      console.error("❌ Pusher connection error:", err);
    });

    channel.bind_global((eventName, data) => {
      let message = data.message;
      const isAudio =
        typeof message?.msg === "string" &&
        message.msg.startsWith("http") &&
        message?.type === "audio";
      let msgfrom = message?.msgfrom;
      let responseTo = message?.respondTo;
    
      let obj = {
        id: message?.mid,
        message: message?.msg,
        type: message?.type || "text",
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

  const isAudioFile = (value) => {
    return (
      typeof value === "string" &&
      /\.(mp3|wav|m4a|ogg|webm)$/i.test(value.trim())
    );
  };

  const isPngFile = (value) => {
    if (!value || typeof value !== "string") return false;
    return /\.png$/i.test(value.trim());
  };

  const isPdfFile = (value) => {
    if (!value || typeof value !== "string") return false;
    return /\.pdf$/i.test(value.trim());
  };

  const getAudioMimeType = (filename) => {
    if (!filename) return "audio/mpeg";
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "mp3":
        return "audio/mpeg";
      case "wav":
        return "audio/wav";
      case "m4a":
        return "audio/mp4";
      case "ogg":
        return "audio/ogg";
      case "webm":
        return "audio/webm";
      default:
        return "audio/mpeg";
    }
  };


  const isDocxFile = (value) => {
  if (!value || typeof value !== "string") return false;
  return /\.docx$/i.test(value.trim());
};



  const getFormatedTime = (time) => {
      if (time) {
      if (time?.includes(' ')) {
        return DateTime.fromFormat(time, 'yyyy-MM-dd HH:mm:ss').toFormat(
          'hh:mm a'
        );
      } else {
        return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('hh:mm a');
      }
    }
  }
  
  return (
    <>
      <section className="mt-12 border">
        {/* Header */}
        <div className="bg-[#4B67DB] w-full z-10 border mx-0 m-0">
          <div className="container mx-auto px-6 py-2">
            <h2 className="text-white">{sudoName}</h2>
          </div>
        </div>

        {/* Chat container */}
        <div className="container mt-28 md:mt-14 mx-auto md:px-6">
          <div
            className="messagesContainer flex flex-col overflow-y-auto h-[70vh] py-10 space-y-6"
            ref={containerRef}
            onScroll={(e) => onScrollEnd(e)}
            id="chatt"
          >
            {Object.entries(groupedMessages).map(([date, msgs]) => {
              const parsedDate = parseISO(date); // "2025-07-08" -> Date object
              const displayDate = isToday(parsedDate)
                ? "Today"
                : isYesterday(parsedDate)
                ? "Yesterday"
                : format(parsedDate, "dd MMM yyyy");

              return (
                <div key={date + Math.random()}>
                  {/* 🗓️ Date separator */}
                  <div className="text-center my-4">
                    <span className="bg-gray-300 text-gray-800 px-4 py-1 rounded-full text-sm font-medium">
                      {displayDate}
                    </span>
                  </div>

                  {/* 💬 Messages */}
                  {msgs.map((msg, index) => {
                    const fileUrl = `${baseUrl}/newchatfilesuploads/${msg?.msgfile}`;
                    const isAudio = isAudioFile(msg?.msgfile);
                    const isImage = isPngFile(msg?.msgfile);

                    const isPdf = msg?.msgfile !=="" ? isPdfFile(msg?.msgfile) : false;
                    const isDox = msg?.msgfile !=="" ? isDocxFile(msg?.msgfile) : false;
                    const msgtime = getFormatedTime(msg?.time)
                    return (
                      <div key={msg?.id} className="mb-4 p-4">
                        <div
                          className={`flex ${
                            msg?.messagefrom == user?.userid
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`p-3 ${
                              !isAudio ? "max-w-[60%]" : isDox  ? "w-[80%]" : "w-[40%]"
                            } rounded-lg ${
                              msg?.messagefrom == user?.userid
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt="chat-img"
                                className="max-w-xs rounded-md"
                              />
                            ) : isAudio ? (
                              <audio
                                controls
                                preload="metadata"
                                className="w-full"
                              >
                                <source src={fileUrl} type={"audio/mpeg"} />
                                Your browser does not support the audio element.
                              </audio>
                            ) : isPdf ? (
                              <div className={`${isPdf ? "h-[400px] overflow-y-auto" : ""}`}>
                                <div className="flex justify-between px-4 items-center mb-2">
                                  <span className="font-medium text-gray-600">PDF Preview</span>
                                  <a
                                    href={fileUrl}
                                    download
                                    className="text-blue-500 hover:underline text-sm"
                                  >
                                    Download PDF
                                  </a>
                                </div>

                                <Document file={fileUrl}>
                                  <Page
                                    pageNumber={1}
                                    width={400}
                                    height={400}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                  />
                                </Document>
                              </div>
                            ) : isDox ? <div className="w-full">
                              <div className="flex justify-between px-4 items-center mb-2">
                                  <span className="font-medium text-gray-600">Docx Preview</span>
                                  <a
                                    href={fileUrl}
                                    download
                                    className="text-blue-500 hover:underline text-sm"
                                  >
                                    Download Docx
                                  </a>
                                </div>
                              <iframe
                                src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                                className="w-full h-48 rounded-md"
                                title="DOCX Preview"
                              />
                            </div> : (
                              <p>{msg?.message === "" ? "empty Message" : msg?.message}</p>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            msg?.messagefrom == user?.userid
                              ? "text-blue-500 text-end"
                              : "text-gray-500 text-start"
                          }`}
                        >
                          {msgtime}
                        </p>
                      </div>
                    );
                  })}
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
              <button
                className="bg-primary py-2 px-3 rounded-lg text-white"
                onClick={handleButtonClick}
              >
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
            <button
              className="bg-primary py-2 px-3 rounded-lg text-white"
              onClick={handleVoiceRecording}
            >
              {isVoiceStart ? (
                <Lottie
                  animationData={voiceButtonAnimation}
                  loop={true}
                  style={{ width: "30px", height: "30px" }}
                />
              ) : recordedBlob ? (
                <FaFileAudio />
              ) : (
                <FaMicrophone className="text-2xl cursor-pointer" />
              )}
            </button>
            <button
              className="bg-primary flex items-center gap-2 px-6 py-2 rounded-lg text-white"
              onClick={handleSendMessage}
            >
              Send
              <FaTelegramPlane className="text-2xl cursor-pointer" />
            </button>

            {selectedImage?.length > 0 && (
              <div
                className={`absolute ${
                  selectedImage?.length === 1 ? "w-1/3" : "w-1/2"
                } h-44 -top-52 left-[20%] bg-white p-2 rounded-lg shadow-lg`}
              >
                {selectedImage.map((img, index) => (
                  <div
                    className={`shadow-lg relative border-2 border-gray-300 rounded-md ${
                      selectedImage.length === 1 ? "w-1/2 h-full" : "w-32 h-16"
                    } `}
                    key={index}
                  >
                    <img
                      key={index}
                      src={img.uri}
                      alt={`Selected ${index}`}
                      className={`object-cover rounded-md object-center mb-2 ${
                        selectedImage?.length === 1 ? "w-full" : "w-full"
                      } h-full`}
                    />
                    <RxCross2
                      size={26}
                      className="absolute -top-2 -right-3 cursor-pointer hover:text-rose-600"
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}

            {selectPdf.map((file, i) => (
              <div className="absolute bottom-20 left-[20%]">
                <div className="text-end">
                  <button
                    type="button"
                    className="hover:text-red"
                    onClick={() => {
                      setSelectPdf((prev) =>
                        prev.filter((_, index) => index !== i)
                      );
                    }}
                  >
                    <RxCross1 size={30} />
                  </button>
                </div>
                <iframe
                  key={i}
                  src={URL.createObjectURL(file)}
                  title={`PDF-${i}`}
                  width="100%"
                  height="400px"
                  className="max-w-xs rounded-md border"
                />
              </div>
            ))}

            {docxHtml && (
              <div
                className={`absolute w-1/2 h-52 overflow-auto  -top-64 left-[20%] bg-white p-2 rounded-lg shadow-lg`}
              >
                <div className="text-end">
                  <button
                    type="button"
                    className="hover:text-red"
                    onClick={() => {
                      setDocxFiles([]);
                      setDocxHtml("")
                    }}
                  >
                    <RxCross1 size={30} />
                  </button>
                </div>
                <div
                  className="border p-4 rounded h-full"
                  dangerouslySetInnerHTML={{ __html: docxHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatPage;
