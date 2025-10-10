import React, { useEffect, useRef, useState } from "react";
import {
  UserCircle,
  Download as IconDownload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GroupChatHeader from "./GroupChatHeader";
import useGroupStore from "../../store/groupStore";
import MessageInput from "./MessageInput";
import authStore from "../../store/authStore";
import messageStore from "../../store/messageStore";
import ChatSkeleton from "./skeletons/ChatSkeleton";
import "../ui/styles/daisy-ui-styles.css";

function GroupChatMessageContainer() {
  const {
    selectedGroup,
    setSelectedGroup,
    groupMessages,
    getGroupMessages,
    isGettingGroupMessages,
  } = useGroupStore();
  const { authUser } = authStore();

  const bottomRef = useRef(null);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    getGroupMessages();
  }, [getGroupMessages]);

  useEffect(() => {
    if (selectedGroup) {
      messageStore.getState().subscribeToMessages();
    }
    return () => {
      messageStore.getState().unsubscribeFromMessages();
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

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

  const showPrev = (e) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i > 0 ? i - 1 : i));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setGalleryIndex((i) => (i < galleryImages.length - 1 ? i + 1 : i));
  };

  const downloadAllImages = (images) => {
    images.forEach((url, idx) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${idx + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (!selectedGroup) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a group to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col  h-full bg-base-200 rounded-lg overflow-hidden w-screen">
      <GroupChatHeader
        selectedGroup={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {isGettingGroupMessages ? (
          <ChatSkeleton />
        ) : groupMessages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </p>
        ) : (
          // Inside GroupChatMessageContainer.js

          groupMessages.map((msg) => {
            console.log("Rendering message:", msg);
            if (!msg || !msg._id) return null;

            const isSender =
              (msg.senderId?._id || msg.sender) === authUser?.userId;

            const senderUser = selectedGroup.participants.find(
              (m) => m._id === (msg.senderId?._id || msg.sender)
            );

            const username = senderUser?.nickname || "Unknown";
            const avatarUrl = senderUser?.avatarUrl || null;
            const messageClass = isSender ? "chat-end " : "chat-start";

            const content = msg.content || msg.text || "";
            const imgs = Array.isArray(msg.image)
              ? msg.image
              : msg.image
              ? [msg.image]
              : Array.isArray(msg.images)
              ? msg.images
              : msg.attachments || [];

            return (
              <div key={msg._id} className={`chat ${messageClass}`}>
                {/* Avatar */}
                <div className="chat-image avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={username} />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-500" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="chat-bubble">
                  <div className="chat-header">{username}</div>

                  {imgs.length > 0 && (
                    <>
                      {imgs.length > 2 && (
                        <div
                          className="download-multiple mt-2"
                          onClick={() => downloadAllImages(imgs)}
                        >
                          <IconDownload size={20} />
                          <span>Download {imgs.length} images</span>
                        </div>
                      )}
                      <div className="images-grid mt-2">
                        {imgs.map((imgUrl) => (
                          <div key={imgUrl} className="relative">
                            <img
                              src={imgUrl}
                              alt="Media"
                              onClick={() =>
                                openGallery(imgs, imgs.indexOf(imgUrl))
                              }
                            />
                            <a
                              href={imgUrl}
                              download
                              className="download-icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconDownload size={16} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {content && <div className="my-0.5">{content}</div>}

                  <div className="chat-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeGallery}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 left-4 text-white p-2 bg-black bg-opacity-50 rounded-full z-50"
              onClick={closeGallery}
              title="Close"
            >
              <ChevronLeft size={24} color="white" />
            </button>

            {galleryIndex > 0 && (
              <button
                className="absolute left-12 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black bg-opacity-50 rounded-full"
                onClick={showPrev}
                title="Previous"
              >
                <ChevronLeft size={28} color="white" />
              </button>
            )}

            {galleryIndex < galleryImages.length - 1 && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black bg-opacity-50 rounded-full"
                onClick={showNext}
                title="Next"
              >
                <ChevronRight size={28} color="white" />
              </button>
            )}

            <img
              src={galleryImages[galleryIndex]}
              alt={`Gallery ${galleryIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

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

      <MessageInput />
    </div>
  );
}

export default GroupChatMessageContainer;
