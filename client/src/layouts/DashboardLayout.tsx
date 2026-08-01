import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { SiteHeader } from "./components/Header";
import { RightPanel } from "./components/RightPanel";
import { RightPanelProvider } from "./right-panel";

export function DashboardLayout() {
  return (
    <SidebarProvider className="h-svh" style={{ "--sidebar-width": "clamp(10rem, 20vw, 16rem)" } as React.CSSProperties}>
      <RightPanelProvider>
        <AppSidebar />
        <SidebarInset className="h-svh min-w-0 overflow-hidden">
          <SiteHeader />
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <main className="h-full min-w-0 p-4 sm:p-6 overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Outlet />
            </main>
            <RightPanel />
          </div>
        </SidebarInset>
      </RightPanelProvider>
    </SidebarProvider>
  );
}


// export function DashboardLayout() {
//   return (
//     <SidebarProvider className="h-svh">
//       <RightPanelProvider>
//         <AppSidebar />
//         <SidebarInset className="h-svh min-w-0 overflow-hidden">
//           <SiteHeader />
//           <div className="relative min-w-0 flex-1 overflow-hidden">
//             <main className="h-full min-w-0 overflow-y-auto p-4 sm:p-6">
//               <Outlet />
//             </main>
//             <RightPanel />
//           </div>
//         </SidebarInset>
//       </RightPanelProvider>
//     </SidebarProvider>
//   );
// }