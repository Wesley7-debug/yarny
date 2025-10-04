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
    <aside className="lg:h-full h-15 w-full lg:w-15 bg-white border border-white flex lg:flex-col items-center justify-between px-3 lg:py-15 gap-4 fixed lg:top-0 bottom-0 left-0">
      {/* Desktop */}
      <div className="hidden lg:flex flex-col items-center gap-4 h-full justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <div key={tab.name} className="flex flex-col items-center gap-1">
              <button
                onClick={() => onTabChange(tab.name)}
                className={`p-2 ${
                  isActive ? "bg-purple-800 text-white rounded-full" : ""
                }`}
              >
                <Icon className="size-7 cursor-pointer" />
              </button>
              <h1 className="text-sm font-bold">{tab.label}</h1>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="flex lg:hidden items-center gap-4 w-full justify-evenly mb-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <div key={tab.name} className="flex flex-col items-center gap-1">
              <button
                onClick={() => onTabChange(tab.name)}
                className={`p-2 ${
                  isActive ? "bg-purple-800 text-white rounded-full" : ""
                }`}
              >
                <Icon className="size-7 cursor-pointer" />
              </button>
              <h1 className="text-sm font-bold">{tab.label}</h1>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ChatActionBar;
