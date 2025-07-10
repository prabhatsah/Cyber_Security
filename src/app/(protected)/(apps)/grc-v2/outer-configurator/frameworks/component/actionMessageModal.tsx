import FormTextarea from '@/ikon/components/form-fields/textarea';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MessageSchema = z.object({
    DESCRIPTION: z.string().min(2, { message: 'Action Description must be at least 2 characters long.' }),
})


export default function ActionMessageModal({
    openMessageModal,
    setOpenMessageModal,
    actionFn
}: {
    openMessageModal: boolean;
    setOpenMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
    actionFn: null | ((actionMessage:string) => void);
}) {

    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
        defaultValues: {
            DESCRIPTION: '',
        },
    });

    function saveMessageFormInfo(data: z.infer<typeof MessageSchema>) {
        if(actionFn){
            actionFn(data.DESCRIPTION);
        }
        setOpenMessageModal(false);
    }

    return (
        <>
            <Dialog open={openMessageModal} onOpenChange={setOpenMessageModal}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Remark Form</DialogTitle>
                        <DialogDescription>
                            Please Enter a Suitable Description of Your Action
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form} >
                        <form>
                            <div className='flex flex-col gap-3'>
                                <FormTextarea
                                    formControl={form.control}
                                    name="DESCRIPTION"
                                    placeholder="Enter Message"
                                    label="Message*"
                                    className="resize-y max-h-[100px] w-full"
                                    formItemClass="w-full"
                                />
                            </div>
                        </form>
                    </Form>

                    <DialogFooter>
                        <Button onClick={form.handleSubmit(saveMessageFormInfo)}>Submit</Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>

        </>
    )
}
