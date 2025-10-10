// import React, { useState, useEffect, useRef } from "react";
// import { PlusCircle, ChevronDown, X } from "lucide-react";
// import Dropdown from "../ui/Dropdown";
// import StatusPost from "./StatusPost";

// const STATUS_DURATION_MS = 30000;

// const initialGroupedStatuses = {
//   Alice: [
//     { id: 1, time: "10 minutes ago", image: "/baily1.webp", viewed: false },
//     { id: 4, time: "5 minutes ago", image: "/baily1.webp", viewed: false },
//   ],
//   Bob: [{ id: 2, time: "30 minutes ago", image: "/baily1.webp", viewed: true }],
//   Charlie: [
//     { id: 3, time: "1 hour ago", image: "/baily1.webp", viewed: false },
//     { id: 5, time: "50 minutes ago", image: "/baily1.webp", viewed: false },
//     { id: 6, time: "45 minutes ago", image: "/baily1.webp", viewed: false },
//   ],
// };

// export default function StatusTab() {
//   const [groupedStatuses, setGroupedStatuses] = useState(
//     initialGroupedStatuses
//   );
//   const [viewedStatuses, setViewedStatuses] = useState(new Set());
//   const [mutedUsers, setMutedUsers] = useState(new Set());
//   const [showMuted, setShowMuted] = useState(false);
//   const [viewing, setViewing] = useState({ user: null, index: 0, progress: 0 });
//   const [showStatusPost, setShowStatusPost] = useState(false);

//   const progressTimer = useRef(null);
//   const progressStartTime = useRef(null);

//   useEffect(() => {
//     if (!viewing.user) return;

//     const statuses = groupedStatuses[viewing.user];
//     if (!statuses) return;

//     setViewing((v) => ({ ...v, progress: 0 }));
//     progressStartTime.current = Date.now();

//     // Mark status as viewed
//     setViewedStatuses((prev) => {
//       const newSet = new Set(prev);
//       newSet.add(statuses[viewing.index].id);
//       return newSet;
//     });

//     function updateProgress() {
//       const elapsed = Date.now() - progressStartTime.current;
//       const prog = Math.min(elapsed / STATUS_DURATION_MS, 1);
//       setViewing((v) => ({ ...v, progress: prog }));

//       if (prog < 1) {
//         progressTimer.current = requestAnimationFrame(updateProgress);
//       } else {
//         const nextIdx = viewing.index + 1;
//         if (nextIdx < statuses.length) {
//           setViewing({ user: viewing.user, index: nextIdx, progress: 0 });
//         } else {
//           setViewing({ user: null, index: 0, progress: 0 });
//         }
//       }
//     }

//     progressTimer.current = requestAnimationFrame(updateProgress);

//     return () => {
//       if (progressTimer.current) cancelAnimationFrame(progressTimer.current);
//     };
//   }, [viewing.user, viewing.index, groupedStatuses]);

//   const handleNewStatus = (statusData) => {
//     setGroupedStatuses((prev) => {
//       const updated = { ...prev };
//       const newStatus = {
//         id: Date.now(),
//         time: "Just now",
//         image: statusData.mediaUrl || "/default-status-image.webp",
//         viewed: false,
//       };
//       if (!updated["Me"]) updated["Me"] = [];
//       updated["Me"] = [newStatus, ...updated["Me"]];
//       return updated;
//     });

//     setShowStatusPost(false);
//   };

//   const toggleMute = (user) => {
//     setMutedUsers((prev) => {
//       const newSet = new Set(prev);
//       newSet.has(user) ? newSet.delete(user) : newSet.add(user);
//       return newSet;
//     });
//   };

//   const getViewedFraction = (user) => {
//     const statuses = groupedStatuses[user] || [];
//     const total = statuses.length;
//     const viewed = statuses.filter((s) => viewedStatuses.has(s.id)).length;
//     return total ? viewed / total : 0;
//   };

//   // Add navigation functions for status viewer
//   const onPrevStatus = () => {
//     if (!viewing.user) return;
//     if (viewing.index > 0) {
//       setViewing({ user: viewing.user, index: viewing.index - 1, progress: 0 });
//     }
//   };

