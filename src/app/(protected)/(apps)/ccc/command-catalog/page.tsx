
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { CommandDataType, CommandExecutionDataType, CommandIdWiseDetailsType, CommandScheduleDataType, DeviceConfigDataType, DeviceIdWiseDetailsType, CommandDeviceWiseScheduleDetailsType, UserCommandConfigType, ScheduleIdWiseExecutionDetailsType, SelectedHostIp, ProcessInstanceDeleteMapType } from "./types";
import { v4 as uuid } from "uuid";
import {Node, Edge} from "reactflow";
import Main from "./main";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import RoleMembershipInfo from "@/app/(protected)/(base-app)/setting/users/components/roleMembershipInfo";
import { ProfileDataType, RoleMembershipInfoType } from "../deviceList/types";
import { getProfileData } from "@/ikon/utils/actions/auth";

const processInstanceDeleteMap: ProcessInstanceDeleteMapType = {}

const deviceViewNodeType: {
  [key: string]: string
} = {}

const deviceIdWiseDetails: DeviceIdWiseDetailsType = {}

const commandDeviceMap: {
  [key: string] : string[]
} = {};

const deviceCommandMap : {
  [key: string] : Set<string>
} = {}

let currentRole: string = '';

const hierarchyAssoc = new Map<string, number[]>();

const commandIdWiseDetails: CommandIdWiseDetailsType = {};

const commandDeviceWiseScheduleDetails: CommandDeviceWiseScheduleDetailsType = {};

const scheduleIdWiseExecutionDetails: ScheduleIdWiseExecutionDetailsType = {};

//const edges: TreeNodeEdgesType[] = [];

const initialNodes: Node[] = [
  {
    id: "1",
    type: "treeNode",
    position: { x: 400, y: 0 },
    data: { 
      label: "Keross", isRoot: true, expanded: true, deviceCount: 0, source: undefined, commandsCount: 0 },
    style: { backgroundColor: 'transparent', color: '#000' },

  },
  {
    id: "2",
    type: "treeNode",
    position: { x: 200, y: 100 },
    data: { label: "Device View", expanded: true , deviceCount: 0, source: '1', commandsCount: 0},
    style: { backgroundColor: 'transparent', color: '#000' }
  },
  {
    id: "3",
    type: "treeNode",
    position: { x: 400, y: 100 },
    data: { label: "Command View", expanded: true , deviceCount: 0, source:'1', commandsCount: 0},
    style: { backgroundColor: 'transparent', color: '#000' }
  },
  {
    id: "4",
    type: "treeNode",
    position: { x: 600, y: 100 },
    data: { label: "Custom View", expanded: true , deviceCount: 0, commandsCount: 0, source: '1', nodeViewType: 'custom'},
    style: { backgroundColor: 'transparent', color: '#000' }
  }
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" }
];

