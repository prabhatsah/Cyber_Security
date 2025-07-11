import { getTicket } from "@/ikon/utils/actions/auth";
import { subscribeToProcessEvents } from ".";
import pako from "pako";
import * as JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
export async function prefillWazuhForm(): Promise<[any, any]> {

    const ticket = await getTicket();
    let url = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=getMyInstancesV2&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;


    let requestBody = new URLSearchParams();
    requestBody.append('arguments',
        JSON.stringify(["Configuration Item","b8bbe5c9-ad0d-4874-b563-275a86e4b818",{"taskName":"View CI Activity"},null,null,null,["Data.deviceId","Data.hostIp","Data.hostName","Data.type","Data.os","Data.deviceCredentialID","Data.osType"],false]));




    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: requestBody.toString(),
    });

    if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        console.log(errorText);
        //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
        return [null, null];
    }



    let devices = await response.json();

    let url2 = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=probeManagementService&operation=getAllProbes&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;


    let requestBody2 = new URLSearchParams();
    requestBody2.append('arguments',
        JSON.stringify(["b8bbe5c9-ad0d-4874-b563-275a86e4b818"]));


    //deviceCredentialID

    let response2 = await fetch(url2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: requestBody2.toString(),
    });

    if (!response2.ok) {
        // Handle HTTP errors
        const errorText = await response2.text();
        console.log(errorText);
        //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
        return [null, null];
    }



    let probes:[any] = await response2.json();

    probes.map((probe: any) => {
        probe.probeId=probe["PROBE_ID"];
        probe.probeName=probe["PROBE_NAME"];
    });

    for (let device of devices) {
        let url2 = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=getMyInstancesV2&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;


        let requestBody2 = new URLSearchParams();
        requestBody2.append('arguments',
            JSON.stringify(["SSH Credential Directory","b8bbe5c9-ad0d-4874-b563-275a86e4b818",{"taskName":"View credential"},{"credentialId":`${device.deviceCredentialID}`},null,null,["Data"],false]));


        //deviceCredentialID

        let response2 = await fetch(url2, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: requestBody2.toString(),
        });

        if (!response2.ok) {
            // Handle HTTP errors
            const errorText = await response2.text();
            console.log(errorText);
            //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
            return [null, null];
        }



        device.credential = await response2.json();

        if (!device.credential) {

            let url3 = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=getMyInstancesV2&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;


            let requestBody3 = new URLSearchParams();
            requestBody2.append('arguments',
                JSON.stringify(["SSH Credential Directory","b8bbe5c9-ad0d-4874-b563-275a86e4b818",{"taskName":"View credential"},{"credentialId":`${device.deviceCredentialID}`},null,null,["Data"],false]));


            //deviceCredentialID

            let response3 = await fetch(url3, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: requestBody3.toString(),
            });

            if (!response3.ok) {
                // Handle HTTP errors
                const errorText = await response3.text();
                console.log(errorText);
                //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
                return [null, null];
            }

            device.credential = await response3.json();
        }


    }

    return [devices, probes];

}