//   const onNextStatus = () => {
//     if (!viewing.user) return;
//     const statuses = groupedStatuses[viewing.user];
//     if (viewing.index + 1 < statuses.length) {
//       setViewing({ user: viewing.user, index: viewing.index + 1, progress: 0 });
//     } else {
//       setViewing({ user: null, index: 0, progress: 0 });
//     }
//   };

//   const StatusItem = ({ user, muted }) => {
//     const statuses = groupedStatuses[user];
//     const viewedAll = getViewedFraction(user) === 1;
//     const ring = viewedAll ? "border-gray-300" : "border-purple-700";
//     const progress =
//       viewing.user === user ? viewing.progress : getViewedFraction(user);

//     return (
//       <div className={`flex items-center mb-4 ${muted ? "opacity-50" : ""}`}>
//         <div
//           onClick={() => setViewing({ user, index: 0, progress: 0 })}
//           className="flex items-center flex-1 cursor-pointer"
//         >
//           <div
//             className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${ring} mr-4`}
//           >
//             <img
//               src={statuses[0].image}
//               alt={user}
//               className="object-cover w-full h-full"
//             />
//             <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
//               <div
//                 className="h-full bg-purple-700 transition-all"
//                 style={{ width: `${progress * 100}%` }}
//               />
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold">{user}</p>
//             <p className="text-sm text-gray-500">
//               {muted ? "Muted" : statuses[statuses.length - 1].time}
//             </p>
//           </div>
//         </div>
//         <Dropdown
//           trigger={<div className="cursor-pointer text-gray-700">⋮</div>}
//           options={[
//             {
//               label: muted ? "Unmute" : "Mute",
//               onClick: () => toggleMute(user),
//             },
//           ]}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="w-full min-h-screen text-black p-4 bg-white pt-16">
//       <h2 className="text-2xl font-bold mb-6">Status</h2>

//       {/* My Status */}
//       <div className="flex items-center mb-6 cursor-pointer">
//         <div className="relative">
//           <div className="w-16 h-16 rounded-full border-2 border-purple-700 overflow-hidden">
//             <img
//               src="/baily1.webp"
//               alt="My status"
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <PlusCircle
//             onClick={() => setShowStatusPost(true)}
//             size={24}
//             className="absolute bottom-0 right-0 text-purple-700 bg-white rounded-full"
//           />
//         </div>
//         <div className="ml-4">
//           <p className="font-semibold">My Status</p>
//           <p className="text-sm text-gray-900">Tap to add status update</p>
//         </div>
//       </div>

//       {/* Post status form */}
//       {showStatusPost && (
//         <div className="mb-6">
//           <StatusPost
//             onSubmit={handleNewStatus}
//             setShowStatusPost={setShowStatusPost}
//           />
//           <button
//             onClick={() => setShowStatusPost(false)}
//             className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Cancel
//           </button>
//         </div>
//       )}

//       {/* Recent updates */}
//       <h3 className="text-lg font-semibold mb-2 mt-4">Recent Updates</h3>
//       {Object.keys(groupedStatuses)
//         .filter((user) => !mutedUsers.has(user))
//         .map((user) => (
//           <StatusItem key={user} user={user} muted={false} />
//         ))}

//       {/* Muted section */}
//       <div
//         className="flex items-center mt-6 mb-2 cursor-pointer select-none"
//         onClick={() => setShowMuted((prev) => !prev)}
//       >
//         <p className="font-semibold text-gray-700 mr-2">Muted</p>
//         <ChevronDown
//           size={16}
//           className={`text-gray-700 transition-transform ${
//             showMuted ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {showMuted &&
//         Array.from(mutedUsers).map((user) => (
//           <StatusItem key={user} user={user} muted />
//         ))}

//       {/* Status Viewer Modal */}
//       {viewing.user && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//           onClick={() => setViewing({ user: null, index: 0, progress: 0 })}
//         >
//           <div
//             className="relative w-full h-full flex items-center justify-center cursor-pointer"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               src={groupedStatuses[viewing.user][viewing.index].image}
//               alt=""
//               className="object-contain max-w-full max-h-full"
//             />

//             {/* Prev / Next Click Zones */}
//             <div
//               className="absolute inset-y-0 left-0 w-1/2"
//               onClick={() => onPrevStatus()}
//             />
//             <div
//               className="absolute inset-y-0 right-0 w-1/2"
//               onClick={() => onNextStatus()}
//             />

