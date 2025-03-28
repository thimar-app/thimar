import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://thimar.onrender.com/api";

const getAuthHeader = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyNTYzNzIyLCJpYXQiOjE3NDIzOTA5MjIsImp0aSI6ImZlMDUzZTJkODE5ZDQ3YjQ4MjRjY2E0NGRlM2MzMGExIiwidXNlcl9pZCI6N30.YeOKrZG-3a_Z8ylcw2mL3Y0jBD3QDYJnez8zKqOW8UQ";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchPrayersApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/prayers/`, {
    headers: getAuthHeader(),
  });
  return response.data; // your array of prayers
};

export default function HomePrayerTimeSection() {
  interface Prayer {
    id: number;
    name: string;
    time: string;
  }

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [nextPrayerName, setNextPrayerName] = useState("");
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPrayersApi();
        setPrayers(data);
      } catch (error) {
        console.error("Failed to fetch prayers:", error);
      }
    })();
  }, []);

  // -------------
  // Calculate next prayer
  // -------------
  useEffect(() => {
    if (!prayers.length) return;

    // Get current time once
    const now = new Date();

    // Convert each prayer time to a "today" date object
    const prayersToday = prayers.map((prayer) => {
      const [h, m, s] = prayer.time.split(":"); // e.g. "00:00:00"
      const prayerDate = new Date();
      prayerDate.setHours(+h, +m, +s, 0);
      return {
        ...prayer,
        // Store the parsed date (for comparison)
        dateObj: prayerDate,
      };
    });

    // Sort by actual time-of-day
    prayersToday.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // Find the first prayer that hasn't happened yet
    let upcoming = prayersToday.find((p) => p.dateObj > now);

    // If all prayers have passed, we treat the first one as "tomorrow".
    // This is just one approach; you can adapt to your needs.
    if (!upcoming) {
      upcoming = { ...prayersToday[0] };
      // add 1 day
      upcoming.dateObj = new Date(
        upcoming.dateObj.getTime() + 24 * 60 * 60 * 1000
      );
    }

    // Calculate time difference
    const diffMs = upcoming.dateObj.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    // Update state
    setNextPrayerName(upcoming.name);
    setTimeUntilNextPrayer(`${hours}h ${minutes}min`);
  }, [prayers]);

  // -----------------
  // For your ring logic
  // -----------------
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const degrees =
    (hours % 12) * 30 + (minutes / 60) * 30 + (seconds / 60 / 60) * 30;

  const style = {
    background: `conic-gradient(#7c3aed ${degrees}deg, #fff 0deg)`,
  };

  return (
    <section className="flex items-center gap-4">
      {/* Left block: render all prayers */}
      <div className="w-full h-72 bg-muted rounded-lg grid grid-cols-4 grid-rows-2 gap-4 p-4">
        {prayers.map((p) => {
          const displayTime = p.time ? p.time.slice(0, 5) : "00:00";
          return (
            <div
              key={p.id}
              className="bg-card rounded-sm flex flex-col items-start pl-4 justify-center"
            >
              <span className="capitalize text-lg">{p.name}</span>
              <span className="text-4xl">{displayTime}</span>
            </div>
          );
        })}
      </div>

      {/* Right block: ring and next prayer info */}
      <div className="min-w-72 h-72 bg-muted rounded-lg flex items-center justify-center">
        <div
          style={style}
          className="relative rounded-[100%] bg-white size-56 flex items-center justify-center"
        >
          <div className="rounded-[100%] bg-muted size-[13.3rem] flex flex-col items-center justify-center">
            {/* Display the next prayer and the time remaining */}
            <span>{nextPrayerName} Prayer After</span>
            <span className="text-3xl">{timeUntilNextPrayer}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
