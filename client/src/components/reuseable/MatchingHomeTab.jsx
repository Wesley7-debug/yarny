import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const profiles = [
  {
    id: 1,
    name: "Patrick",
    age: 38,
    img: "/baily1.webp",
    bio: "Mysterious thinker with a passion for psychology.",
  },
  {
    id: 2,
    name: "Scrooge",
    age: 29,
    img: "https://source.unsplash.com/random/400x500?cartoon",
    bio: "Investor. Collector. Loves swimming in coins.",
  },
  {
    id: 3,
    name: "Donald",
    age: 33,
    img: "https://source.unsplash.com/random/400x500?man",
    bio: "Warehouse manager. Loyal and hardworking.",
  },
];

const MatchingHomeTab = () => {
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState("");

  const handleLike = () => {
    setAnimation("animate-slide-out-right");
    toast.success("Friend request sent 💜");
    setTimeout(() => {
      goNext();
    }, 400);
  };

  const handleDislike = () => {
    setAnimation("animate-slide-out-left");
    setTimeout(() => {
      goNext();
    }, 400);
  };

  const goNext = () => {
    setAnimation("");
    if (index < profiles.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(null);
    }
  };

  if (index === null) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black mb-5 px-4 text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          You're all done!
        </h2>
        <p className="text-gray-600">Come back later for more profiles.</p>
      </div>
    );
  }

  const profile = profiles[index];

  return (
    <div className="min-h-full w-full bg-white flex items-center justify-center px-4 py-4 mb-100">
      <div
        className={`w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${animation}`}
      >
        {/* Profile Image */}
        <img
          src={profile.img}
          alt={profile.name}
          className="w-full h-64 sm:h-72 md:h-80 object-cover"
        />

        {/* Profile Details */}
        <div className="px-5 py-4">
          <h2 className="text-2xl font-bold text-black">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {profile.bio}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={handleDislike}
            className="w-16 h-16 bg-purple-100 hover:bg-purple-200 text-purple-800 text-2xl font-bold rounded-full flex items-center justify-center transition"
          >
            ❌
          </button>
          <button
            onClick={handleLike}
            className="w-16 h-16 bg-purple-700 hover:bg-purple-800 text-white text-2xl font-bold rounded-full flex items-center justify-center transition"
          >
            💜
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingHomeTab;