//             {/* Progress Bar */}
//             <div className="absolute top-2 left-2 right-2 h-1 bg-gray-300 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-purple-700 transition-all"
//                 style={{ width: `${viewing.progress * 100}%` }}
//               />
//             </div>

//             {/* Close Button */}
//             <button
//               onClick={() => setViewing({ user: null, index: 0, progress: 0 })}
//               className="absolute top-2 right-2 text-white"
//             >
//               <X size={28} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, ChevronDown, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import StatusPost from "./StatusPost";

const STATUS_DURATION_MS = 30000;

const initialGroupedStatuses = {
  Alice: [
    { id: 1, time: "10 minutes ago", image: "/baily1.webp", viewed: false },
    { id: 4, time: "5 minutes ago", image: "/baily1.webp", viewed: false },
  ],
  Bob: [{ id: 2, time: "30 minutes ago", image: "/baily1.webp", viewed: true }],
  Charlie: [
    { id: 3, time: "1 hour ago", image: "/baily1.webp", viewed: false },
    { id: 5, time: "50 minutes ago", image: "/baily1.webp", viewed: false },
    { id: 6, time: "45 minutes ago", image: "/baily1.webp", viewed: false },
  ],
};

export default function StatusTab() {
  const [groupedStatuses, setGroupedStatuses] = useState(
    initialGroupedStatuses
  );
  const [viewedStatuses, setViewedStatuses] = useState(new Set());
  const [mutedUsers, setMutedUsers] = useState(new Set());
  const [showMuted, setShowMuted] = useState(false);
  const [viewing, setViewing] = useState({ user: null, index: 0, progress: 0 });
  const [showStatusPost, setShowStatusPost] = useState(false);

  const progressTimer = useRef(null);
  const progressStartTime = useRef(null);

  useEffect(() => {
    if (!viewing.user) return;

    const statuses = groupedStatuses[viewing.user];
    if (!statuses) return;

    setViewing((v) => ({ ...v, progress: 0 }));
    progressStartTime.current = Date.now();

    // Mark status as viewed
    setViewedStatuses((prev) => {
      const newSet = new Set(prev);
      newSet.add(statuses[viewing.index].id);
      return newSet;
    });

    function updateProgress() {
      const elapsed = Date.now() - progressStartTime.current;
      const prog = Math.min(elapsed / STATUS_DURATION_MS, 1);
      setViewing((v) => ({ ...v, progress: prog }));

      if (prog < 1) {
        progressTimer.current = requestAnimationFrame(updateProgress);
      } else {
        const nextIdx = viewing.index + 1;
        if (nextIdx < statuses.length) {
          setViewing({ user: viewing.user, index: nextIdx, progress: 0 });
        } else {
          setViewing({ user: null, index: 0, progress: 0 });
        }
      }
    }

    progressTimer.current = requestAnimationFrame(updateProgress);

    return () => {
      if (progressTimer.current) cancelAnimationFrame(progressTimer.current);
    };
  }, [viewing.user, viewing.index, groupedStatuses]);

  const handleNewStatus = (statusData) => {
    setGroupedStatuses((prev) => {
      const updated = { ...prev };
      const newStatus = {
        id: Date.now(),
        time: "Just now",
        image: statusData.mediaUrl || "/default-status-image.webp",
        viewed: false,
      };
      if (!updated["Me"]) updated["Me"] = [];
      updated["Me"] = [newStatus, ...updated["Me"]];
      return updated;
    });

    setShowStatusPost(false);
  };

  const toggleMute = (user) => {
    setMutedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.has(user) ? newSet.delete(user) : newSet.add(user);
      return newSet;
    });
  };

  const getViewedFraction = (user) => {
    const statuses = groupedStatuses[user] || [];
    const total = statuses.length;
    const viewed = statuses.filter((s) => viewedStatuses.has(s.id)).length;
    return total ? viewed / total : 0;
  };

  // Add navigation functions for status viewer
  const onPrevStatus = () => {
    if (!viewing.user) return;
    if (viewing.index > 0) {
      setViewing({ user: viewing.user, index: viewing.index - 1, progress: 0 });
    }
  };

  const onNextStatus = () => {
    if (!viewing.user) return;
    const statuses = groupedStatuses[viewing.user];
    if (viewing.index + 1 < statuses.length) {
      setViewing({ user: viewing.user, index: viewing.index + 1, progress: 0 });
    } else {
      setViewing({ user: null, index: 0, progress: 0 });
    }
  };

  const StatusItem = ({ user, muted }) => {
    const statuses = groupedStatuses[user];
    const viewedAll = getViewedFraction(user) === 1;
    const ring = viewedAll ? "border-gray-300" : "border-purple-700";
    const progress =
      viewing.user === user ? viewing.progress : getViewedFraction(user);

    return (
      <div className={`flex items-center mb-4 ${muted ? "opacity-50" : ""}`}>
        <div
          onClick={() => setViewing({ user, index: 0, progress: 0 })}
          className="flex items-center flex-1 cursor-pointer"
        >
          <div
            className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${ring} mr-4`}
          >
            <img
              src={statuses[0].image}
              alt={user}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
              <div
                className="h-full bg-purple-700 transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
          <div>
            <p className="font-semibold">{user}</p>
            <p className="text-sm text-gray-500">
              {muted ? "Muted" : statuses[statuses.length - 1].time}
            </p>
          </div>
        </div>
        <Dropdown
          trigger={<div className="cursor-pointer text-gray-700">⋮</div>}
          options={[
            {
              label: muted ? "Unmute" : "Mute",
              onClick: () => toggleMute(user),
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen text-black p-4 bg-white pt-16">
      <h2 className="text-2xl font-bold mb-6">Status</h2>

      {/* My Status */}
      <div className="flex items-center mb-6 cursor-pointer">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-purple-700 overflow-hidden">
            <img
              src="/baily1.webp"
              alt="My status"
              className="object-cover w-full h-full"
            />
          </div>
          <PlusCircle
            onClick={() => setShowStatusPost(true)}
            size={24}
            className="absolute bottom-0 right-0 text-purple-700 bg-white rounded-full"
          />
        </div>
        <div className="ml-4">
          <p className="font-semibold">My Status</p>
          <p className="text-sm text-gray-900">Tap to add status update</p>
        </div>
      </div>

      {/* Post status form */}
      {showStatusPost && (
        <div className="mb-6">
          <StatusPost
            onSubmit={handleNewStatus}
            setShowStatusPost={setShowStatusPost}
          />
          <button
            onClick={() => setShowStatusPost(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Recent updates */}
      <h3 className="text-lg font-semibold mb-2 mt-4">Recent Updates</h3>
      {Object.keys(groupedStatuses)
        .filter((user) => !mutedUsers.has(user))
        .map((user) => (
          <StatusItem key={user} user={user} muted={false} />
        ))}

      {/* Muted section */}
      <div
        className="flex items-center mt-6 mb-2 cursor-pointer select-none"
        onClick={() => setShowMuted((prev) => !prev)}
      >
        <p className="font-semibold text-gray-700 mr-2">Muted</p>
        <ChevronDown
          size={16}
          className={`text-gray-700 transition-transform ${
            showMuted ? "rotate-180" : ""
          }`}
        />
      </div>

      {showMuted &&
        Array.from(mutedUsers).map((user) => (
          <StatusItem key={user} user={user} muted />
        ))}

      {/* Status Viewer Modal */}
      {viewing.user && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setViewing({ user: null, index: 0, progress: 0 })}
        >
          <div
            className="relative w-full h-full flex items-center justify-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={groupedStatuses[viewing.user][viewing.index].image}
              alt=""
              className="object-contain max-w-full max-h-full"
            />

            {/* Prev / Next Click Zones */}
            <div
              className="absolute inset-y-0 left-0 w-1/2"
              onClick={() => onPrevStatus()}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2"
              onClick={() => onNextStatus()}
            />

            {/* Progress Bar */}
            <div className="absolute top-2 left-2 right-2 h-1 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-700 transition-all"
                style={{ width: `${viewing.progress * 100}%` }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setViewing({ user: null, index: 0, progress: 0 })}
              className="absolute top-2 right-2 text-white"
            >
              <X size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
