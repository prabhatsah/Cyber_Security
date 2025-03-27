"use client";
import { useState, useEffect, useRef } from "react";
import { Card, Title, Text, Button, Divider } from "@tremor/react";
import DockerPage from "./docker/page";
import KubernetesPage from "./kubernetes/page";
import { getTotalVulnerabilitiesForImages } from "./docker/sideMenuHistory";
import * as api from "@/utils/api";
import * as prevScans from "./docker/scanHistory";
import { FaDocker } from "react-icons/fa";
import { BiLogoKubernetes } from "react-icons/bi";

import Loading from "./loading";

const fetchHistoryScans = async () => {
  const tableName = "image_file_scanning";
  const orderByColumn = "slno";
  const scans = await api.fetchData(tableName, orderByColumn);
  console.log(scans);
  prevScans.setter(scans);
};
async function fetchAndProcessHistory() {
  await fetchHistoryScans();
  return getTotalVulnerabilitiesForImages(prevScans.getter()?.data);
}

export default function Dashboard() {
  const hasFetched = useRef(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAndProcessHistory().then((data) => {
        console.log(data);
        setHistoryData(data);
        prevScans.VulnerabilitiesSetter(data);
      });

      hasFetched.current = true;
    }
  }, []);

  if (!prevScans.Vulnerabilitiesgetter()) {
    return <Loading />;
  }

  return (
    <div className=" flex flex-col items-center">
      {selectedTool === "docker" ? (
        <DockerPage onBack={() => setSelectedTool(null)} />
      ) : selectedTool === "kubernetes" ? (
        <KubernetesPage onBack={() => setSelectedTool(null)} />
      ) : (
        <>
          <h1 className="text-2xl  mb-8 text-blue-500">Container Tools</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            <Card className="cursor-default transform transition-all rounded-lg p-0 duration-300 hover:scale-105 shadow-lg hover:shadow-2xl flex flex-col">
              <div className="flex flex-row items-center gap-4 p-6 w-full bg-blue-500 text-white rounded-t">
                <FaDocker className="w-10 h-10" />
                <p className="text-2xl font-semibold">Docker</p>
              </div>

              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed dark:text-gray-300 flex-grow min-h-[200px]">
                <Text>
                  Docker is an open-source platform designed to simplify the
                  deployment, scaling, and management of applications using
                  containerization. By encapsulating applications and their
                  dependencies into lightweight, portable containers, Docker
                  ensures consistency across different computing environments.
                  Unlike traditional virtualization, which requires an entire
                  operating system for each instance, Docker utilizes the host
                  OS kernel, making containers faster, more efficient, and
                  resource-friendly.
                </Text>
              </div>

              <div className="flex mt-auto justify-center p-5 w-full rounded-b-lg">
                <Button
                  color="blue"
                  size="lg"
                  className="rounded-full px-8 py-3"
                  onClick={() => setSelectedTool("docker")}
                >
                  Scan Docker
                </Button>
              </div>
            </Card>

            <Card className="cursor-default transform transition-all rounded-lg p-0 duration-300 hover:scale-105 shadow-lg hover:shadow-2xl flex flex-col">
              <div className="flex flex-row items-center gap-4 p-6 w-full bg-blue-500 text-white rounded-t">
                <BiLogoKubernetes className="w-10 h-10" />
                <p className="text-2xl text-white font-semibold">Kubernetes</p>
              </div>

              <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed dark:text-gray-300 flex-grow min-h-[200px]">
                <Text>
                  Kubernetes is an open-source container orchestration system
                  that automates the deployment, scaling, and management of
                  containerized applications. It provides a robust framework for
                  handling complex workloads by efficiently distributing
                  resources across different environments. With Kubernetes,
                  organizations can ensure high availability, fault tolerance,
                  and seamless application performance, whether running on
                  cloud, on-premise, or hybrid infrastructure.
                </Text>
              </div>

              <div className="flex mt-auto justify-center p-5 w-full rounded-b-lg">
                <Button
                  color="blue"
                  size="lg"
                  className="rounded-full px-8 py-3"
                  onClick={() => setSelectedTool("docker")}
                >
                  Scan Kubernetes
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
