const ChatSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className="bg-gray-300 rounded-full h-10 w-40 max-w-[70%]"></div>
        </div>
      ))}
    </div>
  );
};
export default ChatSkeleton;
