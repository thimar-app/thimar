import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Goal } from "lucide-react";

export default function GoalsHeader() {
  const { state } = useSidebar();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2">
        {state === "collapsed" && <SidebarTrigger />}
        {state === "collapsed" && (
          <Separator orientation="vertical" className="mr-2 h-4" />
        )}

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 flex items-center gap-2">
                <Goal className="size-4" />
                Goals
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
