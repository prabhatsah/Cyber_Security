import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="h-full p-6 bg-white dark:bg-gray-950">{children}</div>
        </main>
      </div>
    </div>
  );
}
