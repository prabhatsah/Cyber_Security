import CloudContainerTabs from "./components/CloudContainerTabs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col h-full">
        <CloudContainerTabs />
        {children}
      </div>
    </>
  );
}