export async function configureWazuhAgent(device: any, probeId: any) {

    const ticket = await getTicket();
    const url = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=startProcessWithSpecificTransitionV2&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;

    let requestBody = new URLSearchParams();
    if (device.osType == 'Ssh') {
        requestBody.append('arguments',
            `["f1afe61d-4e0d-4a86-a721-e60c6cbbbdfc","Start DRY Run",{"id":"2b18fbab-3546-466e-997a-259e600e5527","serviceScriptDetails":
            {
                "scriptName":"Install Wazuh agent Ubuntu","serviceId":"b68ad231-de54-4d15-aca9-4d79f1de0438",
                "script":"#!/bin/bash\\n\\nset -e\\n\\nresult=\\"\\"\\n\\n# Define the directory to add\\nfileToAdd=\\"wazuh-agent_4.11.0-1_amd64.deb\\"\\n\\nif [ -f \\"$fileToAdd\\" ]; then\\n   result=\\"File exists.\\"\\nelse\\n    #echo \\"File does not exist.\\"\\n    #echo \\"Directory does not exist: $fileToAdd. Downloading and extracting...\\"\\n    # Download the zip file\\n    wget -O wazuh-agent_4.11.0-1_amd64.deb \\"http://11:11/wazuh-agent_4.11.0-1_amd64.deb\\"\\n    \\n\\tsudo dpkg -i wazuh-agent_4.11.0-1_amd64.deb > 1.txt\\n\\t\\n\\t# Set your Wazuh manager IP and desired agent name\\n\\tmanagerIP=\\"11\\"  # Replace with your manager's IP address\\n\\tagentName=\\"11\\"    # Replace with your desired agent name\\n\\t\\n\\t# Define the configuration file path (adjust based on your installation)\\n\\t# On Linux, the OSSEC/Wazuh agent config file is typically at /var/ossec/etc/ossec.conf.\\n\\tconfigPath=\\"/var/ossec/etc/ossec.conf\\"\\n\\n\\t\\n\\n\\tsudo apt-get -qq install xmlstarlet > 1.txt\\n\\n\\t# Update the XML configuration using xmlstarlet.\\n\\t# Ensure xmlstarlet is installed (e.g., sudo apt-get install xmlstarlet)\\n\\t# This command updates the <address> element under /ossec_config/client/server/\\n\\txmlstarlet ed -L -u \\"/ossec_config/client/server/address\\" -v \\"$managerIP\\" \\"$configPath\\"\\n\\n\\t# Restart the Wazuh agent service\\n\\tsudo systemctl restart wazuh-agent\\n\\n\\t# Show the status of the Wazuh agent service\\n\\t#sudo systemctl status wazuh-agent\\n\\t\\n\\tresult=\\"Success\\"\\n\\t\\nfi\\n\\necho $result",
                "scriptType":"bash",
                "startRunMetricsType":"FinalSaveSubmit"
            },
            "deviceDetail":${JSON.stringify(device)},
            "probeId":"${probeId}"},"id"]`);
    }
    else {
        requestBody.append('arguments',
            `["f1afe61d-4e0d-4a86-a721-e60c6cbbbdfc","Start DRY Run",
            {"id":"9e8b68c8-1032-48b6-a967-c9bdd2cfd1b0","serviceScriptDetails":
            {"scriptName":"Install Wazuh Agent Windows","serviceId":"0856d25a-7427-438b-a0ea-985f6887df0b",
            "script":"# Define the directory to add\\n$dirToAdd = \\"wazuh-agent.msi\\"\\n\\n\\n# Check if the directory exists\\nif (Test-Path $dirToAdd) {\\n    Write-Host \\"Directory exists: $dirToAdd\\"\\n}\\nelse {\\n    $msiUrl = \\"https://packages.wazuh.com/4.x/windows/wazuh-agent-4.11.0-1.msi\\"  \\n\\t$msiPath = \\"wazuh-agent.msi\\"\\n\\n\\t# Download the installer\\n\\tInvoke-WebRequest -Uri $msiUrl -OutFile $msiPath\\n\\n\\t# Set your Wazuh manager IP and desired agent name\\n\\t$managerIP = \\"11\\"  # Replace with your manager\'s IP address\\n\\t$agentName = \\"11\\"        # Replace with your desired agent name\\n\\n\\t# Run the installer in silent mode\\n\\tStart-Process -FilePath \\"msiexec.exe\\" -ArgumentList \\"/i \`\\"$msiPath\`\\" /qn WAZUH_MANAGER=$managerIP AGENT_NAME=$agentName\\" -Wait\\n\\n\\n\\t# Define the configuration file path (adjust based on your installation)\\n\\t$configPath = \\"C:\\\\Program Files (x86)\\\\ossec-agent\\\\ossec.conf\\"\\n\\n\\tif (Test-Path $configPath) {\\n\\t\\t#Write-Host \\"Directory exists: $configPath\\"\\n\\t}\\n\\telse {\\n\\t\\t#Write-Host \\"Directory does not exist: $configPath. Downloading and extracting...\\"\\n\\t\\t$configPath = \\"C:\\\\Program Files\\\\ossec-agent\\\\ossec.conf\\"\\n\\t}\\n\\n\\t# Load the XML configuration\\n\\t[xml]$xmlConfig = Get-Content $configPath\\n\\n\\t# Update the server address\\n\\t$xmlConfig.ossec_config.client.server.address = $managerIP\\n\\n\\t# Save the updated configuration\\n\\t$xmlConfig.Save($configPath)\\n\\n\\n\\tStart-Service -Name \\"WazuhSvc\\"\\n\\t\\t\\t\\t\\t\\n\\tWrite-Host \\"Success\\"\\n}","scriptType":"powershell","startRunMetricsType":"FinalSaveSubmit"},
            "deviceDetail":${JSON.stringify(device)},"probeId":"${probeId}"},"id"]`);
    }





    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: requestBody.toString(),
    });

    if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        console.log(errorText);
        //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
        return;
    }



    let parsedData = await response.json();

    return parsedData;
}


