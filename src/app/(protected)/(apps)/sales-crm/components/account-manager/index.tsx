import { getUsersByGroupName } from "@/ikon/utils/actions/users";

export async function getAccountManagerDetails() {
    try {
        
        const accountManagertGroup = await getUsersByGroupName("Account Manager");
        const AccountManagerGroupUser = accountManagertGroup?.users;
        return Object.values(AccountManagerGroupUser);

    } catch (error) {
        console.error(error);
    }

}

export async function getFormattedAccountManagers() {
    try {
      const rawUsers:any = await getAccountManagerDetails();
      
      return Object.values(rawUsers).map((user: any) => ({
        value: user.id || user.username,
        label: user.name || user.displayName || user.username,
      }));
    } catch (error) {
      console.error("Error formatting account managers:", error);
      return [];
    }
  }

  export async function getAccountManagerMap() {
    try {
      const rawUsers:any = await getAccountManagerDetails();
      const userMap: Record<string, string> = {};
  
      Object.values(rawUsers).forEach((user: any) => {
        const id = user.id || user.username;
        if (id) {
          userMap[id] = user.name || user.displayName || user.username;
        }
      });
  
      return userMap;
    } catch (error) {
      console.error("Error creating account manager map:", error);
      return {};
    }
  }