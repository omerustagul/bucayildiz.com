"use client";

import { ViewHeader } from "@/components/admin/kit";
import { ScheduleAssignCard } from "@/components/admin/ScheduleAssignCard";
import { ScheduleCalendar } from "@/components/admin/ScheduleCalendar";

export type STeam = { id: string; name: string };
export type SAthlete = { id: string; name: string; teamId: string };
export type SDrill = { id: string; text: string; done: boolean };
export type STraining = {
  id: string; teamId: string; scope: string; status: string; date: string; time: string;
  duration: number | null; pitch: string; notes: string; drills: SDrill[]; participants: string[];
};
export type SFixture = { id: string; competition: string; opponent: string; isHome: boolean; date: string; time: string; venue: string; teamId: string | null };

export function ScheduleView({ teams, athletes, trainings, fixtures, todayYmd }: {
  teams: STeam[]; athletes: SAthlete[]; trainings: STraining[]; fixtures: SFixture[]; todayYmd: string;
}) {
  return (
    <>
      <ViewHeader title="Takvim Programı" subtitle="Antrenman programını planla; maçlar fikstürden otomatik görünür" />
      <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 18, alignItems: "start" }}>
        <ScheduleAssignCard teams={teams} athletes={athletes} fixtures={fixtures} />
        <ScheduleCalendar teams={teams} trainings={trainings} fixtures={fixtures} todayYmd={todayYmd} />
      </div>
    </>
  );
}
