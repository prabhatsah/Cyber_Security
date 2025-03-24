import Dashboard from "./components/Dashboard";

export default async function MainPage({
  params,
}: {
  params: Promise<{ serviceName: string; configId: string }>;
}) {
  // Await the Promise to get the actual params object
  const { serviceName, configId } = await params;

  return <Dashboard serviceName={serviceName} />;
}
