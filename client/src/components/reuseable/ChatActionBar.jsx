import {
  CirclePlayIcon,
  HomeIcon,
  MessageSquareText,
  Phone,
  UserPlus2Icon,
} from "lucide-react";

function ChatActionBar({ activeTab, onTabChange }) {
  const tabs = [
    { name: "home", icon: HomeIcon, label: "Home" },
    { name: "chats", icon: MessageSquareText, label: "Chats" },
    { name: "status", icon: CirclePlayIcon, label: "Status" },
    { name: "friends", icon: UserPlus2Icon, label: "Friends" },
    { name: "calls", icon: Phone, label: "Calls" },
  ];

  return (
    <aside className="lg:h-full  h-15 w-full lg:w-15 bg-white border border-white flex lg:flex-col items-center justify-between px-3 lg:py-15 gap-4 fixed lg:top-0 bottom-0 left-0">
      {/* <aside className="fixed lg:static bottom-0 left-0 z-40 w-full lg:w-20 bg-white border-t lg:border-r border-gray-200 flex lg:flex-col justify-between lg:justify-start items-center px-4 lg:py-6 shadow lg:shadow-none"> */}
      <nav className="flex w-full lg:flex-col justify-between lg:justify-center items-center gap-2 lg:gap-6 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className={`flex flex-col items-center justify-center transition-all duration-200 group ${
                isActive ? "text-purple-700" : "text-gray-500"
              } hover:text-purple-800`}
            >
              <div
                className={`p-2 rounded-full transition-all duration-200 ${
                  isActive ? "bg-purple-100" : "hover:bg-gray-100"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[0.7rem] font-medium mt-1 transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default ChatActionBar;
