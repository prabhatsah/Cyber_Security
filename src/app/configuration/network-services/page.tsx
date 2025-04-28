import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function NetworkServicesConfig() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Network Services",
          href: "/configuration/network-services"
        }}
      />
      <div className="px-6 py-3">
        <h2 className="text-2xl font-semibold text-primary">
          Network Services
        </h2>
      </div>
    </>
  );
}
