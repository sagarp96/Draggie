import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { taskTags } from "@/lib/data/tags";

export function SelectDropdown() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Tags" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {taskTags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              <tag.icon className="mr-2 h-4 w-4" />
              {tag.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
