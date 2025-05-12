
import { useEffect } from 'react';
import { getSocket } from '@/utils/webSocketComponent';
import InitiateWebSocket from "@/utils/web-socket";
import { handleAuthRedirect } from "./ikonHelper";

export default function Page() {
  //InitiateWebSocket();




  return handleAuthRedirect();
}