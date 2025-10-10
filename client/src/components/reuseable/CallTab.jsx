import React, { useEffect, useState } from "react";
import { PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";

const CALL_HISTORY_KEY = "callHistory";

const getIcon = (type) => {
  if (type === "incoming")
    return <PhoneIncoming className="text-green-500" size={18} />;
  if (type === "outgoing")
    return <PhoneOutgoing className="text-blue-500" size={18} />;
  return <PhoneMissed className="text-red-500" size={18} />;
};

const CallCard = ({ name, time, avatar, type }) => (
  <div className="flex items-center bg-white hover:bg-gray-50 rounded-lg p-4 shadow transition">
    <img
      src={avatar}
      alt={name}
      className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover mr-4"
    />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-base truncate">{name}</p>
      <p className="text-sm text-gray-500">
        {new Date(time).toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
    <div>{getIcon(type)}</div>
  </div>
);

export default function CallTab() {
  const [missedCalls, setMissedCalls] = useState([]);
  const [answeredCalls, setAnsweredCalls] = useState([]);

  useEffect(() => {
    const savedCalls = JSON.parse(
      localStorage.getItem(CALL_HISTORY_KEY) || "[]"
    );

    setMissedCalls(savedCalls.filter((call) => call.type === "missed"));
    setAnsweredCalls(
      savedCalls.filter(
        (call) => call.type === "incoming" || call.type === "outgoing"
      )
    );
  }, []);

  return (
    <div className="bg-white min-h-screen text-black w-full pt-16 px-4 sm:px-6 md:px-10 lg:px-20">
      <h2 className="text-3xl font-extrabold text-purple-800 mb-8">
        Call History
      </h2>

      {/* Missed Calls */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <PhoneMissed className="text-red-500" size={22} />
          <h3 className="text-xl font-semibold text-red-600">Missed Calls</h3>
        </div>
        {missedCalls.length === 0 ? (
          <p className="text-gray-500">No missed calls</p>
        ) : (
          <div className="space-y-4">
            {missedCalls.map((call) => (
              <CallCard key={call.id} {...call} />
            ))}
          </div>
        )}
      </section>

      {/* Answered Calls */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <PhoneIncoming className="text-green-600" size={22} />
          <PhoneOutgoing className="text-blue-600" size={22} />
          <h3 className="text-xl font-semibold text-gray-700">
            Answered Calls
          </h3>
        </div>
        {answeredCalls.length === 0 ? (
          <p className="text-gray-500">No answered calls</p>
        ) : (
          <div className="space-y-4">
            {answeredCalls.map((call) => (
              <CallCard key={call.id} {...call} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
