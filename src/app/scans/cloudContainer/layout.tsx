import CloudContainerSidebar from "./components/CloudContainerSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full">
        <CloudContainerSidebar />
        {children}
      </div>
    </>
  );
}
