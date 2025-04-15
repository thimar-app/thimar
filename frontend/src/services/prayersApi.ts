import api from './axios';

const PRAYER_CACHE_KEY = 'prayer_times_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface PrayerCache {
  data: any[];
  timestamp: number;
}

const getCachedPrayers = (): PrayerCache | null => {
  const cached = localStorage.getItem(PRAYER_CACHE_KEY);
  if (!cached) return null;
  
  try {
    const parsedCache = JSON.parse(cached) as PrayerCache;
    const now = Date.now();
    
    // Check if cache is still valid (less than 7 days old)
    if (now - parsedCache.timestamp < CACHE_DURATION) {
      return parsedCache;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(PRAYER_CACHE_KEY);
    return null;
  } catch (error) {
    console.error('Error parsing prayer cache:', error);
    localStorage.removeItem(PRAYER_CACHE_KEY);
    return null;
  }
};

const setCachedPrayers = (data: any[]) => {
  const cache: PrayerCache = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(cache));
};

export const fetchPrayersApi = async (forceRefresh = false) => {
  // Check cache first if not forcing refresh
  if (!forceRefresh) {
    const cached = getCachedPrayers();
    if (cached) {
      return cached.data;
    }
  }

  // Fetch fresh data from API
  const response = await api.get('/prayers/');
  
  // Cache the new data
  setCachedPrayers(response.data);
  
  return response.data;
};

// Function to check if prayer times need updating
export const checkPrayerTimesUpdate = async () => {
  const cached = getCachedPrayers();
  if (!cached) {
    return fetchPrayersApi(true);
  }
  
  const now = Date.now();
  const timeSinceLastUpdate = now - cached.timestamp;
  
  // If it's been more than 6 days, update in the background
  if (timeSinceLastUpdate > (6 * 24 * 60 * 60 * 1000)) {
    fetchPrayersApi(true).catch(console.error);
  }
  
  return cached.data;
};
