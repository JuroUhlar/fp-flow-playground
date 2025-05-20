"use client";

import { useState, useEffect } from "react";

type Review = {
  id: number;
  email: string;
  rating: number;
  text: string;
  created_at: string;
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    const res = await fetch("/api/reviews/get-reviews");
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
    setLoadingReviews(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, rating, text }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      setMessage("Thank you for your review!");
      setEmail("");
      setRating(5);
      setText("");
      fetchReviews();
    } catch {
      setMessage("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Restaurant Reviews</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-2">
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            Your Review
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded ${message.includes("Thank you") ? "bg-green-100" : "bg-red-100"}`}
        >
          {message}
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>
        {loadingReviews ? (
          <div>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div>No reviews yet.</div>
        ) : (
          <ul className="space-y-6">
            {reviews.map((review) => (
              <li key={review.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.email}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <div className="mb-1 text-gray-700">{review.text}</div>
                <div className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
