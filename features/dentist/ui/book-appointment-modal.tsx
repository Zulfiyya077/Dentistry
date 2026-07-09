"use client";

import { useState } from "react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import type { MockDentist } from "@/features/dentist/data/mock-dentists";
import { dentistActionsService } from "@/features/dentist/services/dentist-actions.service";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/locale-provider";
import { showToast } from "@/lib/toast";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

interface BookAppointmentModalProps {
  dentist: MockDentist;
  open: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function BookAppointmentModal({
  dentist,
  open,
  onClose,
}: BookAppointmentModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const minDate = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setIsSubmitting(true);
    dentistActionsService.bookAppointment({
      dentistId: dentist.id,
      dentistName: dentist.fullName,
      dentistSlug: dentist.slug,
      patientName: user?.displayName,
      date,
      time,
      note: note.trim() || undefined,
    });

    showToast(t("profile.appointmentBooked"));
    setIsSubmitting(false);
    setDate("");
    setTime("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevated">
        <h2 className="text-xl font-bold">{t("profile.bookAppointmentTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {dentist.fullName}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              {t("profile.appointmentDate")}
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="auth-input"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              {t("profile.appointmentTime")}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={cn(
                    "rounded-lg border py-2 text-xs font-medium transition-colors",
                    time === slot
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" />
              {t("profile.appointmentNote")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={t("profile.appointmentNotePlaceholder")}
              className="auth-input resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              {t("profile.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!date || !time || isSubmitting}
            >
              {t("profile.confirmAppointment")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