const fetchConfigData = async function(){
  const onSuccess = function(data: DeviceConfigDataType[]){
    //console.log('fetchConfigDataonSucess: ')

    return data;
  } 

  const onFailure = function(err: unknown){
    console.error(err)

    return []
  }

  try{
    const incompleteLeafNodes:number[] = [];
    const associatedDevices:string[] = [...new Set(Object.values(commandDeviceMap).flatMap(n => Array.isArray(n) ? n : [n]))];

    const data = await getMyInstancesV2<DeviceConfigDataType>({
      processName: 'Configuration Item',
      predefinedFilters: {
        taskName: 'View CI Activity'
      }
    })

    function trimAfterLTS(input: string): string {
      return input.replace(/(LTS).*/, "$1");
    }

    const innerData: DeviceConfigDataType[] = [];

    data.forEach(obj=>{
      //if(obj.data.monitoringStatus && obj.data.dryRunAccessable && (obj.data.monitoringStatus == 'Yes'  && obj.data.dryRunAccessable == 'Yes')){

        if(associatedDevices.includes(obj.data.deviceId)){
          deviceIdWiseDetails[obj.data.deviceId] = obj.data;
          obj.data.os = trimAfterLTS(obj.data.os ? obj.data.os : '');

          if(deviceViewNodeType[obj.data.osType]==undefined){
            generateCommandViewNodes(obj.data.osType)
          }

          // 1st level
          if(deviceViewNodeType[obj.data.type]==undefined){
            generateDeviceViewNodes('dl1', obj.data.type)
          }
          
          // 2nd level
          if(obj.data.os!==null && deviceViewNodeType[obj.data.os]==undefined){
            generateDeviceViewNodes('dl2', obj.data.os, deviceViewNodeType[obj.data.type])
          }

          // leaf level
          if(deviceViewNodeType[obj.data.hostIp+'['+ obj.data.hostName +']']==undefined){
            const associatedCommandIds = deviceCommandMap[obj.data.deviceId];
            const commandIds = new Set<string>([]);
            const deviceIds = new Set<string>([]);
            let statusColor = ''

            deviceIds.add(obj.data.deviceId);

            const leafValues = Array.from(associatedCommandIds).map(commandId=>{
              const command = commandIdWiseDetails[commandId];
              const associatedDeviceIds = commandDeviceMap[commandId];

              if(deviceViewNodeType[command.commandName]==undefined){
                generateCommandViewNodes(
                  command.commandName, 
                  deviceViewNodeType[obj.data.osType], 
                  associatedDeviceIds.length, 1, 
                  commandId ,
                  true, 
                  incompleteLeafNodes, 
                  associatedDeviceIds)
              }

              commandIds.add(commandId)

              try{
                const isScheduled = commandDeviceWiseScheduleDetails[commandId][obj.data.deviceId] ? true : false;
                const scheduleId = commandDeviceWiseScheduleDetails[commandId][obj.data.deviceId].scheduleId;
                const executionResult = scheduleIdWiseExecutionDetails[scheduleId].status;

                if(statusColor != 'red' && executionResult == 'failure'){
                  statusColor = 'red';
                }
                else if(statusColor != 'red' && executionResult == 'success'){
                  statusColor = 'green';
                }

                if(!isScheduled) 
                  throw new Error('command not scheduled')

                return {
                  label: command.commandName,
                  executionStatus: isScheduled ? (executionResult ? executionResult : 'waiting') : ('not scheduled'),
                  commandId: commandId,
                  deviceId: obj.data.deviceId
                }
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              catch(err){
                //console.log(err)
                
                return {
                  label: command.commandName,
                  executionStatus: 'not scheduled',
                  commandId: commandId,
                  deviceId: obj.data.deviceId
                }
              }
              
            })

            generateDeviceViewNodes('dl2', obj.data.hostIp+'['+ obj.data.hostName +']', deviceViewNodeType[obj.data.os], deviceIds.size, commandIds.size, true, leafValues, statusColor)
          }
          
          innerData.push(obj.data)

        }

      //}
      
    });

    incompleteLeafNodes.forEach(val=>{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialNodes[val].data.leafValues.forEach((_: any, index: number)=>{
        initialNodes[val].data.leafValues[index].label = deviceIdWiseDetails[initialNodes[val].data.leafValues[index].deviceId].hostIp;
      })
    })
    
    //console.log('deviceViewNodeType : ', deviceViewNodeType);
    //console.log('hierarchyAssoc : ', hierarchyAssoc);
    //console.log('initial nodes: ', initialNodes);

    return onSuccess(innerData);
  }
  catch(err){
    return onFailure(err);
  }

}

const fetchCommandData = async function(){
  const onSuccess = function(data: CommandDataType[]){
    //console.log('fetchCommandData onSucess: ')

    return data;
  }

  const onFailure = function(err: unknown){
    console.error(err)

    return []
  }

  try{
    const data = await getMyInstancesV2<CommandDataType>({
      processName: 'Command Catalog',
      predefinedFilters: {
        taskName: 'View Commands'
      }
    })

    const innerData = data.map(obj=>{
      commandIdWiseDetails[obj.data.commandId] = obj.data;

      return obj.data
    });

    return onSuccess(innerData);
  }
  catch(err){
    return onFailure(err);
  }

}

const fetchCommandSchedulingData = async function(){
  const onSuccess = function(data: boolean){
    //console.log('fetchCommandSchedulingData onSuccess')

    return data;
  }

  const onFailure = function(err: unknown){
    console.error(err)

    return []
  }

  try{
    const data = await getMyInstancesV2<CommandScheduleDataType>({
      processName: 'Task Scheduler',
      predefinedFilters: {
        taskName: 'Task Schedule'
      }
    })

    data.forEach(obj=>{
      const { commandId, deviceId } = obj.data;

      if (!commandDeviceWiseScheduleDetails[commandId]) {
        commandDeviceWiseScheduleDetails[commandId] = {};
      }

      const deviceMap = commandDeviceWiseScheduleDetails[commandId];

      if (!deviceMap[deviceId]) {
        deviceMap[deviceId] = obj.data;
      }

      //return obj.data
    });


    return onSuccess(true);
  }
  catch(err){
    return onFailure(err);
  }

}

const fetchCommandExecutionData = async function(){
  const onSuccess = function(data: boolean){
    //console.log('fetchCommandExecutionData onSuccess  ')

    return data;
  }

  const onFailure = function(err: unknown){
    console.error(err)

    return [];
  }

  try{
    const data = await getMyInstancesV2<CommandExecutionDataType>({
      processName: 'scheduleId wise Results',
      predefinedFilters: {
        taskName: 'Schedule Result'
      }
    })

    data.forEach(obj=>{
      scheduleIdWiseExecutionDetails[obj.data.scheduleId] = obj.data;
    });

    return onSuccess(true);
  }
  catch(err){
   return onFailure(err);
  }

}

const fetchCustomCommandsData = async function(){
  const onSuccess = function(data: UserCommandConfigType[]){
    //console.log('fetchCustomCommandsData onSuccess  ')

    return data;
  }

  const onFailure = function(err: unknown){
    console.error(err)

    return [];
  }

  try{
    const data = await getMyInstancesV2<UserCommandConfigType>({
      processName: 'Service Catalogue View per User',
      predefinedFilters: {
        taskName: 'View Activity'
      }
    })

    const innerData = data.map(obj=>{    
      if(!processInstanceDeleteMap[obj.data.associatedTabId])
        processInstanceDeleteMap[obj.data.associatedTabId] = obj.processInstanceId;

      obj.data.configuredItemListForTab.forEach(obj=>{
        if(!commandDeviceMap[obj.commandId]){
          commandDeviceMap[obj.commandId] = obj.deviceIds;
        }
        else{
          commandDeviceMap[obj.commandId] = Array.from(new Set([...commandDeviceMap[obj.commandId], ...obj.deviceIds]));
        }
        

        obj.deviceIds.forEach(deviceId=>{
          if(!deviceCommandMap[deviceId])
            deviceCommandMap[deviceId] = new Set([obj.commandId]);
          else
            deviceCommandMap[deviceId].add(obj.commandId);
        })
      })

      return obj.data
    });

    //console.log('deviceCommandMap: ', deviceCommandMap);
    //console.log('commandDeviceMap: ', commandDeviceMap);


    return onSuccess(innerData);
  }
  catch(err){
   return onFailure(err);
  }

}

const fetchRoleData = async (profile: ProfileDataType) => {
    const softwareName = "CCC";
    const version = "1";
    const softwareId = await getSoftwareIdByNameVersion(softwareName, version);
    const roleData = await RoleMembershipInfo({
      userId: profile.USER_ID
    }) as RoleMembershipInfoType[];

    const currentRole = roleData ? roleData.filter(role => role.SOFTWARE_ID == softwareId) : [];

    if(currentRole.length){
      return currentRole[0].ROLE_NAME;
    }
    else{
      return '';
    }
  }

function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}


