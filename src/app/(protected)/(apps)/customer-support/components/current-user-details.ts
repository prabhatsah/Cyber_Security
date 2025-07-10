import { useState, useEffect, useRef } from 'react';
import { getProfileData, getTicket } from "@/ikon/utils/actions/auth"; // Adjust this path accordingly

interface ProfileData {
  USER_NAME: string;
  USER_ID: string;
  USER_LOGIN: string;
  USER_EMAIL: string;
}

const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const userNameRef = useRef<string>("");
  const userIdRef = useRef<string>("");
  const userLoginRef = useRef<string>("");
  const userEmailRef = useRef<string>("");
  const userMobileRef = useRef<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData();
        userNameRef.current = data.USER_NAME;
        userIdRef.current = data.USER_ID;
        userLoginRef.current = data.USER_LOGIN;
        userEmailRef.current = data.USER_EMAIL;
        userMobileRef.current = data.USER_PHONE;
        
        setProfileData(data); // Store data in state
        console.log("Profile data fetched:", data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
    fetchProfileData();
  }, []);

  return { profileData, userNameRef, userIdRef, userLoginRef, userEmailRef, userMobileRef };
};

export default useProfile;
