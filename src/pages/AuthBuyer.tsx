import { PhoneAuthCard } from "@/components/auth/PhoneAuthCard";

export default function AuthBuyer() {
  return (
    <PhoneAuthCard
      role="buyer"
      redirectTo="/dashboard"
      extraFields={[{ key: "business_id", labelKey: "auth.businessId" }]}
    />
  );
}
