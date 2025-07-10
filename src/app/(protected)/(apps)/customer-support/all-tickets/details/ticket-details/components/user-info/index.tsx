"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { useState, useEffect } from "react";
import { getProfileData } from "@/ikon/utils/actions/auth";

type TicketDetails = {
  assinedTo: string;
  accountName: string;
  subject: string;
  priority: string;
  type: string;
  accountId: string;
  dateCreated: string;
  ticketNo: string;
  issueDate: string;
  status: string;
};

export default function TicketUserInfoComponent({ ticketDetails }: { ticketDetails: TicketDetails }) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getProfileData();
      setUserName(data.USER_NAME);
      setUserId(data.USER_ID);
      setUserLogin(data.USER_LOGIN);
      setUserEmail(data.USER_EMAIL);
      setUserMobile(data.USER_PHONE);
      console.log("Profile data fetched: ", data);
    };
    fetchProfileData();
  }, []);

  console.log("Ticket Details:", ticketDetails);

  return (
    <Card className="h-1/2 flex flex-col mt-3">
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle> User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 p-0 overflow-hidden">
          <div className="flex gap-2 align-middle border-b py-2 px-3">
            Name: {userName || "n/a"}
          </div>
          <div className="flex gap-2 align-middle border-b py-2 px-3">
            Username: {userLogin || "n/a"}
          </div>
        </div>
        <div className="grid gap-2 p-0 overflow-hidden">
          <div className="flex gap-2 align-middle border-b py-2 px-3">
            Email Id: {userEmail || "n/a"}
          </div>
          <div className="flex gap-2 align-middle border-b py-2 px-3">
            Mobile No: {userMobile || "n/a"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
