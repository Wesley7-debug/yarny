// import {
//   MessageSquare,
//   Phone,
//   UserMinus2Icon,
//   Users,
//   Video,
//   Ban,
//   ArrowLeft,
// } from "lucide-react";
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import messageStore from "../store/messageStore";

// export default function FriendsProfile() {
//   const { selectedUser } = messageStore();
//   const dummyUser = {
//     name: "Bob",
//     age: 23,
//     profileImage: "/baily1.webp",
//     photos: ["/baily1.webp", "/baily1.webp", "/baily1.webp"],
//     interests: ["Hiking", "Board Games", "Photography", "Coffee"],
//     friendTags: ["🎮 Gaming Buddy", "🧘 Chill Hangs", "📚 Study Partner"],
//     bio: "Life is better with friends!",
//   };

//   const user = selectedUser || dummyUser;
//   const navigate = useNavigate();

//   const profileIcon = [
//     { name: "Message", icon: MessageSquare, label: "Message" },
//     { name: "Calls", icon: Phone, label: "Calls" },
//     { name: "Video", icon: Video, label: "Video" },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const intervalRef = useRef(null);
//   const timeoutRef = useRef(null);

//   // Update progress bar and move to next image after 30s unless last image
//   useEffect(() => {
//     setProgress(0);
//     const startTime = Date.now();

//     intervalRef.current = setInterval(() => {
//       const elapsed = Date.now() - startTime;
//       let percentage = Math.min((elapsed / 30000) * 100, 100);

//       // If last image, fill progress and stop at 100%
//       if (currentIndex === user.photos.length - 1) {
//         percentage = Math.min(percentage, 100);
//       }

//       setProgress(percentage);
//     }, 100);

//     if (currentIndex < user.photos.length - 1) {
//       timeoutRef.current = setTimeout(() => {
//         setCurrentIndex((prev) => prev + 1);
//       }, 30000);
//     }

//     return () => {
//       clearInterval(intervalRef.current);
//       clearTimeout(timeoutRef.current);
//     };
//   }, [currentIndex, user.photos.length]);

//   // Handle click to go prev or next image
//   function handleCarouselClick(e) {
//     const boundingRect = e.currentTarget.getBoundingClientRect();
//     const clickX = e.clientX - boundingRect.left;

//     if (clickX > boundingRect.width / 2) {
//       // Next image, but don't go past last image
//       setCurrentIndex((prevIndex) =>
//         prevIndex < user.photos.length - 1 ? prevIndex + 1 : prevIndex
//       );
//     } else {
//       // Prev image, can't go below 0
//       setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
//     }
//   }

//   return (
//     <section className="w-full h-full flex justify-center items-start flex-col p-6 relative">
//       {/* Go Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="absolute top-4 left-4 text-purple-600 hover:underline text-sm font-medium z-10"
//       >
//         <ArrowLeft className="w-5 h-5 inline-block mr-1" />
//         Back
//       </button>

//       {/* Photo Carousel - pushed down and centered */}
//       <div className="w-full  mx-auto mb-6 mt-12 relative select-none">
//         {/* Indicator Bars at top */}
//         <div className="flex justify-center gap-2 mb-2 px-4">
//           {user.photos.map((_, idx) => {
//             const isCurrent = idx === currentIndex;
//             const fillWidth = isCurrent
//               ? progress
//               : idx < currentIndex
//               ? 100
//               : 0;

//             return (
//               <div
//                 key={idx}
//                 className="bg-gray-300 overflow-hidden"
//                 style={{ width: 30, height: 4, flexShrink: 0 }}
//                 aria-label={`Image ${idx + 1} progress indicator`}
//               >
//                 <div
//                   className={`bg-purple-600 h-4 transition-all duration-100`}
//                   style={{ width: `${fillWidth}%` }}
//                 />
//               </div>
//             );
//           })}
//         </div>

//         <div
//           onClick={handleCarouselClick}
//           className="relative w-full h-120 cursor-pointer rounded-xl overflow-hidden border shadow-md flex justify-center items-center"
//           // w-72 h-72
//         >
//           <img
//             src={user.photos[currentIndex]}
//             alt={`Photo ${currentIndex + 1}`}
//             className="aspect-ratio max-w-full h-full"
//             draggable={false}
//           />
//         </div>
//       </div>

//       {/* Profile Info Card */}
//       <div className="flex flex-col items-center p-6 rounded-xl shadow-lg bg-white w-full mx-auto">
//         {/* Profile Image - commented out */}
//         {/*
//         <div className="rounded-full p-1 bg-green-600 -mt-16 mb-4 shadow-md">
//           <img
//             src={user.profileImage || "/public/baily1.webp"}
//             className="w-32 h-32 rounded-full object-cover"
//             alt="Profile"
//           />
//         </div>
//         */}

//         {/* Name, Age, Status */}
//         <h1 className="text-2xl font-semibold text-gray-800">
//           {user.name || "Bob"}
//           <span className="text-sm text-gray-500 ml-2">
//             {user.age ? `• ${user.age}` : "• 23"}
//           </span>
//         </h1>
//         <p className="text-sm text-green-500 mb-2">Online</p>

//         {/* Bio */}
//         {user.bio && (
//           <p className="text-center text-sm text-gray-700 mb-4 italic">
//             "{user.bio}"
//           </p>
//         )}

//         {/* Friend Tags */}
//         <div className="flex flex-wrap justify-center gap-2 mb-4">
//           {user.friendTags.map((tag, index) => (
//             <span
//               key={index}
//               className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
//             >
//               {tag}
//             </span>
//           ))}
//         </div>

