 export default function KubernetesPage({ onBack }: { onBack: () => void }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Kubernetes</h1>
        <p className="text-gray-600 mt-4">Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.</p>
      </div>
    );
  }
  