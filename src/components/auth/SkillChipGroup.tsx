import { cn } from "@/lib/utils";

export type Skill = "harvesting" | "sowing" | "ploughing" | "machine_operator" | "loading";

interface Props {
  options: { value: Skill; label: string }[];
  selected: Skill[];
  onChange: (next: Skill[]) => void;
}

export function SkillChipGroup({ options, selected, onChange }: Props) {
  const toggle = (s: Skill) =>
    onChange(selected.includes(s) ? selected.filter((x) => x !== s) : [...selected, s]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all lift-btn",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-control"
                : "border-input bg-background text-foreground hover:border-primary/50",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
