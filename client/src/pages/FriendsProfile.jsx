import {
  MessageSquare,
  Phone,
  UserMinus2Icon,
  Users,
  Video,
  Ban,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import messageStore from "../store/messageStore";
import React from "react";

export default function FriendsProfile() {
  const { selectedUser, onlineUsersId } = messageStore();
  const navigate = useNavigate();

  // Provide fallback values if missing
  const user = selectedUser || {};
  const profileImage = user.profileImage || "/Images/avatar.png";
  const name = user.nickname || "Unknown User";
  const age = user.age || 23;
  const bio = user.bio || "";
  const interests = user.interests || [];
  const friendTags = user.friendTags || [];
  const isOnline =
    Array.isArray(onlineUsersId) && onlineUsersId.includes(user._id);

  const profileIcon = [
    { name: "Message", icon: MessageSquare, label: "Message" },
    { name: "Calls", icon: Phone, label: "Calls" },
    { name: "Video", icon: Video, label: "Video" },
  ];

  return (
    <section className="w-full min-h-screen flex flex-col items-center p-6 relative bg-gray-50">
      {/* Back Button */}
      <button
        onClick={() => {
          // navigate(-1);
          // setSelectedUser(null);
          // setSelectedGroup(null);
          navigate("/", { state: { goToChat: true } });
        }}
        className="absolute top-4 left-4 flex items-center text-purple-700 hover:text-purple-900 font-semibold text-sm sm:text-base z-10"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-1" />
        Back
      </button>

      {/* Profile Photo */}
      <div className="mt-16 mb-6">
        <img
          src={profileImage}
          alt={`${name} profile`}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover shadow-lg border-4 border-purple-700"
          draggable={false}
        />
      </div>

      {/* Profile Info Card */}
      <div className="flex flex-col items-center p-6 rounded-xl shadow-lg bg-white w-full max-w-md mx-auto">
        {/* Name & Age */}
        <h1 className="text-3xl font-semibold text-black text-center">
          {name}
          <span className="text-base text-gray-600 ml-3">• {age}</span>
        </h1>

        {/* Online Status */}
        <p
          className={`text-sm mb-3 mt-1 ${
            isOnline ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </p>

        {/* Bio */}
        {bio && (
          <p className="text-center text-base text-gray-700 mb-5 italic max-w-[90%]">
            "{bio}"
          </p>
        )}

        {/* Friend Tags */}
        {friendTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-5 max-w-[90%]">
            {friendTags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Interest Tags */}
        {interests.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-[90%]">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="px-4 py-1 bg-gray-200 text-gray-800 rounded-full text-sm whitespace-nowrap"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between w-full gap-6 max-w-xs sm:max-w-md">
          {profileIcon.map(({ name, icon, label }) => {
            const Icon = icon;

            // Navigate only for "Message"
            const handleClick = () => {
              if (name === "Message") {
                // In FriendsProfile.jsx
                navigate("/", { state: { goToChat: true } });
              }
            };

            return (
              <button
                key={name}
                onClick={handleClick}
                className="flex-1 flex flex-col items-center p-3 rounded-lg border border-gray-300 hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 active:animate-bounce"
                aria-label={label}
              >
                <Icon className="w-7 h-7 text-purple-700" />
                <span className="text-sm font-medium mt-2 text-black">
                  {label}
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
          <div className="p-2 rounded-full bg-purple-800 text-white">
            <Users className="w-6 h-6" />
          </div>
          <span
            onClick={() => {
              navigate("/create-group");
            }}
            className="text-sm text-gray-900 truncate"
          >
            Create group with {name}
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
