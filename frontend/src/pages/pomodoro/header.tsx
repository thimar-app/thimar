import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Clock9 } from "lucide-react";

export default function PomodoroHeader() {
  const { state } = useSidebar();
  return (
    <header className="flex h-12 sm:h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="sm:hidden" />
        {state === "collapsed" && (
          <Separator orientation="vertical" className="mr-2 h-3 sm:h-4" />
        )}

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs sm:text-sm line-clamp-1 flex items-center gap-1 sm:gap-2">
                <Clock9 className="h-3 w-3 sm:h-4 sm:w-4" />
                Pomodoro
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
