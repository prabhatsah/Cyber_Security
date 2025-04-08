import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function ContainerServicesConfig() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Container Tools",
          href: "/configuration/container-tools"
        }}
      />
      <div className="px-6 py-3">
        <h2 className="text-2xl font-semibold text-primary">
          Container Tools
        </h2>
      </div>
    </>
  );
}
