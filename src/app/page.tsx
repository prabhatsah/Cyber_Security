import { handleAuthRedirect } from "./ikonHelper";
import "@/utils/secureGaurdService";
export default function Page() {
  //InitiateWebSocket();




  return handleAuthRedirect();
}