export async function callWazuhApi() {

    const ticket = await getTicket();
    const url = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=startProcessWithSpecificTransitionV2&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;

    let requestBody = new URLSearchParams();
    requestBody.append('arguments',
            `["f1afe61d-4e0d-4a86-a721-e60c6cbbbdfc","Start DRY Run",{"serviceScriptDetails":
            {
                "scriptType":"Wazuh Api Call"
            },"probeId":"efd16dc0-4790-48f6-8675-8bdcebee7ffd"},"id"]`);
   





    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: requestBody.toString(),
    });

    if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        console.log(errorText);
        //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
        return;
    }



    let parsedData = await response.json();

    return parsedData;
}


export async function getWazuhData(callback: any) {
    // for deos in dev
    // let accountId = '56b5c266-6a0f-437a-82b9-3715bb6f3d4c';
    const ticket = await getTicket();
    const url = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=mapProcessName&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;

    let requestBody = new URLSearchParams();
    requestBody.append('arguments',
            `["Device Service Dry Run","b8bbe5c9-ad0d-4874-b563-275a86e4b818"]`);
    





    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: requestBody.toString(),
    });

    if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        console.log(response);
        //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
        return;
    }

    let processId = await response.json();
    
    console.log(processId);

    let url2 = `https://ikoncloud-dev.keross.com/rest?inZip=false&outZip=true&inFormat=freejson&outFormat=freejson&service=processRuntimeService&operation=getMyInstancesV2&locale=null&activeAccountId=b8bbe5c9-ad0d-4874-b563-275a86e4b818&softwareId=abda94ad-1e44-4e7d-bb86-726d10df2bee&ticket=${ticket}`;


    let requestBody2 = new URLSearchParams();
    requestBody2.append('arguments',
        JSON.stringify(["Device Service Dry Run","b8bbe5c9-ad0d-4874-b563-275a86e4b818",null,null,null,null,["Data"],false]));






    const response2 = await fetch(url2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: requestBody2.toString(),
    });

    if (!response2.ok) {
        // Handle HTTP errors
        const errorText = await response2.text();
        console.log(response2);
        //handleFetchError(response, errorText, failureFunction, ikonErrorCode);
        return;
    }

    let instances = await response2.json();
    
    
  //  console.log(instance);
    const processInstanceId = instances[0].processInstanceId;
    const socket = await subscribeToProcessEvents({
      processId:processId,
      //processInstanceId: null,
      viewComponentId: "componenetId",
      eventCallbackFunction: (event: any) => {
        callback(event);
        
        console.log(event.data);
      },
    });
    return socket;
    
  }

