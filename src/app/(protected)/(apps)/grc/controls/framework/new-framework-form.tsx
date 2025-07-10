"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form"
import { Input } from "@/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Button } from "@/shadcn/ui/button"
import { useToast } from "../../hooks/use-toast"

const formSchema = z.object({
  id: z.string().min(1, "Control ID is required"),
  name: z.string().min(1, "Control name is required"),
  riskLevel: z.enum(["High", "Medium", "Low"]),
  owner: z.string().min(1, "Control owner is required"),
  status: z.enum(["Implemented", "In Progress", "Not Started"]),
  description: z.string().min(1, "Description is required"),
})

export function NewFrameworkForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Not Started",
      riskLevel: "Medium",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Control Created",
      description: "The new control has been added to the framework.",
    })
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Control</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Control ID</FormLabel>
                    <FormControl>
                      <Input placeholder="CTR-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Control Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Access Control Policy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Control Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Implementation Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Implemented">Implemented</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the control..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Control</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}