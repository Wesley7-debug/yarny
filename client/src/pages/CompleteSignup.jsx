import React, { useState } from "react";

const INTEREST_OPTIONS = [
  "Hiking",
  "Gaming",
  "Cooking",
  "Reading",
  "Music",
  "Movies",
  "Art",
  "Travel",
  "Fitness",
  "Tech",
];

export default function CompleteProfile() {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [interests, setInterests] = useState([]);
  const [friendTags, setFriendTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [bio, setBio] = useState("");

  function handleAddPhoto() {
    const url = prompt("Paste image URL");
    if (url) setPhotos((prev) => [...prev, url]);
  }

  function handleRemovePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setCurrentPhotoIndex(0);
  }

  function toggleInterest(interest) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  function addFriendTag() {
    if (tagInput.trim()) {
      setFriendTags([...friendTags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function removeTag(index) {
    setFriendTags((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const payload = {
      photos,
      interests,
      friendTags,
      bio,
    };

    console.log("Submitting profile setup:", payload);
    alert("Profile completed! 🎉 Check console for data.");
    // Send to API...
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Complete Your Profile
      </h1>

      {/* Photos */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Your Photos
        </h2>

        {photos.length > 0 ? (
          <div className="relative w-full max-w-lg mx-auto mb-4">
            <img
              src={photos[currentPhotoIndex]}
              alt={`Photo ${currentPhotoIndex + 1}`}
              className="w-full h-72 object-cover rounded-xl shadow"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleRemovePhoto(currentPhotoIndex)}
                className="bg-red-600 text-white text-xs px-3 py-1 rounded-full hover:bg-red-700"
              >
                Remove
              </button>
            </div>
            {photos.length > 1 && (
              <div className="absolute inset-0 flex justify-between items-center px-4">
                <button
                  onClick={() =>
                    setCurrentPhotoIndex((i) => (i > 0 ? i - 1 : i))
                  }
                  className="bg-white/80 backdrop-blur text-xl px-2 py-1 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentPhotoIndex((i) =>
                      i < photos.length - 1 ? i + 1 : i
                    )
                  }
                  className="bg-white/80 backdrop-blur text-xl px-2 py-1 rounded-full"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 mb-4 text-sm">No photos added yet.</p>
        )}

        <button
          onClick={handleAddPhoto}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + Add Photo
        </button>
      </section>

      {/* Interests */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Select Your Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full border transition ${
                interests.includes(interest)
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </section>

      {/* Friend Tags */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Add Friend Tags
        </h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="e.g. Study Buddy 📚"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addFriendTag}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {friendTags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="text-purple-700 hover:text-purple-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Bio */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Your Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Write a short bio about yourself..."
          className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </section>

      {/* Submit */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="w-full md:w-1/2 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
}
