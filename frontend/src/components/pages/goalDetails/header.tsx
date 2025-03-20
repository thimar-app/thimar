import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Goal } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderPreference } from "./header-preference";
import { useGoalContext } from "@/context/GoalContext";

export default function GoalHeader({
  title,
  id,
}: {
  title: string;
  id: string;
}) {
  const { state } = useSidebar();
  const { deleteGoal } = useGoalContext();
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
              <Link to={"/goals"}>
                <BreadcrumbPage className="text-muted-foreground hover:text-foreground transition-colors flex gap-2 items-center">
                  <Goal className="size-4" />
                  Goals
                </BreadcrumbPage>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 flex items-center gap-2">
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-3">
        <HeaderPreference
          onDelete={() => {
            deleteGoal(id);
          }}
        />
      </div>
    </header>
  );
}
