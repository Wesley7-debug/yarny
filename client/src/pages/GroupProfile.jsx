import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  UserMinus2Icon,
  BellIcon,
  UserPlus,
  LoaderCircle,
  Receipt,
  RefreshCcw,
  Copy,
  Loader,
  UserPlusIcon,
} from "lucide-react";
import useGroupStore from "../store/groupStore";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

const GroupProfile = () => {
  const navigate = useNavigate();
  const groupInfoRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const {
    getGroupInfo,
    groupInfo,
    deleteGroup,
    isDeletingGroup,
    regenerateinvitationLink,
    isGeneratingInviteLink,
  } = useGroupStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getGroupInfo();
  }, [getGroupInfo]);
  // Scroll handler for sticky header on mobile
  useEffect(() => {
    function onScroll() {
      if (window.innerWidth > 768) {
        setIsSticky(false);
        return;
      }
      if (!groupInfoRef.current) return;

      const groupInfoBottom =
        groupInfoRef.current.getBoundingClientRect().bottom;
      setIsSticky(groupInfoBottom <= 56); // header height approx.
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!groupInfo) {
    return <div>Loading group info...</div>;
  }
  console.log("group info", groupInfo);
  const groupName = groupInfo.name;
  const groupAvatar = groupInfo.groupAvatar || "/Images/group.png";
  const groupInviteLink = groupInfo.inviteTokens;
  console.log("group invite token", groupInviteLink);

  // participants is an array, so map to get usernames or nicknames
  const groupParticipants = groupInfo.participants || [];

  // Check if current user is admin
  const isAdmin = groupInfo.admin?.some(
    (admin) => admin._id === authUser.userId
  );

  // Participants to show (limit to 5 unless showAllParticipants is true)
  const participantsToShow = showAllParticipants
    ? groupParticipants
    : groupParticipants.slice(0, 5);

  const handleLeaveGroup = () => {
    alert("You have left the group.");
  };

  const handleAddFriend = () => {
    alert("Add user as private friend feature coming soon!");
  };

  return (
    <div className="w-full h-full bg-white text-black flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-30 shadow-sm">
        {/* Back Button */}
        <button
          onClick={() => navigate("/", { state: { goToChat: true } })}
          className="text-purple-700 hover:text-purple-800 transition flex items-center gap-1 min-w-[60px]"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium hidden sm:inline">Back</span>
        </button>

        {/* Center Group Info (sticky on mobile) */}
        <div
          className={`flex items-center gap-3 truncate max-w-[60vw] transition-opacity duration-300 ease-in-out
          ${isSticky ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          aria-hidden={!isSticky}
        >
          <img
            src={groupAvatar}
            alt="Group Avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-600"
          />
          <div className="truncate text-center leading-tight">
            <h2 className="font-semibold text-purple-700 truncate">
              {groupName}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {groupParticipants.length} participant
              {groupParticipants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* More options */}
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
          src={groupAvatar}
          alt="Group Avatar"
          className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-600"
        />
        <h2 className="mt-4 text-3xl font-semibold">{groupName}</h2>
        <p className="text-sm text-gray-500">
          {groupParticipants.length} participant
          {groupParticipants.length !== 1 ? "s" : ""}
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
                alt={user.nickname || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-black">
                  {user.nickname || "Unknown"}
                </p>
                {/* Optional: show email if available */}
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
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
            {groupParticipants.length > 7 && (
              <button
                onClick={() => setShowAllParticipants((v) => !v)}
                className="text-purple-700 text-sm"
              >
                {showAllParticipants ? "show less" : "view all"}
              </button>
            )}
          </div>
        </h3>
      </section>
      {/* Group Invite Link (Admin only) */}
      {isAdmin && groupInviteLink?.length > 0 && (
        <section className="px-6 pt-4 pb-2 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Invite Link
          </h3>
          <div className="flex items-center justify-between gap-3 bg-gray-100 rounded-md px-3 py-2">
            <span className="truncate text-sm text-gray-800 flex-1">
              {`${window.location.origin}/join-group/${groupInviteLink[0].token}`}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/join-group/${groupInviteLink[0].token}`,
                  toast.success("copied to clipboard")
                );
              }}
              title="Copy to clipboard"
              className="text-purple-700 hover:text-purple-800 transition p-1"
            >
              <Copy />
            </button>
            {isGeneratingInviteLink ? (
              <LoaderCircle className="animate-spin text-white w-8 h-8" />
            ) : (
              <button
                onClick={() => {
                  regenerateinvitationLink();
                }}
                title="Regenerate invite link"
                className="text-purple-700 hover:text-purple-800 transition p-1"
              >
                <RefreshCcw />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Expires:{" "}
            {new Date(groupInviteLink[0].expiresAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </section>
      )}

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

        {/* Admin-only Delete button */}
        {isAdmin && (
          <>
            <button
              onClick={() => deleteGroup(navigate)}
              className="w-full flex items-center justify-center gap-3 text-sm font-semibold text-blue-900 bg-blue-100 px-4 py-3 rounded hover:bg-red-200 transition"
              title="Admin only"
            >
              <UserPlusIcon className="w-5 h-5" />
              Add friend
            </button>
            <button
              onClick={() => deleteGroup(navigate)}
              className="w-full flex items-center justify-center gap-3 text-sm font-semibold text-red-900 bg-red-100 px-4 py-3 rounded hover:bg-red-200 transition"
              title="Admin only"
            >
              <UserMinus2Icon className="w-5 h-5" />
              Delete Group
            </button>
          </>
        )}

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
      {isDeletingGroup && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <LoaderCircle className="animate-spin text-white w-8 h-8" />
        </div>
      )}
    </div>
  );
};

export default GroupProfile;
