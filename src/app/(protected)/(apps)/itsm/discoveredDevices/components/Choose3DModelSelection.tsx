import { Dispatch, FC, SetStateAction, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import ComboboxInput from "@/ikon/components/combobox-input";
import { Choose3DModelSelectionProps } from "../types";
import Add3DModel from "./Add3DModel";


const handleSelectChange = (value: string, setIsAddModelVisible: Dispatch<SetStateAction<boolean>>) => {
    if(value=='create_new_model'){
        setIsAddModelVisible(true)
    }
}


const Choose3DModelSelection: FC<Choose3DModelSelectionProps> = ({open, close, modelId}) => {
    console.log('modelId: ', modelId);
    const [isAddModelVisible, setIsAddModelVisible] = useState(false);

	return (
		<>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Device Model</DialogTitle>
                    </DialogHeader>
                    
                    <div>
                        <ComboboxInput onSelect={(val) => {handleSelectChange(val as string, setIsAddModelVisible)}} placeholder="Select model options" items={[
                            {
                                value: 'create_new_model', label: 'Create new model'
                            },
                            {
                                value: 'edit_model', label: 'Edit model', disabled: () => ( modelId ? false : true )
                            },
                            {
                                value: 'use_existing_model', label: 'Use existing model'
                            }
                        ]} />
                    </div>
                    
                </DialogContent>
            </Dialog>

            {
                isAddModelVisible && (
                    <Add3DModel open={isAddModelVisible} close={()=>{setIsAddModelVisible(false)}} params={{deviceId: ''}} />
                )
            }
        </>
	)

}

export default Choose3DModelSelection

