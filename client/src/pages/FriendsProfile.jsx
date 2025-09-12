// import {
//   MessageSquare,
//   Phone,
//   UserMinus2Icon,
//   Users,
//   Video,
//   Ban,
// } from "lucide-react";
// import React from "react";

// export default function FriendsProfile() {
//   const profileIcon = [
//     { name: "Message", icon: MessageSquare, label: "Message" },
//     { name: "Calls", icon: Phone, label: "Calls" },
//     { name: "Video", icon: Video, label: "Video" },
//   ];

//   return (
//     <section className="w-full h-full flex justify-center items-center flex-col bg-gradient-to-br from-gray-50 to-white p-6">
//       {/* Profile Section */}
//       <div className="mt-16 flex flex-col items-center p-6 rounded-xl shadow-lg bg-white w-full max-w-md">
//         {/* Profile Image */}
//         <div className="rounded-full p-1 bg-green-600 mb-4">
//           <img
//             src="/public/baily1.webp"
//             className="w-32 h-32 rounded-full object-cover"
//             alt="Profile"
//           />
//         </div>

//         {/* Name and Status */}
//         <h1 className="text-2xl font-semibold text-gray-800">Eugene Fidelis</h1>
//         <p className="text-sm text-green-500 mb-4">Online</p>

//         {/* Action Buttons */}
//         <div className="flex justify-between w-full gap-4">
//           {profileIcon.map((profile) => {
//             const Icon = profile.icon;
//             return (
//               <div
//                 key={profile.name}
//                 className="flex-1 flex flex-col items-center p-4 rounded-lg border hover:shadow-md transition duration-200"
//               >
//                 <button className="p-2 hover:bg-purple-100 rounded-full">
//                   <Icon className="w-6 h-6 text-purple-600" />
//                 </button>
//                 <span className="text-sm font-medium mt-2 text-gray-700">
//                   {profile.label}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* No Common Groups */}
//       <div className="mt-6 w-full max-w-md bg-white p-4 rounded-xl shadow-sm">
//         <h2 className="text-sm text-gray-500 mb-2">No groups in common</h2>

//         {/* Create Group */}
//         <div className="flex items-center gap-3 mb-4 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition duration-200">
//           <div className="p-2 rounded-full bg-purple-700 text-white">
//             <Users className="w-6 h-6" />
//           </div>
//           <span className="text-sm text-gray-800">
//             Create group with Eugene Fidelis
//           </span>
//         </div>
//       </div>

//       <div className="mt-6 w-full max-w-md bg-white p-4 rounded-xl shadow-sm">
//         {/* Unfriend */}
//         <div className="flex items-center gap-3 mb-4 hover:bg-red-100 p-2 rounded-lg cursor-pointer transition duration-200">
//           <div className="p-2 rounded-full bg-red-600 text-white">
//             <UserMinus2Icon className="w-6 h-6" />
//           </div>
//           <span className="text-sm text-red-700 font-medium">Unfriend</span>
//         </div>

//         {/* Report */}
//         <div className="flex items-center gap-3 hover:bg-yellow-100 p-2 rounded-lg cursor-pointer transition duration-200">
//           <div className="p-2 rounded-full bg-yellow-500 text-white">
//             <Ban className="w-6 h-6" />
//           </div>
//           <span className="text-sm text-yellow-800 font-medium">Report</span>
//         </div>
//       </div>
//     </section>
//   );
// }

import {
  MessageSquare,
  Phone,
  UserMinus2Icon,
  Users,
  Video,
  Ban,
  ArrowLeft,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function FriendsProfile() {
  const navigate = useNavigate();

  const profileIcon = [
    { name: "Message", icon: MessageSquare, label: "Message" },
    { name: "Calls", icon: Phone, label: "Calls" },
    { name: "Video", icon: Video, label: "Video" },
  ];

  return (
    <section className="w-full h-full flex justify-center items-start flex-col bg-gradient-to-br from-gray-50 to-white p-6 relative">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-purple-600 hover:underline text-sm font-medium"
      >
        <ArrowLeft className="w-5 h-5 inline-block mr-1" />
      </button>

      {/* Profile Section */}
      <div className="mt-20 flex flex-col items-center p-6 rounded-xl shadow-lg bg-white w-full max-w-md mx-auto">
        {/* Profile Image */}
        <div className="rounded-full p-1 bg-green-600 -mt-16 mb-4">
          <img
            src="/public/baily1.webp"
            className="w-32 h-32 rounded-full object-cover"
            alt="Profile"
          />
        </div>

        {/* Name and Status */}
        <h1 className="text-2xl font-semibold text-gray-800">Eugene Fidelis</h1>
        <p className="text-sm text-green-500 mb-4">Online</p>

        {/* Action Buttons */}
        <div className="flex justify-between w-full gap-4">
          {profileIcon.map((profile) => {
            const Icon = profile.icon;
            return (
              <div
                key={profile.name}
                className="flex-1 flex flex-col items-center p-4 rounded-lg border hover:shadow-md transition duration-200"
              >
                <button className="p-2 hover:bg-purple-100 rounded-full">
                  <Icon className="w-6 h-6 text-purple-600" />
                </button>
                <span className="text-sm font-medium mt-2 text-gray-700">
                  {profile.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* No Common Groups */}
      <div className="mt-6 w-full max-w-md mx-auto bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-sm text-gray-500 mb-2">No groups in common</h2>

        {/* Create Group */}
        <div className="flex items-center gap-3 mb-4 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition duration-200">
          <div className="p-2 rounded-full bg-purple-700 text-white">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-sm text-gray-800">
            Create group with Eugene Fidelis
          </span>
        </div>
      </div>

      {/* Unfriend & Report */}
      <div className="mt-6 w-full max-w-md mx-auto bg-white p-4 rounded-xl shadow-sm">
        {/* Unfriend */}
        <div className="flex items-center gap-3 mb-4 hover:bg-red-100 p-2 rounded-lg cursor-pointer transition duration-200">
          <div className="p-2 rounded-full bg-red-600 text-white">
            <UserMinus2Icon className="w-6 h-6" />
          </div>
          <span className="text-sm text-red-700 font-medium">Unfriend</span>
        </div>

        {/* Report */}
        <div className="flex items-center gap-3 hover:bg-yellow-100 p-2 rounded-lg cursor-pointer transition duration-200">
          <div className="p-2 rounded-full bg-yellow-500 text-white">
            <Ban className="w-6 h-6" />
          </div>
          <span className="text-sm text-yellow-800 font-medium">Report</span>
        </div>
      </div>
    </section>
  );
}
