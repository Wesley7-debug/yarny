import React from "react";
import {
  PhoneCallIcon,
  PlusCircle,
  UserMinusIcon,
  VideoIcon,
  EllipsisVertical,
  ArrowLeft,
  Palette,
  Info,
} from "lucide-react";
import Dropdown from "../ui/Dropdown"; // Assuming you have this
import { Link } from "react-router-dom";
import useGroupStore from "../../store/groupStore";

const GroupChatHeader = ({ selectedGroup, onClose }) => {
  const { setSelectedGroup } = useGroupStore();

  if (!selectedGroup) return null;

  // Dropdown options tailored for groups
  const groupHeaderDropdownOptions = [
    {
      label: (
        <Link to="/create-group" className="flex items-center gap-2 w-full">
          <Info className="w-4 h-4" />
          <span>group info</span>
        </Link>
      ),
    },
    {
      label: (
        <Link to="/" className="flex items-center gap-2 w-full">
          <Palette className="w-4 h-4" />
          <span>Group Theme</span>
        </Link>
      ),
    },
    {
      label: (
        <button
          onClick={() => {
            // Example action: leave group logic here
            alert("Leave group clicked");
          }}
          className="flex items-center gap-2 w-full text-red-600"
        >
          <UserMinusIcon className="w-4 h-4" />
          <span>Leave Group</span>
        </button>
      ),
    },
  ];

  return (
    <div className="p-3 border-b border-base-300 bg-white/80 backdrop-blur-md flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setSelectedGroup(selectedGroup._id ? null : selectedGroup._id);
            if (onClose) onClose();
          }}
          aria-label="Back to groups"
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
        </button>

        {/* Group Avatar */}
        {selectedGroup.groupAvatar ? (
          <img
            src={selectedGroup.groupAvatar || "/Images/avatar.png"}
            alt={`${selectedGroup.name} avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg uppercase">
            {selectedGroup.name.charAt(0)}
          </div>
        )}

        {/* Group Info */}
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            {selectedGroup.name}
          </h2>
          <p className="text-xs text-gray-500 truncate max-w-xs">
            {selectedGroup.participants
              .map((p) => p.username || p.nickname || "Unknown")
              .join(", ")}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Start group video call"
          className="hover:bg-gray-200 p-1 rounded transition"
        >
          <VideoIcon className="w-5 h-5" />
        </button>

        <Dropdown
          trigger={
            <div className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer">
              <EllipsisVertical className="w-5 h-5" />
            </div>
          }
          options={groupHeaderDropdownOptions}
        />
      </div>
    </div>
  );
};

export default GroupChatHeader;
