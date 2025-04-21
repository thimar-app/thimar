import { Button } from "@/components/ui/button";
import { Loader, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import HomeHeader from "@/pages/home/home-header";
import PrayerListView from "@/pages/home/prayer-list-view";
import SimpleListView from "@/pages/home/simple-list-view";
import HomePrayerTimeSection from "./home-prayer-time-section";
import { useTaskContext } from "@/context/TaskContext";
import { generateBaraqahFromAI } from "@/services/aiApi";

type View = "simple-list" | "prayer-list" | "board";

// Define a type for baraqah data
interface BaraqahData {
  message: string;
  source: string;
  explanation: string;
}

// Add media queries for responsiveness
const styles = {
  container: `flex flex-col gap-4`,
  dialog: `fixed inset-0 z-50 flex items-center justify-center`,
  dialogContainer: `relative bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-8 mx-4 transform transition-all duration-300 scale-100`,
  progressSection: `flex items-center gap-4`,
  progressBar: `w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5`,
  progressBarInner: `bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out`,
  button: `min-w-72 h-12 bg-violet-600 rounded-lg`,
  section: `w-full p-4 bg-muted rounded-lg`,
};

// Media queries for responsiveness
const mediaQueries = `
  @media (max-width: 768px) {
    .${styles.dialogContainer} {
      max-width: 90%;
    }
    .${styles.progressSection} {
      flex-direction: column;
    }
    .${styles.button} {
      width: 100%;
    }
  }
`;

export default function Home() {
  const [view, setView] = useState<View>("simple-list");
  const [showPrayerSection, setShowPrayerSection] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const { progress } = useTaskContext();

  // State to control the baraqah dialog
  const [baraqahMessage, setBaraqahMessage] = useState<string>("");
  const [baraqahSource, setBaraqahSource] = useState<string>("");
  const [baraqahExplanation, setBaraqahExplanation] = useState<string>("");
  const [showBaraqahDialog, setShowBaraqahDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousBaraqahGenerations, setPreviousBaraqahGenerations] = useState<BaraqahData[]>([]);
  const [generationAttempts, setGenerationAttempts] = useState(0);

  // Fetch the baraqah from the backend using the new API
  async function handleGetTodaysBarakah() {
    setIsLoading(true);
    try {
      // Increment generation attempts to force uniqueness
      setGenerationAttempts(prev => prev + 1);
      
      // Create a unique timestamp to ensure each request is different
      const timestamp = new Date().toISOString();
      
      const data = await generateBaraqahFromAI({
        goal_id: "general",
        completed_tasks: [],
        current_goal: { 
          title: "Daily Activities", 
          description: "General daily tasks and activities",
          progress: progress.percentage
        },
        previous_generations: previousBaraqahGenerations,
        timestamp: timestamp, // Add timestamp to force uniqueness
        attempt: generationAttempts // Add attempt counter to force uniqueness
      });
      
      // Check if we got valid data
      if (data && data.message) {
        setBaraqahMessage(data.message);
        setBaraqahSource(data.source || "Islamic wisdom");
        setBaraqahExplanation(data.explanation || "A reminder of Allah's blessings in our daily endeavors.");
        
        // Store this generation in the history
        setPreviousBaraqahGenerations(prev => [...prev, data]);
        
        setShowBaraqahDialog(true);
      } else {
        console.error("Invalid baraqah data received:", data);
        // Use fallback message
        setBaraqahMessage("May Allah bless your efforts and guide you to success.");
        setBaraqahSource("General Islamic wisdom");
        setBaraqahExplanation("A reminder of Allah's blessings in our daily endeavors.");
        setShowBaraqahDialog(true);
      }
    } catch (error) {
      console.error("Error fetching baraqah:", error);
      // Fallback message
      setBaraqahMessage("May Allah bless your efforts and guide you to success.");
      setBaraqahSource("General Islamic wisdom");
      setBaraqahExplanation("A reminder of Allah's blessings in our daily endeavors.");
      setShowBaraqahDialog(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle regeneration
  const handleRegenerateBaraqah = () => {
    // Close the dialog first
    setShowBaraqahDialog(false);
    // Then generate a new one after a short delay
    setTimeout(() => {
      handleGetTodaysBarakah();
    }, 300);
  };

  return (
    <>
      <style>{mediaQueries}</style>
      <HomeHeader
        view={view}
        setView={setView}
        showPrayerSection={showPrayerSection}
        setShowPrayerSection={setShowPrayerSection}
        showCompletedTasks={showCompletedTasks}
        setShowCompletedTasks={setShowCompletedTasks}
      />

      {/* Dialog for displaying the baraqah */}
      {showBaraqahDialog && (
        <div className={styles.dialog}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
          {/* Dialog container */}
          <div className={styles.dialogContainer}>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">
              Today's Barakah
            </h2>
            <div className="space-y-4">
              <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                <p className="text-gray-800 text-lg text-center font-medium">{baraqahMessage}</p>
              </div>
              {baraqahSource && (
                <p className="text-white text-sm italic text-center">
                  <span className="font-semibold">Source:</span> {baraqahSource}
                </p>
              )}
              {baraqahExplanation && (
                <p className="text-white text-sm text-center">
                  <span className="font-semibold">Explanation:</span> {baraqahExplanation}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <Button
                className="px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                onClick={() => setShowBaraqahDialog(false)}
              >
                Close
              </Button>
              <Button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleRegenerateBaraqah}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                New Barakah
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className={styles.container}>
        {showPrayerSection && <HomePrayerTimeSection />}

        <section className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div className="w-full h-3 rounded-full bg-muted-foreground/30">
              <div
                className={styles.progressBarInner}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span>{progress.formattedPercentage}</span>
          </div>
          <Button
            className={styles.button}
            disabled={isLoading}
            onClick={handleGetTodaysBarakah}
          >
            {isLoading ? <Loader className="animate-spin" /> : <Sparkles />}
            Get Today's Barakah
          </Button>
        </section>

        <section className={styles.section}>
          {view === "prayer-list" ? (
            <PrayerListView />
          ) : (
            <SimpleListView
              todayTasks
              showCompletedTasks={showCompletedTasks}
            />
          )}
        </section>
      </main>
    </>
  );
}
