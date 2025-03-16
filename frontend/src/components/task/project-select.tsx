import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSelect() {
  return (
    <Select>
      <SelectTrigger className="w-52 shadow-none border-white/20 h-8">
        <SelectValue placeholder="Select Goal" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Goals</SelectLabel>
          <SelectItem value="inbox">Goal 1</SelectItem>
          <SelectItem value="project1">Goal 2</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
