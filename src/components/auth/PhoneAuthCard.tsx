import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthShell } from "@/components/auth/AuthShell";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OtpGrid } from "@/components/auth/OtpGrid";
import { useLang } from "@/hooks/useLang";
import { useOtpAuth, type Role } from "@/hooks/useOtpAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, MapPin } from "lucide-react";
import { toast } from "sonner";

const DISTRICTS = ["Mysuru", "Mandya", "Hassan", "Chamarajanagar", "Kodagu", "Bengaluru Rural"];

interface ExtraField {
  key: string;
  labelKey: "auth.primaryCrop" | "auth.farmerId" | "auth.businessId";
  required?: boolean;
}

interface Props {
  role: Extract<Role, "farmer" | "buyer">;
  extraFields: ExtraField[];
  redirectTo: string;
}

export function PhoneAuthCard({ role, extraFields, redirectTo }: Props) {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [fullName, setFullName] = useState("");
  const [district, setDistrict] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const a = useOtpAuth(role);

  const sendForSignup = async () => {
    if (!fullName.trim()) return toast.error("Enter your name");
    if (!district) return toast.error("Choose a district");
    await a.sendOtp({ full_name: fullName, district, language: lang });
  };

  const sendForLogin = async () => {
    await a.sendOtp(null);
  };

  const handleVerify = async () => {
    const res = await a.verify();
    if (!res.ok || !res.userId) return;

    if (mode === "signup") {
      // role-specific details
      if (role === "farmer") {
        await supabase.from("farmer_details").upsert({
          user_id: res.userId,
          primary_crop: extra["primary_crop"] ?? null,
          farmer_id: extra["farmer_id"] ?? null,
        });
      } else {
        await supabase.from("buyer_details").upsert({
          user_id: res.userId,
          business_id: extra["business_id"] ?? null,
        });
      }
    }
    toast.success("Welcome!");
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthShell>
      <div className="glass-card rounded-2xl p-6 sm:p-8 animate-sheet-in">
        {a.step === "otp" ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => a.setStep("phone")}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {t("cta.changeNumber")}
            </button>
            <div>
              <Label className="text-base">{t("auth.otp")}</Label>
              <p className="mt-1 text-sm text-muted-foreground">+91 {a.phone}</p>
              <div className="mt-4">
                <OtpGrid value={a.otp} onChange={a.setOtp} disabled={a.busy} />
              </div>
            </div>
            <Button onClick={handleVerify} disabled={a.busy || a.otp.length !== 6} className="w-full lift-btn rounded-xl" size="lg">
              {t("cta.verify")}
            </Button>
          </div>
        ) : (
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">{t("auth.signup")}</TabsTrigger>
              <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signup" className="mt-6 space-y-4">
              <Field icon={<User className="h-4 w-4" />} label={t("auth.fullName")}>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ramesh K." />
              </Field>
              <Field label={t("auth.phone")}>
                <PhoneInput value={a.phone} onChange={a.setPhone} />
              </Field>
              {extraFields.map((f) => (
                <Field key={f.key} label={t(f.labelKey)}>
                  <Input
                    value={extra[f.key] ?? ""}
                    onChange={(e) => setExtra((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                </Field>
              ))}
              <Field icon={<MapPin className="h-4 w-4" />} label={t("auth.district")}>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Button onClick={sendForSignup} disabled={a.busy} className="w-full lift-btn rounded-xl" size="lg">
                {t("cta.sendOtp")}
              </Button>
            </TabsContent>

            <TabsContent value="login" className="mt-6 space-y-4">
              <Field label={t("auth.phone")}>
                <PhoneInput value={a.phone} onChange={a.setPhone} />
              </Field>
              <Button onClick={sendForLogin} disabled={a.busy} className="w-full lift-btn rounded-xl" size="lg">
                {t("cta.sendOtp")}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AuthShell>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-sm">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
