import { forwardRef, useEffect, useRef, useState } from "react"
import CredView from "../components/credView"
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"
import NoDataComponent from "@/ikon/components/no-data"
import { LoadingSpinner } from "@/ikon/components/loading-spinner"
import { CredentialType } from '../type'
import { IconButtonWithTooltip } from "@/ikon/components/buttons"
import { PlusIcon } from "lucide-react"
import {  useGlobalCred } from "../actions/context/credContext";
import WindowsCredentialView from "../components/WindowsCredentialView"
import SSHCredentialView from "../components/SSHCredentialView"
import SNMPCredentialView from "../components/SNMPCredentialView"
import ParameterCredentialView from "../components/parameterCredentialView"
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software"




type CredComponentProps={
    type: CredentialType,
    ref: React.RefObject<null>;
}

const CredComponent = forwardRef<HTMLButtonElement, CredComponentProps>(({type},ref)=> {
    //const [CredData, setCredData] = useState<any[]>([])
    const [dataFetched, setDataFetched] = useState(false)
    const [toggleState,setToggleState] = useState(false)

    const {globalCredData,setGlobalCredData,updatedCreds,setUpdatedCreds} = useGlobalCred()

    // console.log('---global Credential data---')
    // console.log(globalCredData)

    const isMounted = useRef(false);
    

    const TypeWiseCredentialStorage = {
        'Windows': 'Windows Credential Directory',
        'SNMP': 'SNMP Community Credential Directory',
        'SSH': 'SSH Credential Directory',
        'Parameter': 'Api Credential Directory'
    }

    useEffect(() => {
    const fetchData = async () => {
        // Only fetch if data is not already present
        if (!globalCredData[type].length) {
            try {
                const softwareId = await getSoftwareIdByNameVersion("ITSM", "1");
                const res = await getMyInstancesV2({
                    softwareId,
                    processName: TypeWiseCredentialStorage[type],
                    predefinedFilters: { taskName: "View credential" }
                });
                setDataFetched(true);
                const updatedData = {
                    ...globalCredData,
                    [type]: res.map(e => ({
                        ...e.data,
                        taskId: e.taskId,
                        viewOnly: true
                    }))
                };
                setGlobalCredData(updatedData);
            } catch (e) {
                console.log(e);
                setDataFetched(true);
            }
        } else {
            setDataFetched(true);
        }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    useEffect(()=>{
        debugger
        if (toggleState) {
            const currentData = globalCredData[type] //getting current credential data

            //updating credential data according to type

            if(type==='Windows'){
                currentData.push({
                    credentialId:new Date().getTime().toString(),
                    credentialType:'Windows',
                    credentialName:null ,
                    userName:null ,
                    password:null ,
                    clientAccess:[],
                    new:true
                })
            }
            else if(type==='Parameter'){
                currentData.push({
                    credentialId:new Date().getTime().toString(),
                    credentialType:'Apicred',
                    credentialName:null ,
                    clientAccess:[],
                    ApiCredProperties:[{uniqueIdForInput:new Date().getTime(),key:null,value:null,selectValueType:null}],
                    new:true
                })
            }

            else if(type==='SNMP'){
                currentData.push({
                    credentialId:new Date().getTime().toString(),
                    credentialType:'snmp',
                    port: null,
                    version:null ,
                    communityString:null ,
                    new:true,
                    clientAccess:[],
                    
                })
            }

            else if(type='SSH'){
                currentData.push({
                    credentialId:new Date().getTime().toString(),
                    credentialType:"Ssh",
                    port:null,
                    userName:null,
                    password:null,
                    new:true,
                    clientAccess:[],
                })
            }
            //setting toggle state
            setToggleState(false)
            //setting updated data
            

            const newCredData = { ...globalCredData, [type]: currentData };
            setGlobalCredData(newCredData) 
        }
        //end

        

    },[toggleState])

    debugger

    return (
        <>
            <>
                <div className="flex justify-end mb-2">
                    <IconButtonWithTooltip tooltipContent={`Add ${type} credential`} type="button" onClick={() => {
                        const newUpdatedCreds = !updatedCreds.includes(type)?[...updatedCreds,type]:updatedCreds
                        setUpdatedCreds(newUpdatedCreds)
                        setToggleState(true)
                    }}>
                        <PlusIcon />
                    </IconButtonWithTooltip>
                </div>
                <div className="h-[640px] overflow-y-auto">

                    {
                        dataFetched ? globalCredData[type].length > 0 ? type==='Windows' ?   <WindowsCredentialView credentialData={globalCredData[type]} ref={ref}/> : type=="SSH" ? <SSHCredentialView credentialData={globalCredData[type]} ref={ref}/> : type==='SNMP'? <SNMPCredentialView credentialData={globalCredData[type]} ref={ref}/> : <ParameterCredentialView credentialData={globalCredData[type]} ref={ref}/> :  <NoDataComponent /> : <LoadingSpinner />
                    }
                </div>
            </>
        </>


    )
})
export default CredComponent