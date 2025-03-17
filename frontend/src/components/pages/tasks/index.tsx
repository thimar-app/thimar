import {
  Calendar1,
  CalendarSync,
  CheckCircle2,
  CirclePlus,
  Flag,
  Goal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TasksHeader from "./header";
import SimpleListView from "../home/simple-list-view";

export default function Tasks() {
  return (
    <main className="flex flex-col">
      <TasksHeader />

      {/* Progress Bar Section */}
      <section className="flex items-center gap-3">
        <div className="w-full p-4 pb-5 bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="flex items-center gap-3 font-semibold text-lg">
              <TrendingUp />
              Tasks Progress
            </h2>
            <span className="font-semibold text-lg text-muted-foreground">
              {22}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted-foreground/30">
            <div
              className="bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
              style={{ width: `${22}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col w-52 bg-muted rounded-lg py-4 items-center">
          <span className="flex gap-2 items-center font-semibold text-lg">
            <CheckCircle2 className="size-4" />
            Tasks Done
          </span>

          <span className="font-semibold text-2xl text-muted-foreground">
            12/56
          </span>
        </div>
      </section>

      <section className="gap-2 my-4 grid grid-cols-4">
        <Button className="!px-8 bg-violet-600 h-10">
          <Goal />
          Filter by Goals
        </Button>
        <Button className="!px-8 bg-violet-600 h-10">
          <Flag />
          Filter by Priorities
        </Button>
        <Button className="!px-8 bg-violet-600 h-10">
          <Calendar1 />
          Filter by Date
        </Button>
        <Button variant="secondary" className="!px-8  h-10 ">
          <CalendarSync />
          Show only Habits
        </Button>
      </section>

      <section className="w-full p-4 pt-2 bg-muted rounded-lg">
        <SimpleListView
          onEditTask={() => {
            console.log("f");
          }}
          showCompletedTasks={true}
          showGoals={true}
        />
      </section>
    </main>
  );
}
