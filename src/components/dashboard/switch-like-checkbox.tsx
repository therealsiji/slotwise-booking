import { Label } from "@/components/ui/label";

export function SwitchLikeCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <Label className="flex items-center gap-3 text-sm font-medium">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-foreground"
      />
      {label}
    </Label>
  );
}
