import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getUsersByGroupName } from "@/ikon/utils/actions/users";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";

export async function getUserMapForCurrentAccount(parameters: { groups: string[] } | null = null) {
	let usersDetailsMap = {};
	try {
        const baseSoftwareId = await getBaseSoftwareId();
		const platformUtilInstances = await getMyInstancesV2({
            processName: "User Dashboard Platform Util - All",
            softwareId: baseSoftwareId,
        });
		let taskId = platformUtilInstances[0].taskId;
		usersDetailsMap = await getParameterizedDataForTaskId({taskId: taskId, parameters:parameters});
	} catch (error) {
		console.error(error);
	}
	return usersDetailsMap
}

export async function getProjectManagerDetails() {
	try {
        
        // var userIdMap = await getUserMapForCurrentAccount({groups :["Project Manager"]});
		const projecManagertGroup = await getUsersByGroupName("Project Manager");
        const projectManagerGroupUser = projecManagertGroup?.users;
        return Object.values(projectManagerGroupUser);

	} catch (error) {
		console.error(error);
	}

}