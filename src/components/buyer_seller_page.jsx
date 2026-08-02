import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Star, X, MessageCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "./toast_context";

const API_BASE = "https://movie-nova-5.onrender.com";

const getToken = () => localStorage.getItem("token");
const getCurrentUserId = () => localStorage.getItem("userId");

export default function SellerProfile() {
  const images = [
    "https://res.cloudinary.com/dvvl4i8q9/image/upload/v1772129188/piggybank-HE75OJUXOFE-unsplash_q3meen.jpg",
    "https://res.cloudinary.com/dvvl4i8q9/image/upload/v1772129188/piggybank-HE75OJUXOFE-unsplash_q3meen.jpg",
    "https://res.cloudinary.com/dvvl4i8q9/image/upload/v1772129188/piggybank-HE75OJUXOFE-unsplash_q3meen.jpg"
  ];

  const [current, setCurrent] = useState(0);
  const { id } = useParams(); // seller ID from URL
  const navigate = useNavigate();
  const { toast } = useToast();
  const [seller, setSeller] = useState(null);
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Order state ---
  const [selectedService, setSelectedService] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // "success" | "error" | null
  const [orderError, setOrderError] = useState("");

  // --- Review state ---
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(null); // "success" | "error" | null
  const [reviewError, setReviewError] = useState("");

  // --- Chat state ---
  const [startingChat, setStartingChat] = useState(false);
  const [chatError, setChatError] = useState("");

  const isLoggedIn = !!getToken();
  const isOwnProfile = isLoggedIn && getCurrentUserId() === id;

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch(`${API_BASE}/seller/${id}/full`);
        const fullData = await res1.json();

        setSeller(fullData.profile || null);
        setStats(fullData.stats || null);
        setServices(fullData.services || []);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch testimonials/reviews for this seller
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/seller/${id}/reviews`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.log(err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const openOrderModal = (service = null) => {
    if (isOwnProfile) return;
    setSelectedService(service);
    setOrderStatus(null);
    setOrderError("");
    setOrderNote("");
    setShowOrderModal(true);
  };

  const handlePlaceOrder = async () => {
    const token = getToken();
    if (!token) {
      setOrderStatus("error");
      setOrderError("Please log in to place an order.");
      return;
    }
    if (isOwnProfile) {
      setOrderStatus("error");
      setOrderError("You can't order your own service.");
      return;
    }

    setPlacingOrder(true);
    setOrderStatus(null);
    setOrderError("");
    try {
      const res = await fetch(`${API_BASE}/seller/${id}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: selectedService?._id || null,
          note: orderNote
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order request failed");

      setOrderStatus("success");
      setOrderNote("");
      toast("Order placed successfully!");
      setTimeout(() => {
        setShowOrderModal(false);
        setOrderStatus(null);
      }, 1500);
    } catch (err) {
      console.log(err);
      setOrderStatus("error");
      setOrderError(err.message || "Something went wrong placing your order.");
      toast(err.message || "Something went wrong placing your order.", "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      setReviewStatus("error");
      setReviewError("Please log in to leave a review.");
      return;
    }
    if (isOwnProfile) {
      setReviewStatus("error");
      setReviewError("You can't review your own profile.");
      return;
    }
    if (!reviewRating || !reviewComment.trim()) {
      setReviewStatus("error");
      setReviewError("Please add a rating and a comment before submitting.");
      return;
    }

    setSubmittingReview(true);
    setReviewStatus(null);
    setReviewError("");
    try {
      const res = await fetch(`${API_BASE}/seller/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review submission failed");

      const newReview = data.review || {
        _id: Date.now().toString(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        createdAt: new Date().toISOString()
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewRating(0);
      setReviewComment("");
      setReviewStatus("success");
      toast("Thanks for your review!");
    } catch (err) {
      console.log(err);
      setReviewStatus("error");
      setReviewError(err.message || "Something went wrong submitting your review.");
      toast(err.message || "Something went wrong submitting your review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // This app's Messages tab lives inside the bottom-nav shell at /home,
  // not its own route — so instead of navigating to a chat URL, we hop to
  // /home and hand off which chat to open via router state. navbar_page.jsx
  // reads this on mount and switches to the Messages tab automatically.
  const handleStartChat = async () => {
    const token = getToken();
    if (!token) {
      setChatError("Please log in to chat with this seller.");
      setTimeout(() => setChatError(""), 3000);
      return;
    }
    if (isOwnProfile) {
      setChatError("This is your own profile.");
      setTimeout(() => setChatError(""), 3000);
      return;
    }

    setStartingChat(true);
    setChatError("");
    try {
      const res = await fetch(`${API_BASE}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ participantId: id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start chat");

      navigate("/home", {
        state: {
          openChat: {
            _id: data.chatId,
            name: seller?.fullName || "Seller",
            avatar: seller?.photoUrl || "",
            online: true
          }
        }
      });
    } catch (err) {
      console.log(err);
      setChatError(err.message || "Could not start chat. Try again.");
      setTimeout(() => setChatError(""), 3000);
    } finally {
      setStartingChat(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-10 gap-2">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:450ms]"></div>
      </div>
    );

  const avgRating = stats?.averageRating
    ? Number(stats.averageRating).toFixed(1)
    : reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      {/* HEADER / CAROUSEL */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-b-3xl">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="bg"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-full text-white">
            <ArrowLeft size={20} />
          </button>
          <button className="bg-white/20 p-2 rounded-full text-white">
            <Search size={20} />
          </button>
        </div>

        <div className="absolute bottom-6 w-full text-center text-white z-10">
          <img
            src={seller?.photoUrl || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-2"
          />
          <h2 className="text-lg font-semibold">{seller?.fullName || "Seller"}</h2>

          <span className="bg-orange-500 text-xs px-3 py-1 rounded-full inline-block mt-1">
            {seller?.verified ? "Verified Seller" : "Top Rated Seller"}
          </span>

          <p className="text-sm mt-2">
            ⭐ {avgRating} ({stats?.totalReviews ?? reviews.length}) • {seller?.location || "Unknown"}
          </p>
        </div>
      </div>

      {/* ABOUT — full transparency so buyers don't have to ask */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-2">About this seller</h3>

          {seller?.bio && <p className="text-sm text-gray-600 mb-3">{seller.bio}</p>}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Member since</p>
              <p className="text-gray-800 font-medium">
                {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString(undefined, { year: "numeric", month: "long" }) : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Response time</p>
              <p className="text-gray-800 font-medium">{seller?.responseTime || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Completed orders</p>
              <p className="text-gray-800 font-medium">{stats?.completedOrders ?? 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Active services</p>
              <p className="text-gray-800 font-medium">{stats?.totalServices ?? services.length}</p>
            </div>
          </div>

          {seller?.languages?.length > 0 && (
            <div className="mt-3">
              <p className="text-gray-400 text-xs mb-1">Languages</p>
              <div className="flex flex-wrap gap-1">
                {seller.languages.map((lang) => (
                  <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(seller?.socialLinks?.website || seller?.socialLinks?.twitter || seller?.socialLinks?.linkedin) && (
            <div className="mt-3 flex gap-3 text-xs text-blue-600">
              {seller.socialLinks.website && (
                <a href={seller.socialLinks.website} target="_blank" rel="noreferrer">Website</a>
              )}
              {seller.socialLinks.twitter && (
                <a href={seller.socialLinks.twitter} target="_blank" rel="noreferrer">Twitter</a>
              )}
              {seller.socialLinks.linkedin && (
                <a href={seller.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SERVICES */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Services</h3>
          <span className="text-gray-500">⌄</span>
        </div>

        <div className="flex gap-4 mt-4 overflow-x-auto">
          {services.map((service) => (
            <button
              key={service._id}
              onClick={() => openOrderModal(service)}
              disabled={isOwnProfile}
              className={`min-w-[150px] bg-white rounded-xl shadow text-left ${
                isOwnProfile ? "opacity-70 cursor-default" : ""
              }`}
            >
              <img
                src={service.image || "https://via.placeholder.com/150"}
                alt="service"
                className="w-full h-[100px] object-cover rounded-t-xl"
              />
              <div className="p-2">
                <h4 className="text-sm font-medium">{service.title}</h4>
                <p className="text-green-600 font-semibold text-sm">${service.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Testimonials</h3>
          <span className="text-sm text-gray-500">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
        </div>

        {reviewsLoading ? (
          <p className="text-sm text-gray-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet. Be the first to leave one!</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
            {reviews.map((review) => (
              <div
                key={review._id || review.createdAt}
                className="bg-white rounded-xl shadow p-3 flex-shrink-0"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm text-gray-800">
                    {review.name || "Anonymous"}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={
                          n <= (review.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                {review.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {isOwnProfile ? (
          <div className="bg-white rounded-xl shadow p-3 mt-4 text-sm text-gray-500">
            This is your public profile — buyers leave reviews here after ordering from you.
          </div>
        ) : (
          <form
            onSubmit={handleSubmitReview}
            className="bg-white rounded-xl shadow p-3 mt-4 flex flex-col gap-2"
          >
            <h4 className="text-sm font-semibold text-gray-800">Leave a review</h4>

            {!isLoggedIn && (
              <p className="text-xs text-gray-500">Log in to leave a review under your name.</p>
            )}

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setReviewRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={20}
                    className={
                      n <= (hoverRating || reviewRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Share your experience with this seller..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
            />

            {reviewStatus === "error" && <p className="text-xs text-red-500">{reviewError}</p>}
            {reviewStatus === "success" && (
              <p className="text-xs text-green-600">Thanks for your review!</p>
            )}

            <button
              type="submit"
              disabled={submittingReview}
              className="mt-1 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* HIRE BUTTON */}
      <div className="mt-auto p-4">
        {isOwnProfile ? (
          <div className="w-full py-3 rounded-full bg-gray-200 text-gray-500 text-center font-medium">
            This is how buyers see your profile
          </div>
        ) : (
          <button
            onClick={() => openOrderModal(null)}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold"
          >
            Hire Now
          </button>
        )}
      </div>

      {/* FLOATING CHAT BUTTON */}
      {!isOwnProfile && (
        <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-2">
          {chatError && (
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-[220px]">
              {chatError}
            </div>
          )}
          <button
            onClick={handleStartChat}
            disabled={startingChat}
            aria-label="Chat with seller"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg flex items-center justify-center disabled:opacity-60"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* ORDER MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                {selectedService ? `Order: ${selectedService.title}` : "Place an Order"}
              </h3>
              <button onClick={() => setShowOrderModal(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {!isLoggedIn && (
              <p className="text-xs text-red-500 mb-2">
                You need to be logged in to place an order.
              </p>
            )}

            {selectedService && (
              <p className="text-green-600 font-semibold mb-2">${selectedService.price}</p>
            )}

            {!selectedService && services.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-gray-500">Select a service</label>
                <select
                  onChange={(e) => {
                    const svc = services.find((s) => s._id === e.target.value);
                    setSelectedService(svc || null);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title} — ${s.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <textarea
              placeholder="Tell the seller what you need..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
            />

            {orderStatus === "error" && <p className="text-xs text-red-500 mt-2">{orderError}</p>}
            {orderStatus === "success" && (
              <p className="text-xs text-green-600 mt-2">Order placed successfully!</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedService}
              className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold disabled:opacity-60"
            >
              {placingOrder ? "Placing order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
