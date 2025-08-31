"use client";
import { Pencil } from "lucide-react";
import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditTask } from "@/hooks/Mutate";
import { taskTags } from "@/lib/data/tags";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function EditTaskBTN({
  taskID,
  fetchedTaskdetails,
}: {
  taskID: string;
  fetchedTaskdetails: {
    name: string;
    description: string;
    tags: string;
    DueDate: Date;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-10 hover:bg-transparent hover:text-black"
            variant="transparent"
          >
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your Task here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            setOpen={setOpen}
            taskID={taskID}
            fetchedTaskdetails={fetchedTaskdetails}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-10 hover:bg-transparent hover:text-black"
          variant="transparent"
        >
          <Pencil />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Task</DrawerTitle>
          <DrawerDescription>
            Make changes to your Task here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          setOpen={setOpen}
          taskID={taskID}
          fetchedTaskdetails={fetchedTaskdetails}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="transparent"
              className="hover:bg-transparent hover:text-black"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  setOpen,
  taskID,
  fetchedTaskdetails,
}: React.ComponentProps<"form"> & {
  className?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskID: string;
  fetchedTaskdetails: {
    name: string;
    description: string;
    tags: string;
    DueDate: Date;
  };
}) {
  const EditTaskMutation = EditTask();

  const [calenderopen, setCalenderopen] = React.useState(false);
  const formSchema = z.object({
    Name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    Description: z.string().min(2, {
      message: "Description must be at least 2 characters.",
    }),
    Tags: z.string().min(2, {
      message: "Tags must be at least 2 characters.",
    }),
    DueDate: z.date().min(2, {
      message: "DueDate must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: fetchedTaskdetails.name,
      Description: fetchedTaskdetails.description,
      Tags: fetchedTaskdetails.tags,
      DueDate: fetchedTaskdetails.DueDate,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const task = {
      id: taskID,
      name: values.Name,
      due_date: values.DueDate,
      description: values.Description,
      tags: values.Tags,
      time: new Date().toISOString(),
    };
    EditTaskMutation.mutate({ task });

    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tags" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taskTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <tag.icon className="mr-2 h-4 w-4" />
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="DueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover open={calenderopen} onOpenChange={setCalenderopen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setCalenderopen(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
