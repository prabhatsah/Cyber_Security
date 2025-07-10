import FormInput from '@/ikon/components/form-fields/input'
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form } from '@/shadcn/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
//import { ProjectDetailsForm } from './schema'
import FormDateInput from '@/ikon/components/form-fields/date-input'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input'
import { DataTable } from '@/ikon/components/data-table'
import { DTColumnsProps } from '@/ikon/components/data-table/type'
import { Checkbox } from '@/shadcn/ui/checkbox'
import { ProjectDetailsForm } from './schema'


export default function NewProjectDetailsForm({ open, setOpen, projectmanager }: any) {
  const [checkedRows, setCheckeRows] = useState<string[]>([]);

  const selectedProjectMembers = (row: any) => {
    setCheckeRows((prevCheckedRows: any) =>
      prevCheckedRows.includes(row.original.value)
        ? prevCheckedRows.filter((id: any) => id !== row.original.value) // Remove if exists
        : [...prevCheckedRows, row.original.value] // Add if not present
    );
  }


  const projectTeamColumns: DTColumnsProps<any>[] = [
    {
      accessorKey: "label",
      header: "Team Members"
    },
    {
      id: 'Select',
      header: 'Select',
      cell: ({ row }) => {

        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              selectedProjectMembers(row)
            }}
            aria-label="Select row"
          />
        )
      },
    },
  ]

  const form = useForm<z.infer<typeof ProjectDetailsForm>>({
    resolver: zodResolver(ProjectDetailsForm),
    defaultValues: {
      PROJECT_NAME: '',
      MANAGER_NAME: '',
      START_DATE: undefined,
      END_DATE: undefined,
    },
  });



  function saveProjectInfo(data: z.infer<typeof ProjectDetailsForm>) {
    console.log(data);
    console.log(checkedRows);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <FormInput formControl={form.control} name={"PROJECT_NAME"} label={"Project Name"} placeholder={"Enter Project Name"} />
                  <FormComboboxInput items={projectmanager} formControl={form.control} name={"MANAGER_NAME"} placeholder={"Choose Manager Name"} label={"Manager Name"} />
                  <FormDateInput formControl={form.control} name={"START_DATE"} label={"Start Date"} placeholder={"Enter Start Date"} />
                  <FormDateInput formControl={form.control} name={"END_DATE"} label={"End Date"} placeholder={"Enter End Date"} />
                </div>
              </form>
            </Form>
          </div>
          <h1>Project Team</h1>
          <div className='h-[50vh] overflow-auto'>
            <DataTable data={projectmanager} columns={projectTeamColumns} />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={form.handleSubmit(saveProjectInfo)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
