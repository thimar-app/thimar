import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import HomeHeader from "@/components/pages/home/home-header";
import PrayerListView from "@/components/pages/home/prayer-list-view";
import SimpleListView from "@/components/pages/home/simple-list-view";
import HomePrayerTimeSection from "./home-prayer-time-section";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/db/goals";

const handleEditTask = (task: Task) => {
  console.log("Editing task:", task);
  // Any additional handling needed at page level
};

type View = "simple-list" | "prayer-list" | "board";

export default function Home() {
  const [view, setView] = useState<View>("simple-list");
  const [showPrayerSection, setShowPrayerSection] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  const { progress } = useTaskContext();

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
          <Button className="min-w-72 h-12 bg-violet-600 rounded-lg">
            <Sparkles />
            Get Today's Barakah
          </Button>
        </section>

        <section className="w-full p-4 bg-muted rounded-lg">
          {view === "prayer-list" ? (
            <PrayerListView />
          ) : (
            <SimpleListView
              todayTasks
              onEditTask={handleEditTask}
              showCompletedTasks={showCompletedTasks}
            />
          )}
        </section>
      </main>
    </>
  );
}
