const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <div className="overflow-y-auto w-full py-3 -z-100">
      {skeletonContacts.map((_, idx) => (
        <div
          key={idx}
          className="w-full p-3 flex items-center justify-between gap-3 animate-pulse"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Name and last message */}
            <div className="min-w-0 text-left space-y-1">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
