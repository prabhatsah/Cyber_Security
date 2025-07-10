import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { ChangeEvent, Dispatch, FC, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Add3DModelProps } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { z } from "zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/ikon/components/form-fields/input";
import { Input } from "@/shadcn/ui/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Axis3D, ImagePlus, LoaderCircle, Plus, Trash } from "lucide-react";
import { Label } from "@/shadcn/ui/label";
import { getTicket } from "@/ikon/utils/actions/auth";
//import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { v4 } from "uuid";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { SubscribedSoftwareNameMaps } from "../../../sales-crm/deal/details/[id]/(details)/components/won-form/components/getDealData";

const formSchema = z.object({
    modelName: z.string(),
    modelDescription: z.string(),
    cameraX: z.number(),
    cameraY: z.number(),
    cameraZ: z.number(),
    uploadedModelFile: z
        .custom<FileList>((val) => val instanceof FileList && val.length > 0, "File is required") // Ensures file is selected
        .refine((files) => files[0]?.size < 5 * 1024 * 1024, "File must be smaller than 5MB") // File size check
        .refine(
            (files) => files[0]?.type === "model/gltf-binary",
            "Only GLB files (.glb) are allowed"
        ),
    modelPosterUpload: z
        .custom<FileList>((val) => val instanceof FileList && val.length > 0, "File is required") // Ensures file is selected
        .refine((files) => files[0]?.size < 5 * 1024 * 1024, "File must be smaller than 5MB") // File size check
        .refine(
            (files) => ["image/png", "image/jpeg", "image/jpg"].includes(files[0]?.type),
            "Only image files (.png, .jpg, .jpeg) are allowed"
        ),

    // positionX: z.number(),
    // positionY: z.number(),
    // positionZ: z.number(),
    // normalX: z.number(),
    // normalY: z.number(),
    // normalZ: z.number(),
    // annotationLabel: z.string(),

    // preference: z.string(),
    // commandDrpDown: z.string(),
    // serviceDrpDown: z.string()

    annotationFields: z.array(
        z.object({
            positionX: z.number(),
            positionY: z.number(),
            positionZ: z.number(),
            normalX: z.number(),
            normalY: z.number(),
            normalZ: z.number(),
            annotationLabel: z.string(),
            preference: z.string(),
            commandDrpDown: z.string(),
            serviceDrpDown: z.string()
        })
      ),
});

type LoaderHtmlParamsType = {
    modelName: string;
    modelFilePath: string | ArrayBuffer;
    modelPosterPath: string;
    annotations: AnnotationType[]
}

type AnnotationType = {
    index: number;
    position: number;
    orbit: number;
    normal: number;
    label: string;
}

type EditorsType = {
    [key: string] : object
}

type ServiceDataType = {
    serviceId: string;
    monitoringProtocol: string;
    metricsName: string;
}


const ref_annotationsIds: string[] = [];
let ref_localModelFile: string | ArrayBuffer | null | undefined;
let ref_modelName: string | undefined;
let ref_viewerLoaded: boolean;
let ref_modelAnnotationInfo: unknown; 
//let ref_modelFileData: 

const handleFileUpload = (
        e: ChangeEvent<HTMLInputElement>, 
        ticket: string | undefined, 
        modelViewerContainer: RefObject<HTMLDivElement | null>
    ) => {
    console.log('handleFileUpload: ', e.target.files)
    
    if (e.target.files) {
        const filePath = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('reader.onload : ', e.target?.result);
            ref_localModelFile = e.target?.result;
            console.log("ref_localModelFile: ", ref_localModelFile);

            if(ticket)
                loadViewer(ticket, modelViewerContainer);
        };

        reader.readAsDataURL(filePath);
    }
}

