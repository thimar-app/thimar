// // import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
// // import { Separator } from "@radix-ui/react-separator";
// // import {
// //   Breadcrumb,
// //   BreadcrumbItem,
// //   BreadcrumbLink,
// //   BreadcrumbList,
// //   BreadcrumbPage,
// //   BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb";

// // import { Goal, Pentagon } from "lucide-react";
// // import { HomePreferenceActions } from "@/components/pages/home/home-preference-actions";

// // type View = "simple-list" | "prayer-list" | "board";

// // type HomeHeader = {
// //   view: View;
// //   setView: React.Dispatch<React.SetStateAction<View>>;
// //   showPrayerSection: boolean;
// //   showCompletedTasks: boolean;
// //   setShowPrayerSection: React.Dispatch<React.SetStateAction<boolean>>;
// //   setShowCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
// // };

// // export default function GoalHeader({ title }: { title: string }) {
// //   const { state } = useSidebar();
// //   return (
// //     <header className="flex h-14 shrink-0 items-center gap-2">
// //       <div className="flex flex-1 items-center gap-2">
// //         {state === "collapsed" && <SidebarTrigger />}
// //         {state === "collapsed" && (
// //           <Separator orientation="vertical" className="mr-2 h-4" />
// //         )}

// //         <Breadcrumb>
// //           <BreadcrumbList>
// //             <BreadcrumbItem>
// //               <BreadcrumbLink href="/goals" className="flex gap-2 items-center">
// //                 <Goal className="size-4" />
// //                 Goals
// //               </BreadcrumbLink>
// //             </BreadcrumbItem>

// //             <BreadcrumbSeparator />
// //             <BreadcrumbItem>
// //               <BreadcrumbPage className="line-clamp-1 flex items-center gap-2">
// //                 {title}
// //               </BreadcrumbPage>
// //             </BreadcrumbItem>
// //           </BreadcrumbList>
// //         </Breadcrumb>
// //       </div>
// //       <div className="ml-auto px-3">
// //         {/* <HomePreferenceActions
// //           view={view}
// //           setView={setView}
// //           showPrayerSection={showPrayerSection}
// //           setShowPrayerSection={setShowPrayerSection}
// //           showCompletedTasks={showCompletedTasks}
// //           setShowCompletedTasks={setShowCompletedTasks}
// //         /> */}
// //       </div>
// //     </header>
// //   );
// // }


// import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
// import { Separator } from "@radix-ui/react-separator";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// import { Goal, Pentagon } from "lucide-react";
// import { HomePreferenceActions } from "@/components/pages/home/home-preference-actions";
// import { Link } from "react-router-dom";

// type View = "simple-list" | "prayer-list" | "board";

// type HomeHeader = {
//   view: View;
//   setView: React.Dispatch<React.SetStateAction<View>>;
//   showPrayerSection: boolean;
//   showCompletedTasks: boolean;
//   setShowPrayerSection: React.Dispatch<React.SetStateAction<boolean>>;
//   setShowCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
// };

// export default function GoalHeader({ title }: { title: string }) {
//   const { state } = useSidebar();
//   return (
//     <header className="flex h-14 shrink-0 items-center gap-2">
//       <div className="flex flex-1 items-center gap-2">
//         {state === "collapsed" && <SidebarTrigger />}
//         {state === "collapsed" && (
//           <Separator orientation="vertical" className="mr-2 h-4" />
//         )}
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <Link to={"/goals"}>
//                 <BreadcrumbPage className="text-muted-foreground hover:text-foreground transition-colors flex gap-2 items-center">
//                   <Goal className="size-4" />
//                   Goals
//                 </BreadcrumbPage>
//               </Link>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage className="line-clamp-1 flex items-center gap-2">
//                 {title}
//               </BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//       </div>

//     </header>
//   );
// }


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

export default function GoalHeader({ title }: { title: string }) {
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
    </header>
  );
}
