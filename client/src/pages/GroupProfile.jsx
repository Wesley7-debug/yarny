import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  UserMinus2Icon,
  BellIcon,
  UserPlus,
} from "lucide-react";

const GroupProfile = () => {
  const navigate = useNavigate();
  const groupInfoRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  // Dummy group data
  const group = {
    name: "Design Team 💡",
    groupAvatar: "/Images/group-avatar.jpg",
    participants: [
      {
        _id: "1",
        username: "Alice",
        email: "alice@example.com",
        avatarUrl: "/Images/alice.png",
      },
      {
        _id: "2",
        username: "Bob",
        email: "bob@example.com",
        avatarUrl: "/Images/bob.png",
      },
      {
        _id: "3",
        username: "Charlie",
        email: "charlie@example.com",
        avatarUrl: "/Images/charlie.png",
      },
      {
        _id: "4",
        username: "Diana",
        email: "diana@example.com",
        avatarUrl: "/Images/diana.png",
      },
      {
        _id: "5",
        username: "Eve",
        email: "eve@example.com",
        avatarUrl: "/Images/eve.png",
      },
      {
        _id: "6",
        username: "Frank",
        email: "frank@example.com",
        avatarUrl: "/Images/frank.png",
      },
      {
        _id: "7",
        username: "Grace",
        email: "grace@example.com",
        avatarUrl: "/Images/grace.png",
      },
      {
        _id: "8",
        username: "Hank",
        email: "hank@example.com",
        avatarUrl: "/Images/hank.png",
      },
      {
        _id: "9",
        username: "Ivy",
        email: "ivy@example.com",
        avatarUrl: "/Images/ivy.png",
      },
      {
        _id: "10",
        username: "Jack",
        email: "jack@example.com",
        avatarUrl: "/Images/jack.png",
      },
      {
        _id: "11",
        username: "Kate",
        email: "kate@example.com",
        avatarUrl: "/Images/kate.png",
      },
      {
        _id: "12",
        username: "Leo",
        email: "leo@example.com",
        avatarUrl: "/Images/leo.png",
      },
      {
        _id: "13",
        username: "Mia",
        email: "mia@example.com",
        avatarUrl: "/Images/mia.png",
      },
      {
        _id: "14",
        username: "Nina",
        email: "nina@example.com",
        avatarUrl: "/Images/nina.png",
      },
    ],
  };

  // Scroll handler for mobile sticky header group info
  useEffect(() => {
    function onScroll() {
      if (window.innerWidth > 768) {
        setIsSticky(false);
        return;
      }
      if (!groupInfoRef.current) return;

      const groupInfoBottom =
        groupInfoRef.current.getBoundingClientRect().bottom;
      setIsSticky(groupInfoBottom <= 56); // 56px ~ header height
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dummy leave group handler
  const handleLeaveGroup = () => {
    alert("You have left the group.");
  };

  // Add user as private friend handler
  const handleAddFriend = () => {
    alert("Add user as private friend feature coming soon!");
  };

  // Determine participants to show
  const participantsToShow = showAllParticipants
    ? group.participants
    : group.participants.slice(0, 5);

  return (
    <div className="w-full h-full bg-white text-black flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-30 shadow-sm">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-purple-700 hover:text-purple-800 transition flex items-center gap-1 min-w-[60px]"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium hidden sm:inline">Back</span>
        </button>

        {/* Center Group Info (visible only when sticky on mobile) */}
        <div
          className={`flex items-center gap-3 truncate max-w-[60vw] transition-opacity duration-300 ease-in-out
          ${isSticky ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          aria-hidden={!isSticky}
        >
          <img
            src={group.groupAvatar}
            alt="Group Avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-600"
          />
          <div className="truncate text-center leading-tight">
            <h2 className="font-semibold text-purple-700 truncate">
              {group.name}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {group.participants.length} participants
            </p>
          </div>
        </div>

        {/* More menu button placeholder */}
        <button
          className="text-gray-700 hover:text-purple-700 transition min-w-[40px] flex justify-end"
          aria-label="More options"
        >
          <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      {/* BIG Group Info below header */}
      <section
        ref={groupInfoRef}
        className={`flex flex-col items-center py-8 border-b border-gray-100 px-6 text-center transition-opacity duration-300 ease-in-out
        ${
          isSticky
            ? "opacity-0 pointer-events-none h-0 overflow-hidden"
            : "opacity-100"
        }
        `}
        aria-hidden={isSticky}
      >
        <img
          src={group.groupAvatar}
          alt="Group Avatar"
          className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-600"
        />
        <h2 className="mt-4 text-3xl font-semibold">{group.name}</h2>
        <p className="text-sm text-gray-500">
          {group.participants.length} participants
        </p>
      </section>

      {/* Participants List */}
      <section className="flex-1 overflow-y-auto p-6">
        <h3 className="mb-4 text-lg font-bold">Group members</h3>
        <ul className="space-y-4">
          {participantsToShow.map((user) => (
            <li key={user._id} className="flex items-center gap-4 w-full">
              <img
                src={user.avatarUrl || "/Images/avatar.png"}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p className="font-medium text-black">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleAddFriend}
                aria-label="Add user as private friend"
                className="text-purple-700 hover:text-purple-800 transition p-1 rounded-full ml-auto"
                title="Add user as private friend"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <h3 className="text-md font-semibold text-gray-700 mb-4 flex justify-between items-center">
          <span>Participants</span>

          <div className="flex items-center gap-3">
            {/* View All / Show Less toggle */}
            {group.participants.length > 7 && (
              <button
                onClick={() => setShowAllParticipants((v) => !v)}
                className="text-purple-700  text-sm"
              >
                {showAllParticipants ? "show less" : "view all"}
              </button>
            )}

            {/* Add User as Private Friend */}
          </div>
        </h3>
      </section>

      {/* Actions */}
      <section className="p-6 border-t border-gray-200 space-y-4">
        <button className="w-full flex items-center justify-center gap-3 text-sm font-semibold text-purple-700 hover:bg-purple-100 px-4 py-3 rounded transition">
          <BellIcon className="w-5 h-5" />
          Mute Notifications
        </button>

        <button
          onClick={handleLeaveGroup}
          className="w-full flex items-center justify-center gap-3 text-sm font-semibold text-red-600 hover:bg-red-100 px-4 py-3 rounded transition"
        >
          <UserMinus2Icon className="w-5 h-5" />
          Leave Group
        </button>

        {/* Admin-only Delete button placeholder */}
        <button
          disabled
          className="w-full flex items-center justify-center gap-3 text-sm font-semibold text-red-900 bg-red-100 px-4 py-3 rounded opacity-50 cursor-not-allowed"
          title="Admin only"
        >
          <UserMinus2Icon className="w-5 h-5" />
          Delete Group (Admin)
        </button>

        {/* Report group */}
        <button className="w-full flex items-center justify-center gap-3 text-sm font-semibold text-yellow-800 hover:bg-yellow-100 px-4 py-3 rounded transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
          </svg>
          Report Group
        </button>
      </section>
    </div>
  );
};

export default GroupProfile;
