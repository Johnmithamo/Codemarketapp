import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import "./style.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // ===== GET FAVORITES =====
  const getFavorites = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  };

  // ===== REMOVE FAVORITE =====
  const removeFromFavorites = (id) => {
    const updated = getFavorites().filter((item) => item.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  // ===== LOAD =====
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-white px-4 py-3 shadow-sm z-10">
        <h2 className="text-lg font-semibold">My Favorites</h2>
        <p className="text-xs text-gray-500">
          Saved services you love ❤️
        </p>
      </div>

      {/* CONTENT */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Heart size={40} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">
              No favorites yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Start saving services to see them here
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-4">
          {favorites.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden relative transition hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="h-28 w-full bg-gray-200">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeFromFavorites(service.id)}
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
              >
                <Heart size={16} className="text-red-500 fill-red-500" />
              </button>

              {/* DETAILS */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {service.title}
                </h3>

                <p className="text-blue-600 font-bold text-sm mt-1">
                  Ksh {service.price}
                </p>

                {/* OPTIONAL CATEGORY */}
                {service.category && (
                  <span className="text-[10px] text-gray-400">
                    {service.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}