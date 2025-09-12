// import React, { useState, useEffect, useRef } from "react";
// import { PlusCircle, ChevronDown, X, MoreVertical } from "lucide-react";
// import Dropdown from "../ui/Dropdown";

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

// function StatusTab() {
//   const [groupedStatuses] = useState(initialGroupedStatuses);
//   const [viewedStatuses, setViewedStatuses] = useState(new Set());
//   const [mutedUsers, setMutedUsers] = useState(new Set());
//   const [showMuted, setShowMuted] = useState(false);
//   const [showStatusPost, setShowStatusPost] = useState(false);
//   const [viewing, setViewing] = useState({ user: null, index: 0, progress: 0 });
//   const progressTimer = useRef(null);
//   const progressStartTime = useRef(null);

//   useEffect(() => {
//     if (!viewing.user) return;
//     const statuses = groupedStatuses[viewing.user];
//     if (!statuses) return;

//     setViewing((v) => ({ ...v, progress: 0 }));
//     progressStartTime.current = Date.now();

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

//     const handleNewStatus = (statusData) => {
//     console.log("New status posted:", statusData);
//     // TODO: Save to backend or add to local statuses state
//   };

//   function onNextStatus() {
//     const { user, index } = viewing;
//     if (!user) return;
//     const statuses = groupedStatuses[user];
//     if (index + 1 < statuses.length) {
//       setViewing({ user, index: index + 1, progress: 0 });
//     } else {
//       setViewing({ user: null, index: 0, progress: 0 });
//     }
//   }

//   function onPrevStatus() {
//     const { user, index } = viewing;
//     if (!user) return;
//     if (index > 0) {
//       setViewing({ user, index: index - 1, progress: 0 });
//     }
//   }

//   function toggleMute(user) {
//     setMutedUsers((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(user)) newSet.delete(user);
//       else newSet.add(user);
//       return newSet;
//     });
//   }

//   function getUserViewedFraction(user) {
//     const sts = groupedStatuses[user];
//     if (!sts) return 0;
//     const total = sts.length;
//     const viewedCount = sts.filter((s) => viewedStatuses.has(s.id)).length;
//     return total > 0 ? viewedCount / total : 0;
//   }

//   return (
//     <div className="w-full min-h-screen text-black p-4 bg-white">
//       <h2 className="text-xl font-bold mb-4">Status</h2>

//       {/* My Status */}
//       <div
//         className="relative flex items-center mb-6 cursor-pointer"
//         onClick={() => alert("Add your status")}
//       >
//         <div className="relative">
//           <div className="w-16 h-16 rounded-full border-2 border-purple-700 overflow-hidden">
//             <img
//               src="/baily1.webp"
//               alt="My status"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <PlusCircle
//             size={24}
//             className="absolute bottom-0 right-0 text-purple-700 bg-white rounded-full"
//             strokeWidth={1.5}
//           />
//         </div>
//         <div className="ml-4">
//           <p className="font-semibold">My Status</p>
//           <p className="text-sm text-gray-900">Tap to add status update</p>
//         </div>
//       </div>

//       {/* Recent Updates */}
//       <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
//         Recent updates
//       </h3>
//       {Object.entries(groupedStatuses)
//         .filter(([user]) => !mutedUsers.has(user))
//         .map(([user, sts]) => {
//           const allViewed = getUserViewedFraction(user) === 1;
//           const ringColor = allViewed ? "border-gray-300" : "border-purple-700";
//           const frac =
//             viewing.user === user
//               ? viewing.progress
//               : getUserViewedFraction(user);

//           return (
//             <div key={user} className="flex items-center mb-4">
//               <div
//                 onClick={() => setViewing({ user, index: 0, progress: 0 })}
//                 className="flex items-center flex-1 cursor-pointer"
//               >
//                 <div
//                   className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${ringColor} mr-4`}
//                 >
//                   <img
//                     src={sts[0].image}
//                     alt={user}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
//                     <div
//                       className="h-full bg-purple-700"
//                       style={{ width: `${frac * 100}%` }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <p className="font-semibold">{user}</p>
//                   <p className="text-sm text-black">
//                     {sts[sts.length - 1].time}
//                   </p>
//                 </div>
//               </div>

//               <Dropdown
//                 trigger={<div className="cursor-pointer text-gray-700">⋮</div>}
//                 options={[
//                   {
//                     label: mutedUsers.has(user) ? "Unmute" : "Mute",
//                     onClick: () => toggleMute(user),
//                   },
//                 ]}
//               />
//             </div>
//           );
//         })}

