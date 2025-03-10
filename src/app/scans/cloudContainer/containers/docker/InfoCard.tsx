import React from "react";

const ImageInfoCard = ({ title, value }) => (
  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
    <p className="text-md font-mono text-gray-900 dark:text-white break-all">{value}</p>
  </div>
);

export default function ImageDetails({ data }) {
  if (!data) return <p className="text-red-500">No data available</p>;
  
  const { Metadata } = data;
  const osDetails = `${Metadata.OS.Family} ${Metadata.OS.Name}`;
  const createdAt = new Date(data.CreatedAt).toLocaleString();
  const imageConfig = Metadata.ImageConfig;
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Container Image Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageInfoCard title="OS Family" value={osDetails} />
        <ImageInfoCard title="Image ID" value={Metadata.ImageID} />
        <ImageInfoCard title="Architecture" value={imageConfig.architecture} />
        <ImageInfoCard title="Created At" value={createdAt} />
        <ImageInfoCard title="Command" value={imageConfig.config.Cmd.join(" ")} />
        <ImageInfoCard title="Environment" value={imageConfig.config.Env.join(", ")} />
        <ImageInfoCard title="Repository Tag" value={Metadata.RepoTags.join(", ")} />
        <ImageInfoCard title="Repository Digest" value={Metadata.RepoDigests.join(", ")} />
      </div>
    </div>
  );
}