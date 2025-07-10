import { z } from "zod";

export const RaiseInvoiceFormSchema = z.object({
  "type": z.string().optional(),
  "mailTo": z.array(z.string()).optional(),
  "mailCc": z.array(z.string()).optional(),
  "subject": z.string().nonempty("please enter subject"),
  "remarks": z.string().optional(),
  "fileInfoArray2": z.array(z.string()).optional(),
  "invoiceNumber": z.string().optional(),
  "invoiceDate": z.string().optional(),
  "invoiceStatus": z.string().optional(),
  "accountManager": z.string().optional(),
  "accountManagerEmail": z.string().optional(),
  "guestEmail": z.array(z.string()).optional(),
  "encodedPdf": z.string().optional(),
  "pdfName": z.string().optional(),
  "accountId": z.string().optional(),
  "fileInfoArray1": z.array(z.string()).optional(),
  "mailDate" : z.string().optional()
});