//       {/* Muted Section */}
//       <div
//         className="flex items-center mb-2 cursor-pointer select-none mt-6"
//         onClick={() => setShowMuted((prev) => !prev)}
//       >
//         <p className="font-semibold text-gray-700 mr-2">Muted</p>
//         <ChevronDown
//           size={16}
//           className={`text-gray-700 transition-transform ${
//             showMuted ? "rotate-180" : ""
//           }`}
//           strokeWidth={2}
//         />
//       </div>

//       {showMuted &&
//         Array.from(mutedUsers).map((user) => {
//           const sts = groupedStatuses[user];
//           if (!sts) return null;

//           const allViewed = getUserViewedFraction(user) === 1;
//           const ringColor = allViewed ? "border-gray-300" : "border-purple-700";
//           const frac = getUserViewedFraction(user);

//           return (
//             <div key={user} className="flex items-center mb-4 opacity-50">
//               <div className="flex items-center flex-1 cursor-pointer">
//                 {/* <div
//                   className={`w-14 h-14 rounded-full overflow-hidden border-2 ${ringColor} mr-4`}
//                   onClick={() => setViewing({ user, index: 0, progress: 0 })}
//                 >
//                   <img
//                     src={sts[0].image}
//                     alt={user}
//                     className="w-full h-full object-cover"
//                   />
//                 </div> */}
//                 <div
//                   className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${ringColor} mr-4`}
//                   onClick={() => setViewing({ user, index: 0, progress: 0 })}
//                 >
//                   <img
//                     src={sts[0].image}
//                     alt={user}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
//                     <div
//                       className="h-full bg-purple-700"
//                       style={{ width: `${frac * 100}%` }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <p className="font-semibold">{user}</p>
//                   <p className="text-sm text-gray-500">Muted</p>
//                 </div>
//               </div>

//               <Dropdown
//                 trigger={<div className="cursor-pointer text-gray-700">⋮</div>}
//                 options={[
//                   {
//                     label: "Unmute",
//                     onClick: () => toggleMute(user),
//                   },
//                 ]}
//               />
//             </div>
//           );
//         })}

//       {/* Status Viewer Modal */}
//       {viewing.user && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//           onClick={() => setViewing({ user: null, index: 0, progress: 0 })}
//         >
//           <div
//             className="relative bg-black max-w-full max-h-full flex items-center justify-center cursor-pointer"
//             style={{ width: "100%", height: "100%" }}
//           >
//             <img
//               src={groupedStatuses[viewing.user][viewing.index].image}
//               alt=""
//               className="object-contain max-w-full max-h-full"
//             />

//             {/* Overlays for prev/next */}
//             <div
//               className="absolute top-0 bottom-0 left-0 right-1/2"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onPrevStatus();
//               }}
//             />
//             <div
//               className="absolute top-0 bottom-0 left-1/2 right-0"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onNextStatus();
//               }}
//             />

//             {/* Progress bar */}
//             <div className="absolute top-2 left-2 right-2 h-1 bg-gray-300 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-purple-700"
//                 style={{ width: `${viewing.progress * 100}%` }}
//               />
//             </div>

//             {/* Close button */}
//             <button
//               className="absolute top-2 right-2 text-white"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setViewing({ user: null, index: 0, progress: 0 });
//               }}
//             >
//               <X size={28} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StatusTab;
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

