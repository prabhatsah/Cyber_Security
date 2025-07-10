import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Textarea } from "@/shadcn/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LostInvoiceFormSchema } from "./LostInvoiceFormSchema";
import { TextButton } from "@/ikon/components/buttons";

interface LostInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceIdentifier: string
}


    

const LostInvoiceModal = ({
    isOpen,
    onClose,
    invoiceIdentifier
}: LostInvoiceModalProps) => {
    var form = useForm<z.infer<typeof LostInvoiceFormSchema>>({
        resolver: zodResolver(LostInvoiceFormSchema),
    
        defaultValues: {
            "remarksForLostInv": ""
        },
    });
    const handleOnSubmit = async (data: z.infer<typeof LostInvoiceFormSchema>) => {
        console.log("Form Data Submitted: ", data);
        form.reset({
            "remarksForLostInv": ""
        })
        onClose()
    }
    const onError = (errors: any) => {
        console.error("Form Submission Errors: ", errors);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
                <DialogTitle>Lost Invoice</DialogTitle>
            </DialogHeader>
            <div>
            <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleOnSubmit, onError)}
                            id="lost-invoice-form"
                        >
            <FormTextarea
                formControl={form.control}
                name={"remarksForLostInv"}
                label="Remarks"
                />
                </form>
                </Form>
                </div>
                <DialogFooter>

<TextButton type="submit" form="lost-invoice-form">Lost</TextButton>
</DialogFooter>
                </DialogContent>
                </Dialog>
    );
}
export default LostInvoiceModal;