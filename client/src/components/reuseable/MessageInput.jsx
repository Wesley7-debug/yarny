import { useRef, useState } from "react";
import { Image, Send, X, Wand2 } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    setText(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="p-4 w-full border-t border-gray-200 bg-white">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow"
              type="button"
            >
              <X className="size-3 text-zinc-600" />
            </button>
          </div>
        </div>
      )}

      {/* Message Form */}
      <form className="flex items-end gap-2">
        <div className="flex-1 relative">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Type a message..."
            value={text}
            onChange={handleChange}
            className="w-full pl-10 pr-20 rounded-3xl bg-purple-100 text-purple-800 ring-1 ring-purple-300 focus:ring-purple-600 transition duration-200 p-2.5 resize-none overflow-hidden leading-tight max-h-40 placeholder-purple-500"
            style={{ transition: "height 0.2s ease" }}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Pencil Wand Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
            <Wand2 size={18} />
          </div>

          {/* Image Icon */}
          <button
            type="button"
            className="absolute right-10 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white rounded-full p-2 mb-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