const applyCountAndColor = function(){
    const parentNodes = hierarchyAssoc.keys();
    let deviceIds = new Set<string>();
    let commandIds = new Set<string>();
    let statusColor = 'transparent';

    for(const parentNodeKey of parentNodes){
      const parent = initialNodes[parseInt(parentNodeKey)-1];
      //const pEdge = initialEdges[parseInt(parentNodeKey)-1];

      const childKeys = hierarchyAssoc.get(parentNodeKey);

      if (childKeys)
      for(const childKey of childKeys){
        const child = initialNodes[childKey-1];

        if(child==undefined || !child.data.isLeaf){
          break;
        }

        deviceIds =  union<string>(deviceIds, child.data.deviceIds);
        commandIds = union<string>(commandIds, child.data.commandIds);
        
        if(child.data.statusColor && child.data.statusColor != 'transparent'){
          if(statusColor != 'red'){
            statusColor = child.data.statusColor;
          }
        }
      }

      parent.data.deviceIds = new Set(deviceIds);
      parent.data.commandIds = new Set(commandIds);
      parent.data.deviceCount = deviceIds.size;
      parent.data.commandsCount = commandIds.size;

      if(parent.data.statusColor != 'red')
        parent.data.statusColor = statusColor;

      deviceIds.clear();
      commandIds.clear();
      statusColor = 'transparent';

      //hierarchyAssoc.delete(parentNodeKey);
    }

    const parentNodesz = hierarchyAssoc.keys();

    for(const parentNodeKey of parentNodesz){
      const parent = initialNodes[parseInt(parentNodeKey)-1];

      const childKeys = hierarchyAssoc.get(parentNodeKey);

      if (childKeys)
      for(const childKey of childKeys){
        const child = initialNodes[childKey-1];

        if(child == undefined || child.data.isLeaf || child.data.deviceCount == 0){
          break;
        }

        //console.log('child: ', child.data);

        deviceIds = union<string>(deviceIds, child.data.deviceIds);
        commandIds = union<string>(commandIds, child.data.commandIds);

        if(child.data.statusColor && child.data.statusColor != 'transparent'){
          if(statusColor != 'red'){
            statusColor = child.data.statusColor;
          }
        }
      }

      if(parent.data.deviceIds && parent.data.deviceIds.size == 0){
        parent.data.deviceIds = new Set(deviceIds);
        parent.data.commandIds = new Set(commandIds);

        parent.data.deviceCount = deviceIds.size;
        parent.data.commandsCount = commandIds.size;

        if(parent.data.statusColor != 'red')
          parent.data.statusColor = statusColor;
      }

      deviceIds.clear();
      commandIds.clear();
      statusColor = 'transparent';
    }

    const parentNodesy = hierarchyAssoc.keys();
    
    for(const parentNodeKey of parentNodesy){
      const parent = initialNodes[parseInt(parentNodeKey)-1];

      const childKeys = hierarchyAssoc.get(parentNodeKey);

      if (childKeys)
      for(const childKey of childKeys){
        const child = initialNodes[childKey-1];

        if(child == undefined || child.data.dlvl != 'dl1'){
          break;
        }

        deviceIds = union<string>(deviceIds, child.data.deviceIds);
        commandIds = union<string>(commandIds, child.data.commandIds);

        if(child.data.statusColor && child.data.statusColor != 'transparent'){
          if(statusColor != 'red'){
            statusColor = child.data.statusColor;
          }
        }
      }

      if(parent.data.deviceIds && parent.data.deviceIds.size == 0){
        parent.data.deviceIds = new Set(deviceIds);
        parent.data.commandIds = new Set(commandIds);

        parent.data.deviceCount = deviceIds.size;
        parent.data.commandsCount = commandIds.size;

        if(parent.data.statusColor != 'red')
          parent.data.statusColor = statusColor;
      }

      deviceIds.clear();
      commandIds.clear();
      statusColor = 'transparent';
    }

    const rootNode = initialNodes[0];
    const deviceNode = initialNodes[1];
    const commandNode = initialNodes[2];

    rootNode.data.deviceIds = union<string>(deviceNode.data.deviceIds, commandNode.data.deviceIds);
    rootNode.data.commandIds = union<string>(deviceNode.data.commandIds, commandNode.data.commandIds);
    rootNode.data.deviceCount = rootNode.data.deviceIds.size; 
    rootNode.data.commandsCount = rootNode.data.commandIds.size;
    rootNode.data.statusColor = deviceNode.data.statusColor;
}

