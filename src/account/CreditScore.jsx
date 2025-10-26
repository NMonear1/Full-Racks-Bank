import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import "./CreditScore.css";

export default function CreditScore() {
  const { user, token, setUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localCreditScore, setLocalCreditScore] = useState(user?.creditscore);

  const getCreditScoreRating = (score) => {
    if (score >= 800) return { rating: "Excellent", color: "#22c55e" };
    if (score >= 740) return { rating: "Very Good", color: "#84cc16" };
    if (score >= 670) return { rating: "Good", color: "#eab308" };
    if (score >= 580) return { rating: "Fair", color: "#f97316" };
    return { rating: "Poor", color: "#ef4444" };
  };

  const generateRandomCreditScore = () => {
  const ranges = [
    { min: 300, max: 579, weight: 0.15 }, // Poor: 15%
    { min: 580, max: 669, weight: 0.25 }, // Fair: 25%
    { min: 670, max: 739, weight: 0.35 }, // Good: 35%
    { min: 740, max: 799, weight: 0.20 }, // Very Good: 20%
    { min: 800, max: 850, weight: 0.05 }  // Excellent: 5%
  ];
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (const range of ranges) {
    cumulativeWeight += range.weight;
    if (random <= cumulativeWeight) {
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
  }
  
  // Fallback
  return 650;
};

const handleSignUpForCreditTracking = async () => {
    setIsUpdating(true);
    try {
      const randomScore = generateRandomCreditScore();
      
      const response = await fetch(import.meta.env.VITE_API + "/users/credit-score", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creditscore: randomScore }),
      });

      if (response.ok) {

        const data = await response.json();
        console.log("Credit score updated:", data);

        setLocalCreditScore(randomScore);
        console.log(`Credit score updated to ${randomScore}`);

        setUser((prevUser) => ({
            ...prevUser,
            creditscore: randomScore,
            }));
      } else {
        console.error("Failed to update credit score");
      }
    } catch (error) {
      console.error("Error updating credit score:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Use local credit score if available, otherwise use user.creditscore
  const currentCreditScore = localCreditScore || user?.creditscore;

  if (!currentCreditScore || currentCreditScore === 0) {
    return (
      <div className="credit-score-card">
        <h3>Credit Score</h3>
        <button 
          onClick={handleSignUpForCreditTracking}
          disabled={isUpdating}
          className="credit-signup-btn"
        >
          {isUpdating ? "Setting up..." : "Sign Up for Credit Score Tracking"}
        </button>
      </div>
    );
  }

  if (!user?.creditscore) {
    return (
      <div className="credit-score-card">
        <h3>Credit Score</h3>
        <p>
            <button>Sign Up for credit score Tracking</button>
        </p>
      </div>
    );
  }

  const { rating, color } = getCreditScoreRating(user.creditscore);

  return (
    <div className="credit-score-card">
      <h3>Your Credit Score</h3>
      <div className="credit-score-display">
        <div 
          className="credit-score-number" 
          style={{ color }}
        >
          {user.creditscore}
        </div>
        <div 
          className="credit-score-rating"
          style={{ color }}
        >
          {rating}
        </div>
      </div>
      <div className="credit-score-range">
        <span>300</span>
        <div className="credit-score-bar">
          <div 
            className="credit-score-progress"
            style={{ 
              width: `${((user.creditscore - 300) / 550) * 100}%`,
              backgroundColor: color 
            }}
          />
        </div>
        <span>850</span>
      </div>
    </div>
  );
}