const loaderHtml = (params: LoaderHtmlParamsType) => {
    let resultStr = `
        <model-viewer
            className="h-full w-full"
            style="height: 100%; width: 100%" 
            alt="${params.modelName}" 
            src="${params.modelFilePath}" 
            ar 
            poster="${params.modelPosterPath}" 
            shadow-intensity="1" 
            camera-controls touch-action="pan-y"
            class="viewer-component"
            id="viewerComponent"
        >`;


    params.annotations.forEach((obj)=>{
        resultStr += `<div 
                class="Hotspot annotation-item" 
                slot="hotspot-${obj.index}" 
                data-position="${obj.position}" 
                data-normal="${obj.normal}"
                data-orbit="${obj.orbit}" 
                data-target="${obj.position}"
                data-visibility-attribute="visible"
                id="hotspotAnnotationItem-${obj.index}"
            >
                <div class="HotspotAnnotation">
                    <span>${obj.label}</span>
                    <div id="annotaionHtmlContainer-${obj.index}" class="d-none position-relative">
                    </div>
                </div> 	
            </div>`;
    })

    resultStr += '</model-viewer>';


    return resultStr;
}

const loadViewer = function(ticket: string, modelViewerContainer: RefObject<HTMLDivElement | null>){
    let modelName, modelFilePath, modelPosterPath, annotations;

    const params: LoaderHtmlParamsType = {
        modelName: '',
        modelPosterPath: '',
        modelFilePath: '',
        annotations: []
    };
    
    if(ref_modelName){
        modelName = ref_modelName;
    }
    else{
        modelName = (document.getElementById('modelName') as HTMLInputElement )?.value;

        if(!modelName || modelName.length == 0){
            modelName = 'untitled_model'
        }
    }

    params.modelName = modelName;
    
    if(ref_localModelFile){
        modelFilePath = ref_localModelFile;
        params.modelFilePath = modelFilePath;
    }
    //else if(ref_modelFileData){
        //const {modelGLBFileInfo, modelPosterFileInfo} = ref_modelFileData;
        //modelFilePath = `${DOWNLOAD_URL}?ticket=${ticket}&resourceId=${modelGLBFileInfo.resourceId}&resourceName=${modelGLBFileInfo.resourceName}&ts=${new Date().getTime()}`;
        //modelPosterPath = `${DOWNLOAD_URL}?ticket=${ticket}&resourceId=${modelPosterFileInfo.resourceId}&resourceName=${modelPosterFileInfo.resourceName}&resourceType=${modelPosterFileInfo.resourceType}&ts=${new Date().getTime()}`;
    //}
    //else {
        //bootstrapModalAlert({title:'Can not visualize the model as no model file available in instance or uploaded',text:'No Model Data',icon:"error"});
        //return;
    //}
    
    // if(ref.modelAnnotationInfo.length){
    //     annotations = ref.modelAnnotationInfo.map(e=>{
    //         return {
    //             'label':e.label,
    //             'position':`${e.position.x}m ${e.position.y}m ${e.position.z}m`,
    //             'normal':`${e.normal.x}m ${e.normal.y}m ${e.normal.z}m`,
    //             'orbit' : `${e.orbit.y}rad ${e.orbit.x}rad ${e.orbit.z}m`,
    //             'annotationFrag': (e.fragmentHtml)? e.fragmentHtml : ''
    //         }
    //     })
    // }
    // else{
    //     annotations = [];
    // }

    
    
    //const _template = Handlebars.compile(ref.handlebarfragmentMap['viewer-elem']);
    //const _html = _template({modelName,modelFilePath,modelPosterPath,annotations});

    params.annotations = [];
    
    loadViewerScript(()=>{
        ref_viewerLoaded = true;
        //$("#modelViewerContainer").html(_html);

        //const ele = document.getElementById("modelViewerContainer");

        if(modelViewerContainer.current){    
            modelViewerContainer.current.innerHTML = loaderHtml(params)

            //ele.innerHTML = 
        }        
    })
}

//@ts-expect-error : ignore
const loadViewerScript =  function(callback){
    if(!ref_viewerLoaded){
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
        script.onload = callback;
        document.body.appendChild(script);
    }
    else{
        callback();
    }
}

const setInitialCameraPosition = function(){
    
    const viewer = document.getElementById('viewerComponent');

    if(viewer){
        // @ts-expect-error: ignore
        const _orbit = viewer.getCameraOrbit()

        const cameraX = document.getElementById('cameraX') as HTMLInputElement;
        const cameraY = document.getElementById('cameraY') as HTMLInputElement;
        const cameraZ = document.getElementById('cameraZ') as HTMLInputElement;


        if(cameraX){
            cameraX.value = _orbit.theta;
        }

        if(cameraY){
            cameraY.value = _orbit.phi;
        }

        if(cameraZ){
            cameraZ.value = _orbit.radius;
        }
    }
}

