import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OtpGrid } from "@/components/auth/OtpGrid";
import { SkillChipGroup, type Skill } from "@/components/auth/SkillChipGroup";
import { useLang } from "@/hooks/useLang";
import { useOtpAuth } from "@/hooks/useOtpAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, HardHat } from "lucide-react";
import { toast } from "sonner";

const SKILLS: Skill[] = ["harvesting", "sowing", "ploughing", "machine_operator", "loading"];

export default function AuthLabourer() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const a = useOtpAuth("labourer");
  const [fullName, setFullName] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);

  const send = async () => {
    if (!fullName.trim()) return toast.error("Enter your name");
    if (skills.length === 0) return toast.error("Select at least one skill");
    await a.sendOtp({ full_name: fullName, language: lang });
  };

  const handleVerify = async () => {
    const res = await a.verify();
    if (!res.ok || !res.userId) return;
    if (skills.length) {
      await supabase.from("labourer_skills").upsert(
        skills.map((s) => ({ user_id: res.userId!, skill: s })),
        { onConflict: "user_id,skill", ignoreDuplicates: true },
      );
    }
    toast.success("Welcome!");
    navigate("/work-feed", { replace: true });
  };

  return (
    <AuthShell>
      <div className="rounded-2xl border-2 border-earth/40 bg-card p-6 shadow-glass sm:p-8 animate-sheet-in">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth text-earth-foreground">
            <HardHat className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold">{t("role.labourer")}</h1>
            <p className="text-sm text-muted-foreground">{t("role.labourer.desc")}</p>
          </div>
        </div>

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
              <Label className="text-base font-semibold">{t("auth.otp")}</Label>
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
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-base font-semibold">
                <User className="h-4 w-4" /> {t("auth.fullName")}
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 text-base"
                placeholder="Suresh M."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-base font-semibold">{t("auth.phone")}</Label>
              <PhoneInput value={a.phone} onChange={a.setPhone} />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold">{t("auth.skills")}</Label>
              <SkillChipGroup
                options={SKILLS.map((s) => ({ value: s, label: t(`auth.skill.${s}` as any) }))}
                selected={skills}
                onChange={setSkills}
              />
            </div>
            <Button onClick={send} disabled={a.busy} className="w-full lift-btn rounded-xl" size="lg">
              {t("cta.sendOtp")}
            </Button>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
