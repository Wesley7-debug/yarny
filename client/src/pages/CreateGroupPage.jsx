import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import friendsStore from "../store/friendsStore";
import useGroupStore from "../store/groupStore";

const CreateGroupPage = () => {
  const { friends, getAllUserFriends } = friendsStore();
  const { createClientGroup, isCreatingGroup } = useGroupStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupImageUrl, setGroupImageUrl] = useState(null); // string URL
  const [groupImageFile, setGroupImageFile] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  useEffect(() => {
    getAllUserFriends();
  }, [getAllUserFriends]);

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const goNext = () => {
    if (selectedUsers.length === 0) {
      alert("Select at least one member.");
      return;
    }
    setStep(2);
  };

  const handleEmojiClick = (emojiData) => {
    setGroupName((prev) => prev + emojiData.emoji);
  };

  const handleCreate = async () => {
    await createClientGroup({
      name: groupName,
      participants: selectedUsers,
      groupAvatar: groupImageFile,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setGroupImageFile(file);
      setGroupImageUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-white text-purple-800 flex justify-center">
      <div className="w-full max-w-2xl border-l border-r border-purple-200 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-purple-200">
          <button
            onClick={goBack}
            className="p-2 hover:bg-purple-100 rounded-full"
          >
            <ArrowLeft size={24} className="text-purple-600" />
          </button>
          <h2 className="flex-1 text-center font-semibold text-xl">
            {step === 1 ? "Add Group Members" : "Group Info"}
          </h2>
          <div className="w-10" />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="px-6 py-3 bg-gray-50">
              <span className="font-medium">
                {selectedUsers.length} / {friends.length} selected
              </span>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex gap-3 px-6 py-3 overflow-x-auto bg-gray-50 border-b border-purple-200">
                {selectedUsers.map((u) => (
                  <div key={u._id} className="relative">
                    <img
                      src={u.avatarUrl || "/Images/avatar.png"}
                      alt={u.nickname}
                      className="w-14 h-14 rounded-full border-2 border-purple-600 object-cover"
                    />
                    <button
                      onClick={() => toggleUser(u)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-500 text-red-500 rounded-full text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {friends.map((friend) => {
                const sel = selectedUsers.some((u) => u._id === friend._id);
                return (
                  <div
                    key={friend._id}
                    onClick={() => toggleUser(friend)}
                    className={`flex items-center gap-4 py-4 cursor-pointer px-3 transition ${
                      sel ? "bg-purple-50" : "hover:bg-purple-50"
                    }`}
                  >
                    <img
                      src={friend.avatarUrl || "/Images/avatar.png"}
                      alt={friend.nickname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {friend.nickname || friend.username}
                      </div>
                      <div className="text-sm text-purple-500 truncate">
                        @{friend.username}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sel}
                      readOnly
                      className="accent-purple-600"
                    />
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t bg-white">
              <button
                onClick={goNext}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col flex-1 px-6 py-6">
            {/* Group Image Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-purple-300 hover:border-purple-500 cursor-pointer"
                  onClick={() =>
                    document.getElementById("groupImageInput").click()
                  }
                >
                  {groupImageUrl ? (
                    <img
                      src={groupImageUrl}
                      alt="Group"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera size={32} className="text-purple-400" />
                  )}
                </div>
                {groupImageUrl && (
                  <button
                    onClick={() => {
                      setGroupImageUrl(null);
                      setGroupImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-500 text-red-500 rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                id="groupImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Group Name + Emoji */}
            <div className="mb-8 relative">
              <label className="block mb-2 text-sm font-medium">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full border border-purple-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 transition outline-none"
              />
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="absolute top-[65%] right-4 transform -translate-y-1/2 p-1"
              >
                <Smile size={24} className="text-purple-500" />
              </button>
              {showEmojiPicker && (
                <div className="absolute z-30 right-4 top-full mt-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            {/* Members Preview */}
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium">Members</label>
              <div className="flex flex-wrap gap-3">
                {selectedUsers.map((u) => (
                  <div key={u._id} className="flex items-center gap-2">
                    <img
                      src={u.avatarUrl || "/Images/avatar.png"}
                      alt={u.nickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm truncate">
                      {u.nickname || u.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={handleCreate}
                disabled={isCreatingGroup}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {isCreatingGroup ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroupPage;
