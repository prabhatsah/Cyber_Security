import { getUsersByGroupName } from "@/ikon/utils/actions/users";

export async function getProjectManagerDetails() {
    try {
        
        const projectManagertGroup = await getUsersByGroupName("Project Manager");
        const ProjectManagerGroupUser = projectManagertGroup?.users;
        return Object.values(ProjectManagerGroupUser);

    } catch (error) {
        console.error(error);
    }

}