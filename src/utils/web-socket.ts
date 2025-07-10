import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://ikoncloud-uat.keross.com", {
  path: "/cstools/socket.io",
  transports: ["websocket"],
  autoConnect: false, // Prevents automatic connection
});

export default socket;
