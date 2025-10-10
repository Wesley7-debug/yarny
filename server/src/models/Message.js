// // import mongoose from "mongoose";

// // const messageSchema = new mongoose.Schema(
// //   {
// //     conversationId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Conversation",
// //       required: true,
// //     },
// //     senderId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },
// //   receiver: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     required: function () {
// //       return !this.isGroup;
// //     }, // ✅ Only required if NOT group

// //   },
// //       image: { type: String },
// //     text: { type: String },
// //     createdAt: { type: Date, default: Date.now },
// //   { timestamps: true }

// // );

// // export default mongoose.model("Message", messageSchema);
// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     conversationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Conversation",
//       required: true,
//     },
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: function () {
//         return !this.isGroup;
//       }, // only required if not a group message
//     },
//     content: {
//       type: String,
//       trim: true,
//     },
//     attachments: [
//       {
//         url: String,
//         public_id: String,
//         format: String,
//         originalname: String,
//         resource_type: String,
//       },
//     ],
//     isGroup: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", messageSchema);
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.isGroup;
      }, // Only for 1-on-1 chats
    },
    isGroup: {
      type: Boolean,
      default: false,
    },

    // ✅ For 1-on-1 chat
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },

    // ✅ For group chat (optional fields)

    attachments: [
      {
        url: String,
        public_id: String,
        format: String,
        originalname: String,
        resource_type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