const takeModelPoster = function(){
    const viewer = document.getElementById('viewerComponent');
    
    // @ts-expect-error : ignore
    const posterImageData = viewer.toDataURL("image/png");
    setFileInput(posterImageData,"modelPosterUpload");
}

const setFileInput = function(base64String: string, fileInputElementId: string, filename = 'image.png'){
	const file = base64ToFile(base64String, filename);
	const dataTransfer = new DataTransfer();
	dataTransfer.items.add(file);
	const fileInputElement = document.getElementById(fileInputElementId);
    // @ts-expect-error : ignore
	fileInputElement.files = dataTransfer.files;
}

const base64ToFile = function(base64: string, filename: string){
	const contentType = base64.split(',')[0].split(':')[1].split(';')[0];
	const blob = base64ToBlob(base64, contentType);
	
    return new File([blob], filename, { type: contentType });
}

const base64ToBlob = function(base64: string, contentType = ''){
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

const refreshViewer = function(
    ticket: string, 
    modelViewerContainer: RefObject<HTMLDivElement | null>,
    setShowAlert: Dispatch<SetStateAction<boolean>>, 
    setAlertMsg: Dispatch<SetStateAction<string>>,
    serviceData: ServiceDataType[], 
    editors: EditorsType
){
	let viewer = document.getElementById('viewerComponent');
		
	if(!viewer){
		//bootstrapModalAlert({title:"No model available or uplaoded",text:"Model data not found",icon:"error"});
        customeAlert('No model available or uplaoded', setShowAlert, setAlertMsg);
	}
		
    // @ts-expect-error : ignore
	const currentCameraTarget = viewer.getCameraTarget().toString();
    // @ts-expect-error : ignore
	const currentCameraOrbit = viewer.getCameraOrbit().toString();
		
	ref_modelName = (document.getElementById('modelNameInpt') as HTMLInputElement).value
	ref_modelAnnotationInfo = extractDataFromAnnotations(serviceData, editors);

	loadViewer(ticket, modelViewerContainer);
		
	viewer = document.getElementById('viewerComponent');
    // @ts-expect-error : ignore
	viewer.cameraTarget = currentCameraTarget;
    // @ts-expect-error : ignore
	viewer.cameraOrbit = currentCameraOrbit;
}

const extractDataFromAnnotations = function(serviceData: ServiceDataType[], editors: EditorsType){
 	const annotationData = [];
    for (let index=0, len = ref_annotationsIds.length; index < len; index++){
        
        const annotationId = ref_annotationsIds[index];

        const preferenceDrp = (document.getElementById(`#preferenceDrp-${annotationId}`) as HTMLInputElement)?.value;
        const prefferedServiceId = (document.getElementById(`#serviceDrpDown-${annotationId}`) as HTMLSelectElement)?.value;
        const prefferedCommandId = (document.getElementById(`#commandDrpDown-${annotationId}`) as HTMLSelectElement)?.value;
        const service = serviceData.filter((e: { serviceId: string; }) => e.serviceId == prefferedServiceId)[0]

        
        annotationData.push({
            'label': (document.getElementById(`#annotationLabel-${annotationId}`) as HTMLInputElement)?.value,
            'position': {
                'x':  (document.getElementById(`#annotationPosX-${annotationId}`) as HTMLInputElement)?.value,
                'y':  (document.getElementById(`#annotationPosY-${annotationId}`) as HTMLInputElement)?.value,
                'z':  (document.getElementById(`#annotationPosZ-${annotationId}`) as HTMLInputElement)?.value,
            },
            'normal': {
                'x': (document.getElementById(`#annotationNormalX-${annotationId}`) as HTMLInputElement)?.value,
                'y': (document.getElementById(`#annotationNormalY-${annotationId}`) as HTMLInputElement)?.value,
                'z': (document.getElementById(`#annotationNormalZ-${annotationId}`) as HTMLInputElement)?.value,
            },
            'orbit': {
                'x': (document.getElementById(`#annotationOrbitX-${annotationId}`) as HTMLInputElement)?.value,
                'y': (document.getElementById(`#annotationOrbitY-${annotationId}`) as HTMLInputElement)?.value,
                'z': (document.getElementById(`#annotationOrbitZ-${annotationId}`) as HTMLInputElement)?.value,
            },
            'additionalClass' : (document.getElementById(`#annotationAdditionalClass-${annotationId}`) as HTMLInputElement)?.value,
            // @ts-expect-error : ignore
            'fragmentHtml': editors[annotationId].getValue(),
            'annotationId': annotationId,
            'annotationPreference': preferenceDrp == "itsmServices" ? {
                prefferedServiceId :  prefferedServiceId,
                prefferedServiceName : prefferedServiceId ? service.metricsName : '',
                prefferedProtocol : prefferedServiceId ? service.monitoringProtocol:'',
            } : {
                prefferedCommandId: prefferedCommandId
            }
        })
    }
    
    return annotationData;
}

const addMouseClickListenerToViewer = function(
    ticket: string, 
    modelViewerContainer: RefObject<HTMLDivElement | null>,
    setShowAlert: Dispatch<SetStateAction<boolean>>, 
    setAlertMsg: Dispatch<SetStateAction<string>>, 
    serviceData: ServiceDataType[], 
    editors: EditorsType,
    append: any
){    
    const viewer = document.getElementById('viewerComponent');
    const clickHandlerCallback = (event: { clientX: unknown; clientY: unknown; }) => {

        // Get the hit point on the model
        //@ts-expect-error : ignore
        const hit = viewer.positionAndNormalFromPoint(event.clientX, event.clientY);

        if (hit) {
            const { position, normal } = hit;
            //@ts-expect-error : ignore
            const _orbit = viewer.getCameraOrbit()
            const orbit = {
                'x': _orbit.theta,
                'y': _orbit.phi,
                'z': _orbit.radius
            }
            const label = `hotspot-${ref_annotationsIds.length}`;
            
            const annotationId = addAdditionalAnnotationInpt(undefined, undefined, append);

            return;

            ref_setAnnotationInfoValues(annotationId,{position,normal,orbit,label}); 

            refreshViewer(ticket, modelViewerContainer, setShowAlert, setAlertMsg, serviceData, editors);
            //@ts-expect-error : ignore
            viewer.removeEventListener('click',clickHandlerCallback);

        } else {
            console.log('No hit detected');
        }
    }
    
    //@ts-expect-error : ignore
    viewer.addEventListener('click', clickHandlerCallback);
    //bootstrapModalAlert({text:'click on the model to set a new annotation the camera position will also be captured and loaded during view',title:"click to create new annotation",icon:'info'})
    alert('click model to create new annotation');
}



// const annotationsHTML = function(annotationId: string){
//     const html = `
    
//         <div class="mt-2 mb-2" id="annotationInptsContainer-${annotationId}">
//             <div class="">
//                 <div class="">
//                     <h3>Annotation</h3>
//                 </div>
//                 <div class="text-right flex justify-end">
//                     <div>
//                         <!--
//                             <a class="btn btn-outline-info" onclick="repositionAnnotationWithId('${annotationId}')">
//                             </a>
//                         -->
//                         <TextButtonWithTooltip onclick="deleteAnnotationWithConfirmation('${annotationId}')"  tooltipContent="Delete annotation">
//                             <Trash />
//                         </TextButtonWithTooltip>
//                     </div>
                    
//                 </div>
//             </div>
//             <div class="mt-1">
//                 <div class="">

//                     <Input type="text" class="form-control" id="annotationLabel-${annotationId}" value="{{#if currentAnnotationData}}{{currentAnnotationData.label}}{{else}}{{initialValues.label}}{{/if}}">
//                     <Label htmlFor="annotationLabel-${annotationId}" class="control-label">Annotation Label</Label>

//                 </div>
//             </div>
//             <div class="  mt-1">
//                 <div class="   pe-0">

//                     <Input type="number" id="annotationPosX-${annotationId}" class="form-control" value="{{#if currentAnnotationData}}{{currentAnnotationData.position.x}}{{else}}{{initialValues.position.x}}{{/if}}">
//                     <Label htmlFor="annotationPosX-${annotationId}" class="control-label">Position X</Label>

//                 </div>
//                 <div class="   pe-0">

//                     <Input type="number" id="annotationPosY-${annotationId}" class="form-control" value="{{#if currentAnnotationData}}{{currentAnnotationData.position.z}}{{else}}{{initialValues.position.y}}{{/if}}">
//                     <Label htmlFor="annotationPosY-${annotationId}" class="control-label">Position Y</Label>

//                 </div>
//                 <div class="  ">

//                     <Input type="number" id="annotationPosZ-${annotationId}" class="form-control" value="{{#if currentAnnotationData}}{{currentAnnotationData.position.z}}{{else}}{{initialValues.position.z}}{{/if}}">
//                     <Label htmlFor="annotationPosZ-${annotationId}" class="control-label">Position Z</Label>

//                 </div>
//             </div>
//             <div class="  mt-1">
//                 <div class="   pe-0">

//                     <Input type="number" id="annotationNormalX-${annotationId}" class="form-control" value="{{#if currentAnnotationData}}{{currentAnnotationData.normal.x}}{{else}}{{initialValues.normal.x}}{{/if}}">
//                     <Label htmlFor="annotationNormalX-${annotationId}" class="control-label">Normal X</Label>

//                 </div>
//                 <div class="   pe-0">
                    
//                     <Input type="number" id="annotationNormalY-${annotationId}" class="form-control" value="{{#if currentAnnotationData}}{{currentAnnotationData.normal.y}}{{else}}{{initialValues.normal.y}}{{/if}}">
//                     <Label htmlFor="annotationNormalY-${annotationId}" class="control-label">Normal Y</Label>

//                 </div>
//                 <div class="  ">
                   
//                     <Input type="number" id="annotationNormalZ-${annotationId}" class="form-control" value="{{#if currentAnnotationData}}{{currentAnnotationData.normal.z}}{{else}}{{initialValues.normal.z}}{{/if}}">
//                     <Label htmlFor="annotationNormalZ-${annotationId}" class="control-label">Normal Z</Label>
                     
//                 </div>
//             </div>
//             <!-- Additional rows (Orbit, Services, Commands, etc.) follow the same pattern -->
//             <div class="  mt-2">
//                 <div class="   pe-0">
                    
//                     <select class="form-select" id="preferenceDrp-${annotationId}">
//                         <option value="-1" selected="" disabled="">Select Preference</option>
//                         <option value="itsmServices">Services</option>
//                         <option value="cccCommands">Commands</option>
                        
//                     </select>
//                     <Label htmlFor="preferenceDrp-${annotationId}" class="form-label">Select preference<b class="text-danger">&nbsp;*</b></Label>
                        
//                 </div>
//                 <div class="   d-none" id="serviceDrpContainer-${annotationId}">
                    
//                     <select class="form-select" id="serviceDrpDown-${annotationId}">
//                         <option value="-1" selected disabled>Select Services</option>
                        
//                     </select>
//                     <Label htmlFor="serviceDrpDown-${annotationId}" class="form-label">Services<b class="text-danger">&nbsp;*</b></Label>
                        
//                 </div>
//                 <div class="   d-none" id="commandDrpContainer-${annotationId}">
                    
//                     <select class="form-select" id="commandDrpDown-${annotationId}">
//                         <option value="-1" selected="" disabled="">Select Commands</option>
                        
//                     </select>
//                     <Label htmlFor="commandDrpDown-${annotationId}" class="form-label">Commands<b class="text-danger">&nbsp;*</b></Label>
                        
//                 </div>
//             </div>
//             <div class="  d-none" id="annotaionFragContainer-${annotationId}">
//                 <div class="  ">
//                     <Label htmlFor="annotationFragEditor-${annotationId}" class="control-label">Annotation Fragment</Label>
//                     <textarea id="annotationFragEditor-${annotationId}" name="code">
                        
//                     </textarea>
//                 </div>
//             </div>
//         </div>

    
//     `;

//     return html;
// }

const addAdditionalAnnotationInpt = function(annotationId: string | undefined, annotationData: AnnotationType | undefined, append: any){
    if(!annotationId){
        annotationId = v4();
    }
    
    ////const _template = Handlebars.compile(ref.handlebarfragmentMap["singuler-annotation-inpt"]);
    ////const _html = _template({'annotationId': annotationId, 'ref': ref , 'currentAnnotationData':annotationData});

    ////const html = annotationsHTML(annotationId)

    ////document.getElementById('modelAnnotationsContainer')?.append(html)

    append(
        { 
            positionX: 0.0, 
            positionY: 0.0,
            positionZ: 0.0,
            normalX: 0.0,
            normalY: 0.0,
            normalZ: 0.0,
            annotationLabel: 'Hotspot-'+ref_annotationsIds.length,
            preference: '',
            commandDrpDown: '',
            serviceDrpDown: '' 
        }
    )
    
    
    //setupEditorByDivId(annotationId);
    ref_annotationsIds.push(annotationId);
    
    setupPreferenceDropdown(annotationId)
    
    // Promise.all([ref.getServiceDataAndPopulateDropdown(annotationId),ref.getCommandsDataAndPopulateDropdown(annotationId)]).then(()=>{
    //     if(annotationData){
    //         if(annotationData.annotationPreference.prefferedServiceId){
    //             $(`#preferenceDrp-${annotationId}`).val('itsmServices').trigger('change')
    //             console.log("service dropdown value set :: " +annotationData.annotationId)
    //             $(`#serviceDrpDown-${annotationData.annotationId}`).val(annotationData.annotationPreference.prefferedServiceId)
    //         }

    //         else{
    //             //console.log("command dropdown value set :: "+eachAnnotation.annotationId)
    //             $(`#preferenceDrp-${annotationId}`).val('cccCommands').trigger('change')
    //             $(`#commandDrpDown-${annotationData.annotationId}`).val(annotationData.annotationPreference.prefferedCommandId) 
    //         }
    //     }
    // })

    return annotationId;
}

// const setAnnotationInfoValues = function(annotationId,annotationInfo){ 
    
//     $($(`#annotationLabel-${annotationId}`)).val(annotationInfo.label)

//     $($(`#annotationPosX-${annotationId}`)).val(annotationInfo.position.x)
//     $($(`#annotationPosY-${annotationId}`)).val(annotationInfo.position.y)
//     $($(`#annotationPosZ-${annotationId}`)).val(annotationInfo.position.z)

//     $($(`#annotationNormalX-${annotationId}`)).val(annotationInfo.position.x)
//     $($(`#annotationNormalY-${annotationId}`)).val(annotationInfo.position.y)
//     $($(`#annotationNormalZ-${annotationId}`)).val(annotationInfo.position.z)

//     $($(`#annotationOrbitX-${annotationId}`)).val(annotationInfo.orbit.x)
//     $($(`#annotationOrbitY-${annotationId}`)).val(annotationInfo.orbit.y)
//     $($(`#annotationOrbitZ-${annotationId}`)).val(annotationInfo.orbit.z)

//     $($(`#annotationAdditionalClass-${annotationId}`)).val(annotationInfo.additionalClass);
    
//     ref.editors[annotationId].setValue(annotationInfo.fragmentHtml ? annotationInfo.fragmentHtml : '');
//     ref.editors[annotationId].refresh();
// }

const setupPreferenceDropdown = function (annotationId: string){
    //const isCCCSubscribed = Globals.SubscribedSoftwareNameMap['CCC_1'] ? true :false;


    // $(`#preferenceDrp-${annotationId}`).on('change',function(){
    //     if(this.value ==="cccCommands"){
    //         if(!isCCCSubscribed){
    //             bootstrapModalAlert({icon:"error",title:"You are not Subscribed to CCC",text:"Please Subscribe to proceed"})
    //             this.value = "itsmServices"
    //             return
    //         }
    //         $(`#commandDrpContainer-${annotationId}`).removeClass('d-none')
    //            $(`#serviceDrpContainer-${annotationId}`).addClass('d-none')
    //     }
    //     else if(this.value ==="itsmServices" ){
    //         $(`#commandDrpContainer-${annotationId}`).addClass('d-none')
    //            $(`#serviceDrpContainer-${annotationId}`).removeClass('d-none')
    //     }
            
    // })
    

    SubscribedSoftwareNameMaps().then((val)=>{
        console.log('SubscribedSoftwareNameMaps data: ', val)

        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = val.filter((item:any) => item.SOFTWARE_NAME == 'CCC');

        if(filtered.length>0)
            console.log('CCC is subsscribed');
        else
            console.log('CCC is not subscribed');
    })
}


const onSubmit = (formValues: z.infer<typeof formSchema>) => {
    console.log('formValues: ', formValues);
}


const customeAlert = function(msg: string, setShowAlert: Dispatch<SetStateAction<boolean>>, setAlertMsg: Dispatch<SetStateAction<string>>){

    setAlertMsg(msg);
    setShowAlert(true);
}

const Add3DModel: FC<Add3DModelProps> = ({open, close, params}) => {
    console.log('params: ', params);

    const [globalTicket, setGlobalTicket] = useState<string | undefined>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>('');
    const [serviceData, setServiceData] = useState<ServiceDataType[]>([])
    const [editors, setEditors] = useState<EditorsType>({});

    const modelViewerContainer = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const fetch = async () => {
            const ticket = await getTicket();
            setGlobalTicket(ticket)
        }
        fetch()
    },[])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            modelName: "",
            modelDescription: "",
            cameraX: 0.0,
            cameraY: 0.0,
            cameraZ: 0.0,
            uploadedModelFile: undefined,
            modelPosterUpload: undefined,

            // annotationLabel: '',
            // positionX: 0.0,
            // positionY: 0.0,
            // positionZ: 0.0,
            // normalX: 0.0,
            // normalY: 0.0,
            // normalZ: 0.0,
            // preference: '',
            // serviceDrpDown: '',
            // commandDrpDown: ''

            annotationFields: []
        },
      });
      
      const {control} = form;

      const { fields, append, remove } = useFieldArray({
        control,
        name: "annotationFields", // This should match the schema
      });

      console.log('ref_viewerLoaded : ', ref_viewerLoaded);
	
	return (
		<>
			<Dialog open={open} onOpenChange={close}>
                <DialogContent className="min-w-[80rem]">
                    <div className="w-full">
                        <DialogHeader>
                            <DialogTitle>Add 3D Model</DialogTitle>
                        </DialogHeader>
                        
                        <div className="flex gap-3">
                            <div className="w-[60%]">

                                <FormProvider {...form}>
                                    <form onSubmit={form.handleSubmit((val)=>{onSubmit(val)})}>
                                        <Tabs defaultValue="modelInfo">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="modelInfo">Model Info</TabsTrigger>
                                                <TabsTrigger value="modelAnnota" className="text-gray-500" disabled={ref_viewerLoaded ? false : false}>Model Annotations</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="modelInfo">
                                                <div>
                                                    <div className="grid gap-3">
                                                        <div>
                                                            <FormInput 
                                                                id="modelName" 
                                                                name="modelName" 
                                                                label={
                                                                    <>
                                                                        Model Name <span className="text-destructive">*</span>
                                                                    </>
                                                                } 
                                                                formControl={form.control}
                                                            />
                                                        </div>

                                                        <div className="flex gap-3 items-end">
                                                            <div>
                                                                <Label>Upload model file(only .glb are accepted)</Label>
                                                                <Input type="file" id="modelFileUpload" {...form.register("uploadedModelFile")} onChange={(e)=>{handleFileUpload(e, globalTicket, modelViewerContainer)}} className="me-2" accept=".glb" />
                                                                {
                                                                    form.formState.errors.uploadedModelFile?.message && <p className="text-red-500 text-sm">{String(form.formState.errors.uploadedModelFile.message)}</p>
                                                                }
                                                            </div>
                                                            <div>
                                                                <Input type="file" id="modelPosterUpload" {...form.register("modelPosterUpload")} className="hidden" accept=".png,.jpg,.jpeg"/>
                                                                <TextButtonWithTooltip type="button" onClick={() => { takeModelPoster() }} tooltipContent="Create model poster">
                                                                    <ImagePlus />
                                                                </TextButtonWithTooltip>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 items-end">
                                                            <div>
                                                                <FormInput 
                                                                    id="cameraX" 
                                                                    name="cameraX" 
                                                                    label={
                                                                        <>
                                                                            Camera X <span className="text-destructive">*</span>
                                                                        </>
                                                                    } 
                                                                    formControl={form.control}
                                                                />
                                                            </div>
                                                            <div>
                                                                <FormInput 
                                                                    id="cameraY" 
                                                                    name="cameraY" 
                                                                    label={
                                                                        <>
                                                                            Camera Y <span className="text-destructive">*</span>
                                                                        </>
                                                                    } 
                                                                    formControl={form.control}
                                                                />
                                                            </div>
                                                            <div>
                                                                <FormInput 
                                                                    id="cameraZ" 
                                                                    name="cameraZ" 
                                                                    label={
                                                                        <>
                                                                            Camera Z <span className="text-destructive">*</span>
                                                                        </>
                                                                    } 
                                                                    formControl={form.control}
                                                                />
                                                            </div>
                                                            <div>
                                                                <TextButtonWithTooltip type="button" onClick={() => { setInitialCameraPosition() }} tooltipContent="Set current coordinates">
                                                                    <Axis3D />
                                                                </TextButtonWithTooltip>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <FormTextarea 
                                                                name="modelDescription" 
                                                                label={
                                                                    <>
                                                                        Description <span className="text-destructive">*</span>
                                                                    </>
                                                                } 
                                                                formControl={form.control} 
                                                            />
                                                        </div>  
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="modelAnnota">
                                                <div>
                                                    <div className="flex justify-end">
                                                        <TextButtonWithTooltip onClick={()=>{ addMouseClickListenerToViewer(globalTicket as string, modelViewerContainer, setShowAlert, setAlertMsg, serviceData, editors, append) }} tooltipContent="Add annotation">
                                                            <Plus />
                                                        </TextButtonWithTooltip>
                                                    </div>

                                                    {/* <div id="modelAnnotationsContainer"></div> */}

                                                    {fields.map((field, index) => (

                                                        <div key={field.id}>
                                                            
                                                            <div className="grid grid-cols-1 mb-4"> 
                                                                <div>
                                                                    <TextButtonWithTooltip onClick={()=>{ remove(index) }} tooltipContent="Delete annotation">
                                                                        <Trash />
                                                                    </TextButtonWithTooltip>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 mb-4">
                                                                <div>
                                                                    <FormInput 
                                                                        id="annotationLabel" 
                                                                        name="annotationLabel" 
                                                                        label={
                                                                            <>
                                                                                Annotation Label
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                                <div>
                                                                    <FormInput 
                                                                        id="positionX" 
                                                                        name="positionX" 
                                                                        label={
                                                                            <>
                                                                                Position X
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <FormInput 
                                                                        id="positionY" 
                                                                        name="positionY" 
                                                                        label={
                                                                            <>
                                                                                Position Y
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <FormInput 
                                                                        id="positionZ" 
                                                                        name="positionZ" 
                                                                        label={
                                                                            <>
                                                                                Position Z
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                                <div>
                                                                    <FormInput 
                                                                        id="normalX" 
                                                                        name="normalX" 
                                                                        label={
                                                                            <>
                                                                                Normal X
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <FormInput 
                                                                        id="normalY" 
                                                                        name="normalY" 
                                                                        label={
                                                                            <>
                                                                                Normal Y
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <FormInput 
                                                                        id="normalZ" 
                                                                        name="normalZ" 
                                                                        label={
                                                                            <>
                                                                                Normal Z
                                                                            </>
                                                                        } 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div>
                                                                    <FormComboboxInput
                                                                        name="preference"
                                                                        placeholder="Preference"
                                                                        items={[]}
                                                                        formControl={form.control} 
                                                                    />
                                                                </div>
                                                                <div className="hidden">
                                                                    <FormComboboxInput
                                                                        name="serviceDrpDown" 
                                                                        items={[]} 
                                                                        formControl={form.control}
                                                                    />
                                                                </div>
                                                                <div className="hidden">
                                                                    <FormComboboxInput
                                                                        name="commandDrpDown" 
                                                                        items={[]}
                                                                        formControl={form.control} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))}

                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </form>
                                </FormProvider>


                            </div>
                            <div className="w-[40%]">
                                <div>
                                    <TextButtonWithTooltip onClick={()=>{ refreshViewer(globalTicket as string, modelViewerContainer, setShowAlert, setAlertMsg, serviceData, editors) }} tooltipContent="Refresh">
                                        <LoaderCircle />
                                    </TextButtonWithTooltip>
                                </div>
                                <div id="modelViewerContainer" className="w-full h-full flex items-center justify-center border border-grey-500"  ref={modelViewerContainer}>
                                    <div>
                                        Upload Device 3D Model
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {
                showAlert && (
                    <CustomAlertDialog title={alertMsg} />
                )
            }
			
		</>
	)

}

export default Add3DModel