const generateDeviceViewNodes = function(
  dlevel: string,
  label: string, 
  source: string = '2', 
  deviceCount: number = 0, 
  commandsCount: number = 0, 
  isLeaf: boolean = false, 
  leafValues: {
    label:string; 
    executionStatus: string,
    deviceId: string,
    commandId: string
  }[]=[],
  statusColor: string = 'transparent'
){
  const nodeObj: Node = {
    id: (initialNodes.length+1).toString(),
    type: 'treeNode',
    position:{
      x: 0,
      y: 0
    },
    style: { backgroundColor: 'transparent', color: '#000' },
    data: {
      dlvl: dlevel,
      label: label,
      expanded: true,
      deviceCount: deviceCount,
      commandsCount: commandsCount,
      isLeaf: isLeaf,
      nodeViewType: 'device',
      source: source,
      statusColor: statusColor
    }
  }

  if(isLeaf){
    nodeObj.data['leafValues'] = leafValues.length > 0 ? leafValues : []

    nodeObj.data.commandIds = new Set(leafValues.map(obj=>obj.commandId));
    nodeObj.data.deviceIds = new Set(leafValues.map(obj=>obj.deviceId));
  }

  const edgeObj: Edge = {
    id: uuid(),
    source: source,
    target: nodeObj.id
  }

  if(nodeObj.data.statusColor == 'red'){
    edgeObj.style = {stroke: 'red'};
  }
  else if(nodeObj.data.statusColor == 'green'){
    edgeObj.style = {stroke: 'green'};
  }

  initialNodes.push(nodeObj);

  initialEdges.push(edgeObj);

  //deviceViewNodeType[label] = nodeObj.id

  deviceViewNodeType[label] = initialNodes.length.toString();

  if(!hierarchyAssoc.get(source)){
    hierarchyAssoc.set(source, [initialNodes.length])
  }
  else{
    const tm = hierarchyAssoc.get(source);

    if(tm){
      tm?.push(initialNodes.length)
      hierarchyAssoc.set(source, tm)
    }
  }

}

