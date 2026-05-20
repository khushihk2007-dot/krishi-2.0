import { PhoneAuthCard } from "@/components/auth/PhoneAuthCard";

export default function AuthFarmer() {
  return (
    <PhoneAuthCard
      role="farmer"
      redirectTo="/dashboard"
      extraFields={[
        { key: "primary_crop", labelKey: "auth.primaryCrop" },
        { key: "farmer_id", labelKey: "auth.farmerId" },
      ]}
    />
  );
}
