import { create } from "zustand";
import { toast } from "react-toastify";

const matchStore = create((set) => ({
  isGettingDailyMatches: false,
  dailyMatches: [],
  getMatchesForToday: async () => {
    try {
      set({ isGettingDailyMatches: true });
      const matchFeed = await fetch("/api/match/daily-feed");
      if (!matchFeed.ok) {
        toast.error("Failed to fetch daily matches");
        throw new Error("Failed to fetch daily matches");
      }

      const data = await matchFeed.json();
      set({ dailyMatches: data.matches });
      set({ isGettingDailyMatches: false });
    } catch (error) {
      console.error("Error fetching daily matches:", error);
    } finally {
      set({ isGettingDailyMatches: false });
    }
  },
}));

export default matchStore;
