import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Sample leaderboard data
const usersData = [
  { name: "Chioma", score: 98 },
  { name: "Kelechi", score: 92 },
  { name: "Tomiwa", score: 88 },
  { name: "Yusuf", score: 85 },
  { name: "Ngozi", score: 81 },
];

// Shuffle helper
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Leaderboard() {
  const [users, setUsers] = useState(usersData);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => shuffleArray(prev));
    }, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto my-10">
      <h2 className="text-xl font-bold text-center mb-4">🏆 Leaderboard</h2>

      <div className="space-y-3">
        {users.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#f4fff4] p-4 rounded-lg shadow flex justify-between items-center"
          >
            <span className="font-medium">{index + 1}. {user.name}</span>
            <span className="text-sm font-bold">{user.score} pts</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
