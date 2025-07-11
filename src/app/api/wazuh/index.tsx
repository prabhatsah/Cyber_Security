import { getTicket } from "@/ikon/utils/actions/auth";
import pako from "pako";
import { toast } from "sonner";
import { IkonDomNodeRemoval } from "./IkonDomNodeRemoval";

export const componentWebsocketMap: Record<string, WebSocket> = {};

export async function subscribeToProcessEvents({
    viewComponentId,
    accountId,
    softwareId,
    processId,
    //processInstanceId,
    eventCallbackFunction,
    connectionOpenFunction,
    connectionClosedFunction
}: {
    viewComponentId: string;
    accountId?: string;
    softwareId?: string;
    processId: string;
    //processInstanceId?: string;
    eventCallbackFunction: (event: any) => void;
    connectionOpenFunction?: () => void;
    connectionClosedFunction?: () => void;
}): Promise<void> {

    const globalTicket = '32cdd2e5-ce13-4a73-8182-63bd9f207370'//await getTicket();

    if (!accountId) {
        const activeAccountId = "b8bbe5c9-ad0d-4874-b563-275a86e4b818"
        if (activeAccountId) {
            accountId = activeAccountId;
        }
    }

    if (!softwareId) {
        const currentSoftwareId = "abda94ad-1e44-4e7d-bb86-726d10df2bee"
        if (currentSoftwareId) {
            softwareId = currentSoftwareId;
        }
    }

    if (!accountId) throw new Error("accountId cannot be null or undefined.");
    if (!softwareId) throw new Error("softwareId cannot be null or undefined.");

    let ws = componentWebsocketMap[viewComponentId];
    if (ws) {
        console.log("Websocket already connected");
        subscribe(ws);
        return;
    }

    console.log("Creating new websocket connection");
    ws = new WebSocket(`wss://ikoncloud-dev.keross.com/realtime/processevent/${globalTicket}`);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
        console.log("Websocket opened");
        componentWebsocketMap[viewComponentId] = ws;

        IkonDomNodeRemoval.registerDomNodeRemovalFunction(viewComponentId, clearWs);
        connectionOpenFunction?.();
        subscribe(ws);
    };

    function subscribe(ws: WebSocket) {
        const subscription = { accountId, softwareId, processId, ticket: globalTicket } //processInstanceId
        // ? { accountId, softwareId, processId, processInstanceId, ticket: globalTicket }
        // : { accountId, softwareId, processId, ticket: globalTicket };

        ws.send(JSON.stringify(subscription));
    }

    ws.onmessage = (evt) => {
        const result = pako.ungzip(evt.data, { to: "string" });
        const event = JSON.parse(result);
        eventCallbackFunction(event);
    };

    ws.onclose = (evt) => {
        console.log("Websocket closed");
        if (evt.reason) toast.error(evt.reason);
        connectionClosedFunction?.();
    };
}

export function clearWs(viewComponentId: string): void {
    console.log("DOM Node removed", viewComponentId);
    const ws = componentWebsocketMap[viewComponentId];
    if (ws) {
        ws.close();
        delete componentWebsocketMap[viewComponentId];
    }
}
