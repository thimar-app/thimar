import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Pentagon } from "lucide-react";
import { HomePreferenceActions } from "./home-preference-actions";

type View = "simple-list" | "prayer-list" | "board";

type HomeHeader = {
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
  showPrayerSection: boolean;
  showCompletedTasks: boolean;
  setShowPrayerSection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HomeHeader({
  view,
  setView,
  showPrayerSection,
  setShowPrayerSection,
  showCompletedTasks,
  setShowCompletedTasks,
}: HomeHeader) {
  const { state } = useSidebar();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 sm:px-6 w-full">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        {state === "collapsed" && (
          <Separator orientation="vertical" className="h-4" />
        )}

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <Pentagon className="size-4" />
                <span className="text-lg font-semibold">Home</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto">
        <HomePreferenceActions
          view={view}
          setView={setView}
          showPrayerSection={showPrayerSection}
          setShowPrayerSection={setShowPrayerSection}
          showCompletedTasks={showCompletedTasks}
          setShowCompletedTasks={setShowCompletedTasks}
        />
      </div>
    </header>
  );
}
