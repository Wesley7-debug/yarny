import React, { useEffect } from "react";
import useGroupStore from "../../store/groupStore";

const GroupTab = () => {
  const {
    groups,
    getUsersGroup,
    getGroupMessages,
    isGettingGroups,
    selectedGroup,
    setSelectedGroup,
  } = useGroupStore();

  useEffect(() => {
    getUsersGroup(); // Fetch groups when component mounts
  }, [getUsersGroup]);

  const handleGroupClick = async (group) => {
    setSelectedGroup({ ...group, isGroup: true });
    await getGroupMessages(group._id); // Fetch group messages
  };

  if (isGettingGroups) {
    return (
      <div className="text-center py-4 text-purple-500">Loading groups...</div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-4 text-purple-500">
        No groups available. create or join one
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden rounded-lg">
      {groups.map((group) => {
        const isSelected =
          selectedGroup?._id === group._id && selectedGroup?.isGroup;

        return (
          <button
            key={group._id}
            onClick={() => handleGroupClick(group)}
            className={`w-full flex items-center px-4 py-3 border-b-4 border-purple-100 cursor-pointer transition-colors rounded-lg text-left ${
              isSelected
                ? "bg-purple-700 text-white"
                : group.unread
                ? "bg-purple-50"
                : "bg-white hover:bg-purple-100 text-purple-800"
            }`}
          >
            <img
              src={group.avatar || "/Images/group.png"}
              alt={group.name}
              className={`w-12 h-12 rounded-full mr-4 border-2 ${
                isSelected ? "border-purple-600" : "border-white"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div
                className={`font-semibold truncate ${
                  isSelected ? "text-white" : "text-purple-800"
                }`}
              >
                {group.name}
              </div>
              <div
                className={`text-sm truncate ${
                  isSelected ? "text-purple-200" : "text-purple-600"
                }`}
              >
                {group.lastMessage || ""}
              </div>
            </div>
            <div className="text-right min-w-[60px] flex flex-col items-end">
              <span
                className={`text-xs ${
                  isSelected ? "text-purple-300" : "text-purple-400"
                }`}
              >
                {group.time || ""}
              </span>
              {group.unread > 0 && (
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isSelected
                      ? "bg-purple-300 text-purple-900"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {group.unread}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default GroupTab;