function StatusTab() {
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
    console.log("New status posted:", statusData);

    // Example: Add new status under "Me"
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

    setShowStatusPost(false); // Close the post modal
  };

  function onNextStatus() {
    const { user, index } = viewing;
    if (!user) return;
    const statuses = groupedStatuses[user];
    if (index + 1 < statuses.length) {
      setViewing({ user, index: index + 1, progress: 0 });
    } else {
      setViewing({ user: null, index: 0, progress: 0 });
    }
  }

  function onPrevStatus() {
    const { user, index } = viewing;
    if (!user) return;
    if (index > 0) {
      setViewing({ user, index: index - 1, progress: 0 });
    }
  }

  function toggleMute(user) {
    setMutedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(user)) newSet.delete(user);
      else newSet.add(user);
      return newSet;
    });
  }

  function getUserViewedFraction(user) {
    const sts = groupedStatuses[user];
    if (!sts) return 0;
    const total = sts.length;
    const viewedCount = sts.filter((s) => viewedStatuses.has(s.id)).length;
    return total > 0 ? viewedCount / total : 0;
  }

  return (
    <div className="w-full min-h-screen text-black p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Status</h2>

      {/* My Status */}
      <div className="relative flex items-center mb-6 cursor-pointer">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-purple-700 overflow-hidden">
            <img
              src="/baily1.webp"
              alt="My status"
              className="w-full h-full object-cover"
            />
          </div>
          <PlusCircle
            onClick={() => setShowStatusPost(true)}
            size={24}
            className="absolute bottom-0 right-0 text-purple-700 bg-white rounded-full"
            strokeWidth={1.5}
          />
        </div>
        <div className="ml-4">
          <p className="font-semibold">My Status</p>
          <p className="text-sm text-gray-900">Tap to add status update</p>
        </div>
      </div>

      {showStatusPost && (
        <div className="mb-6">
          <StatusPost onSubmit={handleNewStatus} />
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => setShowStatusPost(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Recent Updates */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
        Recent updates
      </h3>
      {Object.entries(groupedStatuses)
        .filter(([user]) => !mutedUsers.has(user))
        .map(([user, sts]) => {
          const allViewed = getUserViewedFraction(user) === 1;
          const ringColor = allViewed ? "border-gray-300" : "border-purple-700";
          const frac =
            viewing.user === user
              ? viewing.progress
              : getUserViewedFraction(user);

          return (
            <div key={user} className="flex items-center mb-4">
              <div
                onClick={() => setViewing({ user, index: 0, progress: 0 })}
                className="flex items-center flex-1 cursor-pointer"
              >
                <div
                  className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${ringColor} mr-4`}
                >
                  <img
                    src={sts[0].image}
                    alt={user}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                    <div
                      className="h-full bg-purple-700"
                      style={{ width: `${frac * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="font-semibold">{user}</p>
                  <p className="text-sm text-black">
                    {sts[sts.length - 1].time}
                  </p>
                </div>
              </div>

              <Dropdown
                trigger={<div className="cursor-pointer text-gray-700">⋮</div>}
                options={[
                  {
                    label: mutedUsers.has(user) ? "Unmute" : "Mute",
                    onClick: () => toggleMute(user),
                  },
                ]}
              />
            </div>
          );
        })}

      {/* Muted Section */}
      <div
        className="flex items-center mb-2 cursor-pointer select-none mt-6"
        onClick={() => setShowMuted((prev) => !prev)}
      >
        <p className="font-semibold text-gray-700 mr-2">Muted</p>
        <ChevronDown
          size={16}
          className={`text-gray-700 transition-transform ${
            showMuted ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </div>

      {showMuted &&
        Array.from(mutedUsers).map((user) => {
          const sts = groupedStatuses[user];
          if (!sts) return null;

          const allViewed = getUserViewedFraction(user) === 1;
          const ringColor = allViewed ? "border-gray-300" : "border-purple-700";
          const frac = getUserViewedFraction(user);

          return (
            <div key={user} className="flex items-center mb-4 opacity-50">
              <div className="flex items-center flex-1 cursor-pointer">
                <div
                  className={`relative w-14 h-14 rounded-full overflow-hidden border-2 ${ringColor} mr-4`}
                  onClick={() => setViewing({ user, index: 0, progress: 0 })}
                >
                  <img
                    src={sts[0].image}
                    alt={user}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                    <div
                      className="h-full bg-purple-700"
                      style={{ width: `${frac * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="font-semibold">{user}</p>
                  <p className="text-sm text-gray-500">Muted</p>
                </div>
              </div>

              <Dropdown
                trigger={<div className="cursor-pointer text-gray-700">⋮</div>}
                options={[
                  {
                    label: "Unmute",
                    onClick: () => toggleMute(user),
                  },
                ]}
              />
            </div>
          );
        })}

      {/* Status Viewer Modal */}
      {viewing.user && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setViewing({ user: null, index: 0, progress: 0 })}
        >
          <div
            className="relative bg-black max-w-full max-h-full flex items-center justify-center cursor-pointer"
            style={{ width: "100%", height: "100%" }}
          >
            <img
              src={groupedStatuses[viewing.user][viewing.index].image}
              alt=""
              className="object-contain max-w-full max-h-full"
            />

            {/* Overlays for prev/next */}
            <div
              className="absolute top-0 bottom-0 left-0 right-1/2"
              onClick={(e) => {
                e.stopPropagation();
                onPrevStatus();
              }}
            />
            <div
              className="absolute top-0 bottom-0 left-1/2 right-0"
              onClick={(e) => {
                e.stopPropagation();
                onNextStatus();
              }}
            />

            {/* Progress bar */}
            <div className="absolute top-2 left-2 right-2 h-1 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-700"
                style={{ width: `${viewing.progress * 100}%` }}
              />
            </div>

            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setViewing({ user: null, index: 0, progress: 0 });
              }}
            >
              <X size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusTab;
