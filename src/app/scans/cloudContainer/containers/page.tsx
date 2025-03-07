"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Boxes, Server } from "lucide-react";
import DockerPage from "./docker/page";
import KubernetesPage from "./kubernetes/page";

export default function Dashboard() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {selectedTool === "docker" ? (
        <DockerPage onBack={() => setSelectedTool(null)} />) : selectedTool === "kubernetes" ? (
        <KubernetesPage onBack={() => setSelectedTool(null)} />) : ( 
        <>
          <h1 className="text-2xl mt-10 mb-8 text-blue-500">Container Tools</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-6">

            <Card className="cursor-default transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl rounded-lg border border-gray-300 bg-white">
              <CardHeader className="flex flex-row items-center gap-4 p-6 rounded-t-lg bg-blue-500 text-white">
                <Boxes className="w-10 h-10" />
                <CardTitle className="text-2xl font-semibold">Docker</CardTitle>
              </CardHeader>
              <CardDescription className="px-6 py-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Docker is an open-source platform that enables developers to automate the deployment, scaling, and management 
                  of applications using containerization. It allows applications and their dependencies to be packaged together 
                  in lightweight, portable containers.
                </p>

                <p className="mt-3">
                  Containers ensure consistency across different environments, making Docker a popular choice for 
                  DevOps, microservices, and cloud-native applications. It simplifies software delivery by eliminating 
                  compatibility issues between development, testing, and production.
                </p>

                <p className="mt-3">
                  Key features include fast and efficient containerized application deployment, resource isolation, scalability, 
                  and integration with orchestration tools like Kubernetes. Docker supports multiple operating systems and 
                  cloud platforms.
                </p>
              </CardDescription>
              <CardContent className="flex mt-5 justify-center p-5 bg-gray-100 rounded-b-lg">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all" onClick={() => setSelectedTool("docker")}>
                  Scan for docker
                </button>
              </CardContent>
            </Card>


            <Card className="cursor-default transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl rounded-lg border border-gray-300 bg-white">
              <CardHeader className="flex flex-row items-center gap-4 p-6 rounded-t-lg bg-blue-500 text-white">
                <Server className="w-10 h-10" />
                <CardTitle className="text-2xl font-semibold">Kubernetes</CardTitle>
              </CardHeader>
              <CardDescription className="px-6 py-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Kubernetes is an open-source container orchestration system that automates deployment, scaling, and management 
                  of containerized applications. It helps organizations efficiently manage workloads across multiple environments.
                </p>
                
                <p className="mt-3">
                  Originally developed by Google and now maintained by the Cloud Native Computing Foundation (CNCF), Kubernetes 
                  enables automated rollouts, self-healing, load balancing, and resource optimization. It integrates seamlessly with 
                  Docker and other container runtimes.
                </p>

                <p className="mt-3">
                  Key features include service discovery, storage orchestration, networking, and security policies. 
                  Kubernetes is widely used in cloud-native applications, microservices architectures, and hybrid cloud environments.
                </p>
              </CardDescription>
              <CardContent className="flex justify-center p-5 mt-5  bg-gray-100 rounded-b-lg">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all" onClick={() => setSelectedTool("kubernetes")}>
                  Scan for kubernetes
                </button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
