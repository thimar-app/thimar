import { Button } from "@/components/ui/button";
import { Loader, Sparkles } from "lucide-react";
import { useState } from "react";
import HomeHeader from "@/pages/home/home-header";
import PrayerListView from "@/pages/home/prayer-list-view";
import SimpleListView from "@/pages/home/simple-list-view";
import HomePrayerTimeSection from "./home-prayer-time-section";
import { useTaskContext } from "@/context/TaskContext";
import { generateDouaaAdvice } from "@/services/aiApi";

type View = "simple-list" | "prayer-list" | "board";

export default function Home() {
  const [view, setView] = useState<View>("simple-list");
  const [showPrayerSection, setShowPrayerSection] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const { progress } = useTaskContext();

  // State to control the douaa/advice dialog
  const [douaaMessage, setDouaaMessage] = useState<string>("");
  const [showDouaaDialog, setShowDouaaDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the advice/douaa from the backend using axios service and show it in a dialog
  async function handleGetTodaysBarakah() {
    setIsLoading(true);
    try {
      const data = await generateDouaaAdvice();
      setDouaaMessage(data.text);
      setIsLoading(false);
      setShowDouaaDialog(true);
    } catch (error) {
      console.error("Error fetching douaa/advice:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <HomeHeader
        view={view}
        setView={setView}
        showPrayerSection={showPrayerSection}
        setShowPrayerSection={setShowPrayerSection}
        showCompletedTasks={showCompletedTasks}
        setShowCompletedTasks={setShowCompletedTasks}
      />

      {/* Dialog for displaying the advice */}
      {showDouaaDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
          {/* Dialog container */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-8 mx-4 transform transition-all duration-300 scale-100">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Today's Advice
            </h2>
            <p className="text-gray-700 text-lg text-center">{douaaMessage}</p>
            <div className="mt-6 flex justify-center">
              <Button
                className="px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                onClick={() => setShowDouaaDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-col gap-4">
        {showPrayerSection && <HomePrayerTimeSection />}

        <section className="flex items-center gap-4">
          <div className="w-full h-12 bg-muted rounded-lg flex items-center justify-center gap-4 px-5">
            <div className="w-full h-3 rounded-full bg-muted-foreground/30">
              <div
                className="bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span>{progress.formattedPercentage}</span>
          </div>
          <Button
            className="min-w-72 h-12 bg-violet-600 rounded-lg"
            disabled={isLoading}
            onClick={handleGetTodaysBarakah}
          >
            {isLoading ? <Loader className="animate-spin" /> : <Sparkles />}
            Get Today's Barakah
          </Button>
        </section>

        <section className="w-full p-4 bg-muted rounded-lg">
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
