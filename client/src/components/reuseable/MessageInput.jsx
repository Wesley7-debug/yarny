// import { useRef, useState } from "react";

// import { Image, Send, X } from "lucide-react";

// const MessageInput = () => {
//   const [text, setText] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file.type.startsWith("image/")) {
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   //   const handleSendMessage = async (e) => {
//   //     e.preventDefault();
//   //     if (!text.trim() && !imagePreview) return;

//   //     try {
//   //       await sendMessage({
//   //         text: text.trim(),
//   //         image: imagePreview,
//   //       });

//   //       // Clear form
//   //       setText("");
//   //       setImagePreview(null);
//   //       if (fileInputRef.current) fileInputRef.current.value = "";
//   //     } catch (error) {
//   //       console.error("Failed to send message:", error);
//   //     }
//   //   };

//   return (
//     <div className="p-4 w-full">
//       {imagePreview && (
//         <div className="mb-3 flex items-center gap-2">
//           <div className="relative">
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
//             />
//             <button
//               onClick={removeImage}
//               className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
//               flex items-center justify-center"
//               type="button"
//             >
//               <X className="size-3" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* <form className="flex items-center gap-2">
//         <div className="flex-1 flex gap-2">
//           <input
//             type="text"
//             className="w-full  rounded-3xl bg-gray-200 ring-1 ring-white/35  sm:input-md p-3 "
//             placeholder="Message"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />

//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             ref={fileInputRef}
//             onChange={handleImageChange}
//           />

//           <button
//             type="button"
//             className={` items-center justify-center rounded-full p-2 absolute right-2 top-1/2
//                      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Image size={25} />
//           </button>
//         </div>
//         <button
//           type="submit"
//           className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={!text.trim() && !imagePreview}
//         >
//           <Send size={22} />
//         </button>
//       </form> */}
//       <form className="flex items-center gap-2">
//         <div className="flex-1 relative">
//           <textarea
//             rows={1}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Message"
//             className="w-full pr-10 rounded-3xl bg-gray-200 ring-1 ring-white/35 p-2.5 resize-none overflow-hidden leading-tight text-md"
//             style={{ minHeight: "3rem", maxHeight: "8rem" }}
//           />

//           {/* Hidden file input */}
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             ref={fileInputRef}
//             onChange={handleImageChange}
//           />

//           {/* Image icon inside input */}
//           <button
//             type="button"
//             className={` absolute right-3 top-[46%] -translate-y-1/2
//                      ${imagePreview ? "text-purple-500" : "text-zinc-400"}`}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Image size={20} />
//           </button>
//         </div>

//         {/* Send Button */}
//         <button
//           type="submit"
//           className="bg-purple-700 hover:bg-purple-800 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={!text.trim() && !imagePreview}
//         >
//           <Send size={22} />
//         </button>
//       </form>
//     </div>
//   );
// };
// export default MessageInput;

import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";

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

    // Auto-grow textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // set to scroll height
    }
  };

  return (
    <div className="p-4 w-full border-t border-base-300 bg-white">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Form with input + buttons */}
      <form className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Message"
            value={text}
            onChange={handleChange}
            className="w-full pr-10 rounded-3xl bg-gray-200 ring-1 ring-white/35   resize-none overflow-hidden leading-tight max-h-50"
            style={{
              transition: "height 0.2s ease",
            }}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image icon inside input */}
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
