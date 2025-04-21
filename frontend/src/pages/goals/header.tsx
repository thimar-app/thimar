import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Target } from "lucide-react";

export default function GoalsHeader() {
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
                <Target className="size-4 sm:size-5" />
                <span className="text-base sm:text-lg font-semibold">Goals</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
