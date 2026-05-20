import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function OtpGrid({ value, onChange, disabled }: Props) {
  return (
    <InputOTP maxLength={6} value={value} onChange={onChange} disabled={disabled}>
      <InputOTPGroup className="gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className="h-12 w-12 rounded-lg border-l text-lg font-semibold first:rounded-l-lg last:rounded-r-lg"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
