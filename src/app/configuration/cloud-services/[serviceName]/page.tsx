export default async function CloudServiceDetails({
  params,
}: {
  params: Promise<{ serviceName: string }>;
}) {
  const serviceNameArray = (await params).serviceName.split("-");
  let serviceName = "";
  serviceNameArray.forEach((eachPart) => {
    serviceName +=
      eachPart.substring(0, 1).toUpperCase() +
      eachPart.substring(1, eachPart.length) +
      " ";
  });

  serviceName.trim();
  return (
    <>
      <div className="px-6 py-3">
        <h2 className="text-2xl font-semibold text-primary">{serviceName}</h2>
      </div>
    </>
  );
}
