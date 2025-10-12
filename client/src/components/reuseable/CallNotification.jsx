import { useEffect } from "react";
import useCallStore from "../../store/useCallStore";
import { getSocket } from "../../utils/socket";
import { PhoneIncoming, PhoneOff, PhoneCall } from "lucide-react";

export default function CallNotification() {
  const {
    caller,
    setCaller,
    setShowCallScreen,
    answerCall,
    endCall,
    setShowCallNotification,
  } = useCallStore();

  useEffect(() => {
    if (caller.length > 0) {
      if (window.navigator.vibrate) {
        window.navigator.vibrate([300, 200, 300]);
      }

      const timeout = setTimeout(() => {
        setCaller([]);
        setShowCallNotification(false);
        endCall();
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, [caller]);

  if (caller.length === 0) return null;

  const { from, callType } = caller[0];

  const handleAccept = () => {
    setShowCallScreen(true);
    setShowCallNotification(false);
    answerCall({ from, offer: caller[0].offer });
    setCaller([]);
  };

  const handleReject = () => {
    const socket = getSocket();
    const caller = useCallStore.getState().caller;

    if (caller.length === 0) return;

    const calleeId = caller[0].from?.id;

    if (!calleeId) {
      console.error(
        "handleReject: caller[0].from.id is undefined",
        caller[0].from
      );
      return;
    }

    socket.emit("call-declined", { to: calleeId });

    endCall();
    setCaller([]);
    setShowCallNotification(false);
  };

  // Icon for call type
  const CallIcon = callType === "video" ? PhoneCall : PhoneIncoming;

  return (
    <div className="fixed top-5 right-5 w-72 bg-white border border-purple-700 rounded-3xl shadow-lg backdrop-blur-sm bg-opacity-70 flex items-center p-3 space-x-4 z-[9999]">
      {/* Left Icon */}
      <div className="flex-shrink-0 rounded-full bg-purple-700 bg-opacity-90 p-3 shadow-md flex items-center justify-center">
        <CallIcon className="w-7 h-7 text-white" />
      </div>

      {/* Middle Text */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-semibold text-black truncate">
          {from.nickname || "Unknown Caller"}
        </p>
        <p className="text-xs text-purple-700 opacity-80 truncate">
          Incoming {callType} call
        </p>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 items-center">
        <button
          onClick={handleReject}
          aria-label="Decline call"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleAccept}
          aria-label="Accept call"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-700 hover:bg-purple-800 transition"
        >
          <PhoneIncoming className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
