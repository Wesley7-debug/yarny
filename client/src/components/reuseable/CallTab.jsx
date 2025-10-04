import React, { useEffect, useState } from "react";
import { PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";

const CALL_HISTORY_KEY = "missedCalls";

const dummyCalls = [
  {
    id: 1,
    name: "Alice",
    type: "missed",
    time: "10:45 AM",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "Bob",
    type: "incoming",
    time: "11:00 AM",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 3,
    name: "Clara",
    type: "outgoing",
    time: "11:30 AM",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Derek",
    type: "missed",
    time: "12:15 PM",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 5,
    name: "Eva",
    type: "incoming",
    time: "1:05 PM",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 6,
    name: "Frank",
    type: "outgoing",
    time: "2:20 PM",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 7,
    name: "Grace",
    type: "missed",
    time: "3:40 PM",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    id: 8,
    name: "Henry",
    type: "incoming",
    time: "4:10 PM",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
];

export default function CallTab() {
  const [missedCalls, setMissedCalls] = useState([]);
  const [answeredCalls, setAnsweredCalls] = useState([]);

  useEffect(() => {
    // Load missed calls from localStorage if available
    const savedMissed = JSON.parse(localStorage.getItem(CALL_HISTORY_KEY));
    if (savedMissed && Array.isArray(savedMissed)) {
      setMissedCalls(savedMissed);
    } else {
      // No saved missed calls, load from dummy data
      const missed = dummyCalls.filter((call) => call.type === "missed");
      setMissedCalls(missed);
      localStorage.setItem(CALL_HISTORY_KEY, JSON.stringify(missed));
    }

    // Load answered calls from dummy data
    const answered = dummyCalls.filter(
      (call) => call.type === "incoming" || call.type === "outgoing"
    );
    setAnsweredCalls(answered);
  }, []);

  // Icon helper based on call type
  const getIcon = (type) => {
    if (type === "incoming")
      return <PhoneIncoming className="text-green-500" size={18} />;
    if (type === "outgoing")
      return <PhoneOutgoing className="text-blue-500" size={18} />;
    return <PhoneMissed className="text-red-500" size={18} />;
  };

  return (
    <div className="bg-white min-h-screen text-black w-full pt-15 p-6 md:p-10  mx-auto">
      <h2 className="text-3xl font-bold mb-8">Calls</h2>

      {/* Missed Calls */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
          <PhoneMissed size={24} /> Missed Calls
        </h3>
        {missedCalls.length === 0 ? (
          <p className="text-gray-500">No missed calls</p>
        ) : (
          <div className="space-y-4">
            {missedCalls.map(({ id, name, time, avatar, type }) => (
              <div
                key={id}
                className="flex items-center bg-red-50 rounded-lg p-3 shadow-sm w-full"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-300 mr-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-600">{time}</p>
                </div>
                {getIcon(type)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Answered Calls */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <PhoneIncoming size={24} className="text-green-600" />
          <PhoneOutgoing size={24} className="text-blue-600" />
          Answered Calls
        </h3>
        {answeredCalls.length === 0 ? (
          <p className="text-gray-500">No answered calls</p>
        ) : (
          <div className="space-y-4">
            {answeredCalls.map(({ id, name, time, avatar, type }) => (
              <div
                key={id}
                className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm w-full"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-600">{time}</p>
                </div>
                {getIcon(type)}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
