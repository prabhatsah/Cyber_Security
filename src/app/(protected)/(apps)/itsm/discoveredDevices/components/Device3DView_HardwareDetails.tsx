import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Copy, Server, Terminal, Wifi } from 'lucide-react';
import { toast } from "sonner";

interface Props{
    open: boolean;
    close: () => void;
    param: {
        hostIP: string;
        classification: string;
        os: string;
        discoveredBy: string;
        MAC: string;
    }
}
  
  const Device3DViewHardwareDetails: React.FC<Props> = ({open, close, param }) => {
    console.log('param: ', param)

    return (
        <Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[25vw]">

                    <div className="w-full">
                        <DialogHeader className="w-full">
                            <DialogTitle></DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                
                        <div className="w-full">

                            <div className="w-full bg-transparent flex items-center justify-center p-4">
                                <div className="bg-transparent rounded-xl shadow-lg w-full space-y-6">
                                    {/* Header with Server Icon */}
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-900/50 rounded-lg">
                                        <Server className="w-6 h-6 text-blue-400" />
                                    </div>
                                        <h2 className="text-xl  text-gray-100">Server Information</h2>
                                    </div>

                                    {/* Information Grid */}
                                    <div className="space-y-4">
                                    {/* Host IP Address */}
                                    <div className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-400">Host IP Address:</p>
                                            <p className="text-base  text-gray-100">{param.hostIP}</p>
                                        </div>
                                        <button onClick={()=>{  
                                            navigator.clipboard.writeText(param.hostIP);
                                            toast.success("Copied to clipboard"); 
                                        }} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
                                        </button>
                                    </div>

                                    {/* Classification */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-400">Classification:</p>
                                        <div className="flex items-center space-x-2">
                                            <Terminal className="w-4 h-4 text-gray-400" />
                                            <p className="text-base  text-gray-100">{param.classification}</p>
                                        </div>
                                    </div>

                                    {/* Operating System */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-400">Operating System:</p>
                                        <p className="text-base  text-gray-100">{param.os}</p>
                                    </div>

                                    {/* Discovered By */}
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-400">Discovered By:</p>
                                        <p className="text-base  text-gray-100">{param.discoveredBy}</p>
                                    </div>

                                    {/* MAC Address */}
                                    <div className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-400">MAC Address:</p>
                                            <div className="flex items-center space-x-2">
                                                <Wifi className="w-4 h-4 text-gray-400" />
                                                <p className="text-base  text-gray-100">{param.MAC}</p>
                                            </div>
                                        </div>
                                        <button onClick={()=>{  
                                            navigator.clipboard.writeText(param.MAC);
                                            toast.success("Copied to clipboard"); 
                                        }} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                            <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </DialogContent>
            </Dialog>
    );
  };
  
  export default Device3DViewHardwareDetails;