import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function PhoneInput({ value, onChange, disabled, placeholder }: Props) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
      <span className="flex items-center gap-1 border-r border-input bg-muted/50 px-3 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" />
        +91
      </span>
      <Input
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={value}
        disabled={disabled}
        placeholder={placeholder ?? "98765 43210"}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
