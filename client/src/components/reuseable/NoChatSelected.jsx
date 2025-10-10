import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full lg:flex flex-1 flex-col items-center justify-center p-16 bg-white/90 hidden">
      <div className="max-w-md text-center space-y-8">
        {/* Animated Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-purple-800 flex items-center justify-center animate-bounce shadow-lg"
            title="Start a chat"
          >
            <MessageSquare className="w-10 h-10 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-purple-800 drop-shadow-md">
          Welcome to Yarny!
        </h2>

        {/* Subtext */}
        <p className="text-lg text-black font-semibold leading-relaxed tracking-wide">
          Select a conversation from the sidebar to start chatting.
          <br />
          Or create a new chat and say hello! 👋
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
