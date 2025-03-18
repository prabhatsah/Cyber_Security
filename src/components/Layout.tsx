// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen bg-white">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden ">
//         <Navbar />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
//           <div className="h-full p-6 bg-white dark:bg-gray-950">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({
  children,
  isLoginPage,
}: {
  children: React.ReactNode;
  isLoginPage: boolean;
}) {
  return (
    <div className={`flex h-screen ${isLoginPage ? "bg-white  dark:bg-gray-950" : ""}`}>
      {/* Render Sidebar and Navbar only if not on the login page */}
      {!isLoginPage && (
        <div className="w-64">
          <Sidebar />
        </div>
      )}

      <div className={`flex-1 flex flex-col overflow-hidden `}>
        {/* Render Navbar only if not on the login page */}
        {!isLoginPage && <Navbar />}

        {/* Main content */}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto ${
            isLoginPage ? "w-full h-full" : "bg-background"
          }`}
        >
          <div
            className={`h-full p-6 ${
              isLoginPage ? "w-full" : "bg-white dark:bg-gray-950"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
