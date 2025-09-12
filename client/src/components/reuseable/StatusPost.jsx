import React, { useState, useRef } from "react";
import { Send, Image, ArrowLeft, Palette, X } from "lucide-react";

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B5DE5",
  "#F15BB5",
  "#00BBF9",
  "#FF9F1C",
  "#8ACB88",
  "#F72585",
];

const StatusPost = ({ onSubmit, onGoBack }) => {
  const [textStatus, setTextStatus] = useState("");
  const [bgColor, setBgColor] = useState(COLORS[3]);
  const [showPalette, setShowPalette] = useState(false);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const MAX_TEXT_WORDS = 50;
  const MAX_CAPTION_WORDS = 100;

  const countWords = (str) =>
    str.trim() === "" ? 0 : str.trim().split(/\s+/).length;

  const handleTextChange = (e) => {
    if (countWords(e.target.value) <= MAX_TEXT_WORDS) {
      setTextStatus(e.target.value);
      setError("");
    } else {
      setError(`Text status max ${MAX_TEXT_WORDS} words`);
    }
  };

  const handleCaptionChange = (e) => {
    if (countWords(e.target.value) <= MAX_CAPTION_WORDS) {
      setCaption(e.target.value);
      setError("");
    } else {
      setError(`Caption max ${MAX_CAPTION_WORDS} words`);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const valid = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    if (valid.length !== files.length) {
      setError("Some files are invalid type (only image/video).");
    }

    const newMedia = valid.map((file) => ({
      file,
      previewURL: URL.createObjectURL(file),
    }));

    setMediaFiles((prev) => [...prev, ...newMedia]);
    if (currentPreviewIndex === null && newMedia.length > 0) {
      // eslint-disable-next-line no-undef
      setCurrentPreviewIndex(prev.length);
    }

    setError("");
  };

  const removeMediaAt = (idx) => {
    setMediaFiles((prev) => {
      const newArr = prev.filter((_, i) => i !== idx);
      return newArr;
    });

    if (currentPreviewIndex === idx) {
      setCurrentPreviewIndex(0);
    } else if (currentPreviewIndex > idx) {
      setCurrentPreviewIndex((prevIdx) => prevIdx - 1);
    }
  };

  const previewMediaAt = (idx) => {
    if (idx >= 0 && idx < mediaFiles.length) {
      setCurrentPreviewIndex(idx);
    }
  };

  const resetAll = () => {
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.previewURL));
    setMediaFiles([]);
    setCurrentPreviewIndex(0);
    setCaption("");
    setTextStatus("");
    setBgColor(COLORS[3]);
    setShowPalette(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!textStatus.trim() && mediaFiles.length === 0) {
      setError("Please enter text or upload media.");
      return;
    }

    const uploadedMediaUrls = mediaFiles.map((m) => m.previewURL);
    const mediaTypes = mediaFiles.map((m) => m.file.type);

    onSubmit({
      text: textStatus,
      mediaUrls: uploadedMediaUrls,
      mediaTypes,
      caption,
      bgColor,
    });

    resetAll();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {/* Go Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => (onGoBack ? onGoBack() : resetAll())}
          className="bg-white bg-opacity-50 p-2 rounded-full text-black"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* TEXT ONLY MODE */}
      {mediaFiles.length === 0 && (
        <>
          <div className="flex flex-grow items-center justify-center px-6">
            <textarea
              value={textStatus}
              onChange={handleTextChange}
              placeholder="Type your status..."
              maxLength={1000}
              rows={6}
              className="w-full max-w-3xl bg-transparent resize-none text-white text-center font-bold text-4xl placeholder-white/70 focus:outline-none"
              style={{ minHeight: "180px" }}
            />
          </div>

          <div className="flex justify-between items-center p-4 max-w-3xl mx-auto w-full text-white">
            <button
              onClick={() => setShowPalette((v) => !v)}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              <Palette size={28} />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition font-semibold"
              type="button"
            >
              <Image size={28} />
              Upload Media
            </button>

            <button
              onClick={handleSubmit}
              disabled={!textStatus.trim()}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition ${
                !textStatus.trim()
                  ? "bg-white/30 cursor-not-allowed text-white"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              <Send size={24} />
            </button>
          </div>

          {showPalette && (
            <div className="flex justify-center gap-5 pb-6 max-w-3xl mx-auto w-full">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`w-12 h-12 rounded-full border-4 transition ${
                    bgColor === color ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {error && (
            <p className="max-w-3xl mx-auto text-center text-red-400 font-semibold">
              {error}
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleMediaChange}
          />
        </>
      )}

      {/* MEDIA MODE */}
      {mediaFiles.length > 0 && (
        <div className="relative flex-grow h-full w-full bg-black">
          {/* Full screen preview */}
          <div className="absolute inset-0 z-10">
            {mediaFiles[currentPreviewIndex].file.type.startsWith("image/") ? (
              <img
                src={mediaFiles[currentPreviewIndex].previewURL}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={mediaFiles[currentPreviewIndex].previewURL}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Progress Indicator (dots) */}
          {mediaFiles.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
              {mediaFiles.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentPreviewIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Move thumbnails ABOVE the input bar */}
          <div className="absolute bottom-20 left-0 right-0 p-3 flex overflow-x-auto gap-2 z-30">
            {mediaFiles.map((m, idx) => (
              <div
                key={idx}
                onClick={() => previewMediaAt(idx)}
                className={`relative w-15 h-15 rounded-md overflow-hidden border-2 ${
                  idx === currentPreviewIndex
                    ? "border-white"
                    : "border-gray-400"
                } cursor-pointer`}
              >
                {m.file.type.startsWith("image/") ? (
                  <img
                    src={m.previewURL}
                    alt={`thumb-${idx}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <video
                    src={m.previewURL}
                    className="object-cover w-full h-full"
                  />
                )}

                {mediaFiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMediaAt(idx);
                    }}
                    className="absolute top-0.5 right-0.5 bg-red-600 rounded-full p-1 text-white z-50"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Caption Input + Image Upload Icon inside input bar */}
          <div className="absolute bottom-4 left-0 right-0 z-40 rounded-3xl bg-black/20 text-purple-800 ring-1 ring-purple-300 focus:ring-purple-600 transition duration-200 p-2.5 resize-none max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex items-center w-full gap-2"
            >
              <textarea
                rows={1}
                placeholder="Add a caption..."
                value={caption}
                onChange={handleCaptionChange}
                maxLength={MAX_CAPTION_WORDS}
                className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none rounded-full px-3 py-2 resize-none overflow-hidden"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />

              {/* Image upload icon button inside input bar */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-white p-2 rounded-full hover:bg-white/20 transition"
                aria-label="Upload media"
              >
                <Image size={24} />
              </button>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPost;
