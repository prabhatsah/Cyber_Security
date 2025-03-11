export const BASE_URL = process.env.IKON_BASE_URL || "";

const url = new URL(BASE_URL);

const base = url.protocol + "//" + url.hostname;

let port = "";
if (url.port != "") {
  port = ":" + url.port;
}
let wsProtocol = "ws:";
if (url.protocol == "https:") {
  wsProtocol = "wss:";
}
export const BASE_API_URL = base + port + "/rest";
export const UPLOAD_URL = base + port + "/upload";
export const DOWNLOAD_URL = base + port + "/download";
export const UA_RESOURCE_UPLOAD = base + port + "/uaresourceupload";
export const UA_RESOURCE_URL = base + port + "/portal/uaresource";
export const WS_URL = wsProtocol + "//" + url.hostname + port + "/realtime";
