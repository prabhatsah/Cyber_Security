
import Dashboard from "./components/Dashboard";

export default function MainPage({
  params,
}: {
  params: { serviceName: string };
}) {
  const serviceName = params.serviceName;
  return <Dashboard service={serviceName} />
}
