import { Link } from "react-router-dom";

import {
  Camera,
  Ellipsis,
  EllipsisVertical,
  LogOut,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";
import authStore from "../../store/authStore";
import Dropdown from "../ui/Dropdown";

const Navbar = () => {
  const { signOut, authUser } = authStore();
  const dropdownOptions = [
    {
      label: (
        <Link to="/create-group" className="flex items-center gap-2 w-full">
          <PlusCircle className="w-4 h-4" />
          <span className="">New Group</span>
        </Link>
      ),
    },
    {
      label: (
        <Link to="/settings" className="flex items-center gap-2 w-full">
          <Settings className="w-4 h-4" />
          <span className="">Settings</span>
        </Link>
      ),
    },
    ...(authUser
      ? [
          {
            label: (
              <Link to="/profile" className="flex items-center gap-2 w-full">
                <User className="w-4 h-4" />
                <span className="">Profile</span>
              </Link>
            ),
          },
          {
            label: (
              <button
                onClick={() => {
                  signOut();
                }}
                className="flex items-center gap-2 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="">Logout</span>
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <header
      className="bg-base-100  fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-2 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Yarny</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {/* <div>
              <Camera className="w-5 h-5 cursor-pointer" />
            </div> */}
            <Dropdown
              trigger={
                <div className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
                  <EllipsisVertical className="w-5 h-5 " />
                </div>
              }
              options={dropdownOptions}
            />
          </div>

          {/* <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div> */}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
