import { useEffect, useRef, useState } from "react";
import messageStore from "../../store/messageStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import ChatSkeleton from "./skeletons/ChatSkeleton";
import authStore from "../../store/authStore";
import "../ui/styles/daisy-ui-styles.css";

import {
  X as IconClose,
  ChevronLeft,
  ChevronRight,
  Download as IconDownload,
} from "lucide-react";

const formatDateLabel = (dateString) => {
  const msgDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = msgDate.toDateString() === today.toDateString();
  const isYesterday = msgDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString();
};

const MessageContainer = () => {
  const { selectedUser, messages, getMessages, isGettingConversation } =
    messageStore();
  const { authUser } = authStore();
  const currentUserId = selectedUser?._id;
  const bottomRef = useRef(null);

  useEffect(() => {
    messageStore.getState().subscribeToMessages();

    return () => {
      messageStore.getState().unsubscribeFromMessages();
    };
  }, [messageStore.getState().selectedUser]);

  // For image gallery preview
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]); // array of image URLs
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (currentUserId) {
      getMessages(currentUserId);
    }
  }, [currentUserId, getMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const openGallery = (imagesArray, startIndex = 0) => {
    setGalleryImages(imagesArray);
    setGalleryIndex(startIndex);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setGalleryImages([]);
    setGalleryIndex(0);
  };

  const showPrev = (ev) => {
    ev.stopPropagation();
    setGalleryIndex((i) => (i > 0 ? i - 1 : i));
  };

  const showNext = (ev) => {
    ev.stopPropagation();
    setGalleryIndex((i) => (i < galleryImages.length - 1 ? i + 1 : i));
  };

  // Utility to download multiple images as separate files
  const downloadAllImages = (images) => {
    images.forEach((url, idx) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${idx + 1}.jpg`; // You might want to customize extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  let lastDateLabel = null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isGettingConversation ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages
            .filter((msg) => msg && msg.senderId)
            .map((msg) => {
              const senderId =
                typeof msg.senderId === "string"
                  ? msg.senderId
                  : msg.senderId?._id;

              const isSender = senderId === authUser?.userId;
              const dateLabel = formatDateLabel(msg.createdAt);
              const showDateLabel = dateLabel !== lastDateLabel;
              lastDateLabel = dateLabel;

              const formattedTime = new Date(msg.createdAt).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              // Normalize images into an array
              let imgs = [];
              if (Array.isArray(msg.image)) {
                imgs = msg.image;
              } else if (msg.image) {
                imgs = [msg.image];
              }

              return (
                <div key={msg._id}>
                  {showDateLabel && (
                    <div className="text-center text-xs text-gray-500 my-2">
                      {dateLabel}
                    </div>
                  )}
                  <div
                    className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble relative max-w-[90%] ${
                        isSender ? "chat-bubble-sender" : "chat-bubble-receiver"
                      } p-3 space-y-2`}
                    >
                      {/* Handle images differently based on count */}
                      {imgs.length > 2 ? (
                        // Show a single download button if more than 2 images
                        <div
                          className="flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg p-4 gap-2 hover:bg-gray-100"
                          onClick={() => downloadAllImages(imgs)}
                          title="Download all images"
                        >
                          <IconDownload size={20} />
                          <span>Download {imgs.length} images</span>
                        </div>
                      ) : (
                        <div
                          className={`grid grid-cols-${
                            imgs.length > 1 ? "2" : "1"
                          } gap-2`}
                        >
                          {imgs.map((imgUrl, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={imgUrl}
                                alt={`Media ${idx + 1}`}
                                className="rounded-lg border border-gray-300 cursor-pointer max-w-[200px] max-h-[200px] object-cover"
                                onClick={() => openGallery(imgs, idx)}
                              />
                              <a
                                href={imgUrl}
                                download
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow"
                                title="Download"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IconDownload size={16} />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.text && <p>{msg.text}</p>}

                      <span className="text-[10px] text-gray-500 absolute bottom-1 right-2">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
        )}

        <div ref={bottomRef} />
      </div>

      {/* Gallery Preview Overlay */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeGallery}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back button (left arrow) top-left */}
            <button
              className="absolute top-4 left-4 text-white p-2 bg-black bg-opacity-50 rounded-full z-50"
              onClick={closeGallery}
              title="Back"
            >
              <ChevronLeft size={24} color="white" />
            </button>

            {/* Prev arrow */}
            {galleryIndex > 0 && (
              <button
                className="absolute left-12 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black bg-opacity-50 rounded-full"
                onClick={showPrev}
              >
                <ChevronLeft size={28} color="white" />
              </button>
            )}

            {/* Next arrow */}
            {galleryIndex < galleryImages.length - 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black bg-opacity-50 rounded-full"
                onClick={showNext}
              >
                <ChevronRight size={28} color="white" />
              </button>
            )}

            <img
              src={galleryImages[galleryIndex]}
              alt={`Gallery ${galleryIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Download current image */}
            <a
              href={galleryImages[galleryIndex]}
              download
              className="absolute bottom-4 right-4 text-white p-2 bg-black bg-opacity-50 rounded-full"
              title="Download image"
            >
              <IconDownload size={24} />
            </a>
          </div>
        </div>
      )}

      <div className="sticky bottom-1.5 w-full lg:w-fit">
        <MessageInput />
      </div>
    </div>
  );
};

export default MessageContainer;
