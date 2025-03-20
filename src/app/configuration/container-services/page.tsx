import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function ContainerServicesConfig() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Container Services",
          href: "/configuration/container-services"
        }}
      />
      <div className="px-6 py-3">
        <h2 className="text-2xl font-semibold text-primary">
          Container Services
        </h2>
      </div>
    </>
  );
}
