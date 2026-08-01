import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateLead } from "../hooks";
import { useRightPanel } from "@/layouts/right-panel";

const addLeadSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(255),
    email: z.email("Enter a valid email").optional().or(z.literal("")),
    phone: z.string().trim().max(20).optional().or(z.literal("")),
    interest: z.string().trim().max(255).optional().or(z.literal("")),
    budget: z.string().trim().max(255).optional().or(z.literal("")),
  })
  .refine((v) => v.email || v.phone, { message: "Either email or phone is required", path: ["email"] });

type AddLeadFormValues = z.infer<typeof addLeadSchema>;

export function AddLeadForm() {
  const createLead = useCreateLead();
  const { close } = useRightPanel();

  const form = useForm<AddLeadFormValues>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: { name: "", email: "", phone: "", interest: "", budget: "" },
  });

  function onSubmit(values: AddLeadFormValues) {
    createLead.mutate(
      { name: values.name, email: values.email || undefined, phone: values.phone || undefined, interest: values.interest || undefined, budget: values.budget || undefined },
      { onSuccess: close },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="jane@example.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+251 9xx xxx xxx" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="interest" render={({ field }) => (
          <FormItem><FormLabel>Interest</FormLabel><FormControl><Input placeholder="Weight loss program" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="budget" render={({ field }) => (
          <FormItem><FormLabel>Budget</FormLabel><FormControl><Input placeholder="$100-150/month" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={createLead.isPending}>
          {createLead.isPending ? "Adding..." : "Add lead"}
        </Button>
      </form>
    </Form>
  );
}