//         {/* Interest Tags */}
//         <div className="flex flex-wrap justify-center gap-2 mb-6">
//           {user.interests.map((interest, index) => (
//             <span
//               key={index}
//               className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
//             >
//               {interest}
//             </span>
//           ))}
//         </div>

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
//       <div className="mt-6 w-full mx-auto bg-white p-4 rounded-xl shadow-sm">
//         <h2 className="text-sm text-gray-500 mb-2">No groups in common</h2>
//         <div className="flex items-center gap-3 mb-4 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition duration-200">
//           <div className="p-2 rounded-full bg-purple-700 text-white">
//             <Users className="w-6 h-6" />
//           </div>
//           <span className="text-sm text-gray-800">
//             Create group with {user.name || "Eugene Fidelis"}
//           </span>
//         </div>
//       </div>

//       {/* Unfriend & Report */}
//       <div className="mt-6 w-full mx-auto bg-white p-4 rounded-xl shadow-sm">
//         <div className="flex items-center gap-3 mb-4 hover:bg-red-100 p-2 rounded-lg cursor-pointer transition duration-200">
//           <div className="p-2 rounded-full bg-red-600 text-white">
//             <UserMinus2Icon className="w-6 h-6" />
//           </div>
//           <span className="text-sm text-red-700 font-medium">Unfriend</span>
//         </div>
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
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import messageStore from "../store/messageStore";

export default function FriendsProfile() {
  const { selectedUser } = messageStore();
  const dummyUser = {
    name: "Bob",
    age: 23,
    profileImage: "/baily1.webp",
    photos: ["/baily1.webp", "/baily1.webp", "/baily1.webp"],
    interests: ["Hiking", "Board Games", "Photography", "Coffee"],
    friendTags: ["🎮 Gaming Buddy", "🧘 Chill Hangs", "📚 Study Partner"],
    bio: "Life is better with friends!",
  };

  const user = selectedUser || dummyUser;
  const navigate = useNavigate();

  const profileIcon = [
    { name: "Message", icon: MessageSquare, label: "Message" },
    { name: "Calls", icon: Phone, label: "Calls" },
    { name: "Video", icon: Video, label: "Video" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let percentage = Math.min((elapsed / 30000) * 100, 100);

      if (currentIndex === user.photos.length - 1) {
        percentage = Math.min(percentage, 100);
      }

      setProgress(percentage);
    }, 100);

    if (currentIndex < user.photos.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 30000);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, user.photos.length]);

  function handleCarouselClick(e) {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - boundingRect.left;

    if (clickX > boundingRect.width / 2) {
      setCurrentIndex((prevIndex) =>
        prevIndex < user.photos.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else {
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center p-4 sm:p-6 relative bg-gray-50">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-purple-600 hover:text-purple-800 font-semibold text-sm sm:text-base z-10"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-1" />
        Back
      </button>

      {/* Photo Carousel */}
      <div className="w-full max-w-md mx-auto mb-6 mt-12 relative select-none">
        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-2 px-2">
          {user.photos.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            const fillWidth = isCurrent
              ? progress
              : idx < currentIndex
              ? 100
              : 0;

            return (
              <div
                key={idx}
                className="bg-gray-300 rounded overflow-hidden"
                style={{ width: 30, height: 4, flexShrink: 0 }}
                aria-label={`Image ${idx + 1} progress indicator`}
              >
                <div
                  className={`bg-purple-600 h-4 transition-all duration-100`}
                  style={{ width: `${fillWidth}%` }}
                />
              </div>
            );
          })}
        </div>

        <div
          onClick={handleCarouselClick}
          className="relative w-full aspect-[4/5] cursor-pointer rounded-xl overflow-hidden border border-gray-300 shadow-md flex justify-center items-center bg-white"
        >
          <img
            src={user.photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className="object-cover w-full h-full select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="flex flex-col items-center p-6 rounded-xl shadow-lg bg-white w-full max-w-md mx-auto">
        {/* Name & Age */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
          {user.name || "Bob"}
          <span className="text-sm sm:text-base text-gray-500 ml-2">
            {user.age ? `• ${user.age}` : "• 23"}
          </span>
        </h1>
        <p className="text-sm text-green-500 mb-3 mt-1">Online</p>

        {/* Bio */}
        {user.bio && (
          <p className="text-center text-sm sm:text-base text-gray-700 mb-5 italic max-w-[90%]">
            "{user.bio}"
          </p>
        )}

        {/* Friend Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-[90%]">
          {user.friendTags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Interest Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-[90%]">
          {user.interests.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm whitespace-nowrap"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between w-full gap-4 max-w-xs sm:max-w-md">
          {profileIcon.map((profile) => {
            const Icon = profile.icon;
            return (
              <button
                key={profile.name}
                className="flex-1 flex flex-col items-center p-3 rounded-lg border border-gray-300 hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={profile.label}
              >
                <Icon className="w-7 h-7 text-purple-600" />
                <span className="text-sm font-medium mt-2 text-gray-700">
                  {profile.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* No Common Groups */}
      <div className="mt-8 w-full max-w-md bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-sm text-gray-500 mb-2">No groups in common</h2>
        <div className="flex items-center gap-3 mb-4 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition duration-200">
          <div className="p-2 rounded-full bg-purple-700 text-white">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-sm text-gray-800 truncate">
            Create group with {user.name || "Eugene Fidelis"}
          </span>
        </div>
      </div>

      {/* Unfriend & Report */}
      <div className="mt-6 w-full max-w-md bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-4 hover:bg-red-100 p-2 rounded-lg cursor-pointer transition duration-200">
          <div className="p-2 rounded-full bg-red-600 text-white">
            <UserMinus2Icon className="w-6 h-6" />
          </div>
          <span className="text-sm text-red-700 font-medium">Unfriend</span>
        </div>
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
