import React from "react";

function Cards() {
  const yarnyData = [
    {
      name: "All",
      href: "/",
    },
    {
      name: "Unread",
      href: "/",
      tag: "3",
    },
    {
      name: "Favourites",
      href: "/",
      tag: "5",
    },
    {
      name: "Groups",
      href: "/",
      tag: "2",
    },
  ];

  return (
    <div className="w-full  flex items-center p-2">
      {yarnyData.map((item) => (
        <div
          key={item.name}
          className="flex text-center p-1 ml-2 w-full rounded-2xl ring-1 hover:bg-purple-500 transition-all justify-center items-center gap-1 cursor-pointer"
        >
          {item.tag && (
            <span className="block text-sm text-base-500 text-black font-extrabold ml-0.5">
              {item.tag}
            </span>
          )}
          <span className="block text-sm font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default Cards;
