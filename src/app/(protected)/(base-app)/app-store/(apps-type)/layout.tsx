import { ReactNode } from "react";
import AppsToggle from "./components/apps-toggle";
import AppSearchByName from "./components/app-search";
import { AppStateProvider } from "./components/app-context";



async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  // const allApps = await AllAppData();

  return (
    <AppStateProvider>

      <div className="flex flex-col gap-3 h-full">
        <div className="flex gap-3">
          <AppsToggle />
          {/* <AppFilter  /> */}
          <div className="ml-auto flex gap-3">
            <AppSearchByName />
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>

    </AppStateProvider>
  )
}

export default Layout