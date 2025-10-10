import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const friendRequests = [
  { id: 1, name: "Emily", avatar: "https://via.placeholder.com/150" },
  { id: 2, name: "Leo", avatar: "https://via.placeholder.com/150" },
];

export default function FriendsTab() {
  const handleAccept = (name) => {
    toast.success(`${name} added as a friend 🎉`);
  };

  const handleDecline = (name) => {
    toast.info(`Declined ${name}'s request`);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black px-4 py-20 sm:px-8 md:px-14 lg:px-24">
      <h2 className="text-3xl font-extrabold mb-8 text-purple-800">Friends</h2>

      {/* Friend Requests */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">
          Pending Requests
        </h3>

        {friendRequests.length === 0 ? (
          <p className="text-gray-500">No new friend requests</p>
        ) : (
          <div className="space-y-5">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-lg truncate">{request.name}</p>
                  <p className="text-sm text-gray-500">
                    Wants to connect with you
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(request.name)}
                    className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-full transition"
                    aria-label="Accept request"
                  >
                    <Plus size={20} />
                  </button>

                  <button
                    onClick={() => handleDecline(request.name)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition"
                    aria-label="Decline request"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
