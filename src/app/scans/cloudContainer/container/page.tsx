"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Button } from "@tremor/react";
import { getTotalVulnerabilitiesForImages } from "./docker/sideMenuHistory";
import * as api from "@/utils/api";
import * as prevScans from "./docker/scanHistory";
import { FaDocker } from "react-icons/fa";
import { BiLogoKubernetes } from "react-icons/bi";
import Loading from "./loading";
import { useRouter } from "next/navigation";

const fetchHistoryScans = async () => {
  const tableName = "container_security_history";
  const orderByColumn = "id";
  const scans = await api.fetchScannedData(tableName, orderByColumn, false, null, null, 0, 10);
  console.log(scans);
  prevScans.setter(scans);
};

async function fetchAndProcessHistory() {
  await fetchHistoryScans();
  return getTotalVulnerabilitiesForImages(prevScans.getter()?.data);
}

export default function Dashboard() {
  const hasFetched = useRef(false);
  const [historyData, setHistoryData] = useState<any>(null);
  const router = useRouter();

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
    <div className="flex flex-col items-center">
      <>
        <h1 className="text-2xl mb-8 text-widget-title">Container Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Docker Card */}
          <Card className="cursor-default rounded-lg p-0 duration-300 shadow-lg hover:shadow-2xl flex flex-col">
            <div className="flex flex-row items-center gap-4 p-6 w-full text-white rounded-t">
              <FaDocker className="w-10 h-10" />
              <p className="text-2xl font-semibold text-widget-mainHeader">Docker</p>
            </div>

            <div className="px-6 py-4 text-sm leading-relaxed flex-grow min-h-[200px]">
              <span className="text-widget-mainDesc">
                Docker is an open-source platform designed to simplify the
                deployment, scaling, and management of applications using
                containerization. By encapsulating applications and their
                dependencies into lightweight, portable containers, Docker
                ensures consistency across different computing environments.
                Unlike traditional virtualization, which requires an entire
                operating system for each instance, Docker utilizes the host
                OS kernel, making containers faster, more efficient, and
                resource-friendly.
              </span>
            </div>

            <div className="flex mt-auto justify-center p-5 w-full rounded-b-lg">
              <Button
                color="blue"
                size="lg"
                className="rounded-sm px-8 py-3"
                onClick={() => router.push("/scans/cloudContainer/container/docker")}
              >
                Scan Docker
              </Button>
            </div>
          </Card>

          {/* Kubernetes Card */}
          <Card className="cursor-default rounded-lg p-0 shadow-lg hover:shadow-2xl flex flex-col">
            <div className="flex flex-row items-center gap-4 p-6 w-full text-white rounded-t">
              <BiLogoKubernetes className="w-10 h-10" />
              <p className="text-2xl text-widget-mainHeader font-semibold">Kubernetes</p>
            </div>

            <div className="px-6 py-4 text-sm leading-relaxed flex-grow min-h-[200px]">
              <span className="text-widget-mainDesc">
                Kubernetes is an open-source container orchestration system
                that automates the deployment, scaling, and management of
                containerized applications. It provides a robust framework for
                handling complex workloads by efficiently distributing
                resources across different environments. With Kubernetes,
                organizations can ensure high availability, fault tolerance,
                and seamless application performance, whether running on
                cloud, on-premise, or hybrid infrastructure.
              </span>
            </div>

            <div className="flex mt-auto justify-center p-5 w-full rounded-b-lg">
              <Button
                color="blue"
                size="lg"
                className="rounded-sm px-8 py-3"
                onClick={() => router.push("/scans/cloudContainer/container/kubernetes")}
              >
                Scan Kubernetes
              </Button>
            </div>
          </Card>
        </div>
      </>
    </div>
  );
}