const generateCommandViewNodes = function(
  label: string, 
  source: string = '3', 
  deviceCount: number = 0, 
  commandsCount: number = 1,
  commandId?: string, 
  isLeaf: boolean = false,
  incompleteLeafNodes?: number[],
  deviceIds: string[] = []
){
  const nodeObj: Node = {
    id: (initialNodes.length+1).toString(),
    type: 'treeNode',
    position:{
      x: 0,
      y: 0
    },
    style: { backgroundColor: 'transparent', color: '#000' },
    data: {
      label: label,
      expanded: true,
      deviceCount: deviceCount,
      commandsCount: commandsCount,
      isLeaf: isLeaf,
      source: source,
      statusColor: 'transparent'
    }
  }

  if(isLeaf){
    nodeObj.data['leafValues'] = deviceIds.length > 0 ? deviceIds.map((deviceId, index)=>{
      if(commandId){
        try{
          const isScheduled = commandDeviceWiseScheduleDetails[commandId][deviceId] ? true : false;
          const scheduleId = commandDeviceWiseScheduleDetails[commandId][deviceId].scheduleId;
          const executionResult = scheduleIdWiseExecutionDetails[scheduleId].status;

          if(executionResult == 'failure'){
            nodeObj.data.statusColor = 'red';
          }
          else if(executionResult == 'success'){
            nodeObj.data.statusColor = 'green';
          }

          return {
            label: `item ${index}`,
            executionStatus: isScheduled ? (executionResult ? executionResult : 'waiting') : ('not scheduled'),
            deviceId: deviceId,
            commandId: commandId
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch(err){
          return {
            label: `item ${index}`,
            executionStatus: 'not scheduled',
            deviceId: deviceId,
            commandId: commandId
          }
        }
        
      }
      else{
        return {
          label: `item ${index}`,
          executionStatus: '',
          deviceId: deviceId,
          commandId: commandId
        }
      }
    }) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeObj.data.commandIds = new Set(nodeObj.data['leafValues'].map((obj: any)=>obj.commandId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeObj.data.deviceIds = new Set(nodeObj.data['leafValues'].map((obj: any)=>obj.deviceId));

  }

  const edgeObj: Edge = {
    id: uuid(),
    source: source,
    target: nodeObj.id
  }

  if(nodeObj.data.statusColor == 'red'){
    edgeObj.style = {stroke: 'red'};
  }
  else if(nodeObj.data.statusColor == 'green'){
    edgeObj.style = {stroke: 'green'};
  }

  incompleteLeafNodes?.push(initialNodes.length)

  initialNodes.push(nodeObj);

  initialEdges.push(edgeObj);

  deviceViewNodeType[label] = initialNodes.length.toString();

  if(!hierarchyAssoc.get(source)){
    hierarchyAssoc.set(source, [initialNodes.length])
  }
  else{
    const tm = hierarchyAssoc.get(source);
    if(tm){
      tm?.push(initialNodes.length)
      hierarchyAssoc.set(source, tm)
    }
  }

}


const generateCustomViewNodes = function(
  associatedTabId: string | undefined, 
  commandId: string,
  deviceIds: SelectedHostIp[],
  commandCount: number = 1,
  source: string = '4'
){
  const command = commandIdWiseDetails[commandId];

  const nodeObj: Node = {
    id: (initialNodes.length+1).toString(),
    type: 'treeNode',
    position:{
      x: 0,
      y: 0
    },
    style: { backgroundColor: 'transparent', color: '#000' },
    data: {
      label: command.commandName,
      expanded: true,
      deviceCount: deviceIds.length,
      commandsCount: commandCount,
      associatedTabId: associatedTabId,
      isLeaf: true,
      processInstanceId: associatedTabId ? processInstanceDeleteMap[associatedTabId] : '',
      source: source,
      deviceIds: new Set(),
      commandIds: new Set(),
      statusColor: 'transparent',
      nodeViewType: 'custom',
      leafValues : []
    }
  }

  const edgeObj: Edge = {
    id: uuid(),
    source: source,
    target: nodeObj.id
  }

  nodeObj.data.leafValues = deviceIds.map(({deviceId})=>{
    const device = deviceIdWiseDetails[deviceId];
    if(commandId){
      try{
        
        const isScheduled = commandDeviceWiseScheduleDetails[commandId][deviceId] ? true : false;
        const scheduleId = commandDeviceWiseScheduleDetails[commandId][deviceId].scheduleId;
        const executionResult = scheduleIdWiseExecutionDetails[scheduleId].status;

        if(executionResult == 'failure'){
          nodeObj.data.statusColor = 'red';
        }
        else if(executionResult == 'success'){
          nodeObj.data.statusColor = 'green';
        }

        return {
          label: device.hostIp,
          executionStatus: isScheduled ? (executionResult ? executionResult : 'waiting') : ('not scheduled'),
          deviceId: deviceId,
          commandId: commandId
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch(err){
        return {
          label: device.hostIp,
          executionStatus: 'not scheduled',
          deviceId: deviceId,
          commandId: commandId
        }
      }
      
    }
    else{
      return {
        label: device.hostIp,
        executionStatus: '',
        deviceId: deviceId,
        commandId: commandId
      }
    }
  })

  if(nodeObj.data.statusColor == 'red'){
    edgeObj.style = {stroke: 'red'};
  }
  else if(nodeObj.data.statusColor == 'green'){
    edgeObj.style = {stroke: 'green'};
  }

  if(commandId == 'd7c14487-6f43-4d1b-9016-7cb03f7e4b69'){
    console.log('commandId :', nodeObj)
  }

  initialNodes.push(nodeObj);

  initialEdges.push(edgeObj);

  if(!hierarchyAssoc.get(source)){
    hierarchyAssoc.set(source, [initialNodes.length])
  }
  else{
    const tm = hierarchyAssoc.get(source);
    if(tm){
      tm?.push(initialNodes.length)
      hierarchyAssoc.set(source, tm)
    }
  }
}

const procesCustomNodes = function(arr : UserCommandConfigType[]){
  //const commandIds = new Set();
  //const customCommandDeviceMap: {[key: string]: string}
  arr.forEach(obj=>{
    //if(!commandIds.has(obj.configuredItemListForTab[0].commandId)){
      //commandIds.add(obj.configuredItemListForTab[0].commandId)
      const configured  = obj.configuredItemListForTab;

      configured.forEach((obj2)=>{
        generateCustomViewNodes(obj.associatedTabId, obj2.commandId, obj2.selectedHostIps)
      })

      
    //}
  })
}

export default async function page() {
  const profileData = await getProfileData();

  currentRole = await fetchRoleData(profileData as ProfileDataType);

  const customCommandsData = await fetchCustomCommandsData();
  console.log('customCommandsData: ', customCommandsData);

  const commandsData = await fetchCommandData();
  //console.log('commandsData: ', commandsData);

  await fetchCommandSchedulingData();
  //console.log('commandSchedulingData: ', commandSchedulingData);

  await fetchCommandExecutionData();
  //console.log('commandExecutionData: ', commandExecutionData[0]);

  const deviceConfigData = await fetchConfigData();
  //console.log('deviceConfigData: ', deviceConfigData);

  procesCustomNodes(customCommandsData);

  //console.time('start')

  

  //console.timeEnd('start')

  //console.log('commandDeviceMap: ', commandDeviceMap);

  applyCountAndColor();

  return (
    <Main 
      commandIdWiseDetails={commandIdWiseDetails} 
      deviceIdWiseDetails={deviceIdWiseDetails} 
      commandsData={commandsData}
      deviceConfigData={deviceConfigData}
      customCommandsData={customCommandsData}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      currentRole={currentRole}
      processInstanceDeleteMap={processInstanceDeleteMap} 
    />
  )
}