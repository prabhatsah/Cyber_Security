import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getTicket } from "@/ikon/utils/actions/auth";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { WS_URL } from "@/ikon/utils/config/urls";
import pako from "pako";
import { toast } from "sonner";
import { IkonDomNodeRemoval } from "./IkonDomNodeRemoval";

export const componentWebsocketMap: Record<string, WebSocket> = {};

export async function subscribeToProcessEvents({
    viewComponentId,
    accountId,
    softwareId,
    processId,
    processInstanceId,
    eventCallbackFunction,
    connectionOpenFunction,
    connectionClosedFunction
}: {
    viewComponentId: string;
    accountId: string;
    softwareId: string;
    processId: string;
    processInstanceId?: string;
    eventCallbackFunction: (event: any) => void;
    connectionOpenFunction?: () => void;
    connectionClosedFunction?: () => void;
}): Promise<void> {

    const globalTicket = await getTicket();

    if (!accountId) {
        const activeAccountId = await getActiveAccountId()
        if (activeAccountId) {
            accountId = activeAccountId;
        }
    }

    if (!softwareId) {
        const currentSoftwareId = await getCurrentSoftwareId()
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
    ws = new WebSocket(`${WS_URL}/processevent/${globalTicket}`);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
        console.log("Websocket opened");
        componentWebsocketMap[viewComponentId] = ws;

        IkonDomNodeRemoval.registerDomNodeRemovalFunction(viewComponentId, clearWs);
        connectionOpenFunction?.();
        subscribe(ws);
    };

    function subscribe(ws: WebSocket) {
        const subscription = processInstanceId
            ? { accountId, softwareId, processId, processInstanceId, ticket: globalTicket }
            : { accountId, softwareId, processId, ticket: globalTicket };

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
