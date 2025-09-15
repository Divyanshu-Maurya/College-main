import { useMemo, useState } from "react";
import {
  Plus,
  Users,
  UserRound,
  Building2,
  CalendarDays,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Data types
export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "On Leave";
}
export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  attendance: AttendanceRecord[];
}
export interface HOD {
  id: string;
  name: string;
  departmentId: string;
  faculties: FacultyMember[];
}
export interface Department {
  id: string;
  name: string;
  code: string;
  hods: HOD[];
}

// Sample generator utilities
function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function generateAttendance(days = 14): AttendanceRecord[] {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const r = (i * 17 + 7) % 10; // pseudo random
    const status: AttendanceRecord["status"] =
      r < 7 ? "Present" : r < 9 ? "Absent" : "On Leave";
    return { date: formatDate(d), status };
  });
}

function sampleData(): Department[] {
  const depts = [
    { id: "cse", name: "Computer Science & Engineering", code: "CSE" },
  ];

  return depts.map((d, idx) => {
    const hodCount = 1; // One HOD per department
    const hods: HOD[] = Array.from({ length: hodCount }).map((_, h) => {
      const faculties: FacultyMember[] = Array.from({ length: 6 }).map(
        (__, f) => ({
          id: `${d.id}-f${h}-${f}`,
          name: `Faculty ${f + 1}`,
          role:
            f % 3 === 0
              ? "Assistant Professor"
              : f % 3 === 1
                ? "Associate Professor"
                : "Professor",
          email: `faculty${f + 1}@${d.code.toLowerCase()}.edu`,
          phone: `+91 98${idx}${h}${f}0${(f + 3) % 10}${(f + 6) % 10}`,
          attendance: generateAttendance(14),
        }),
      );
      return {
        id: `${d.id}-hod-${h + 1}`,
        name: `HOD ${h + 1}`,
        departmentId: d.id,
        faculties,
      };
    });
    return { ...d, hods } as Department;
  });
}

// UI Components
function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-accent text-accent-foreground border border-border",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AttendanceTable({ records }: { records: AttendanceRecord[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="grid grid-cols-3 text-xs font-medium bg-muted/60">
        <div className="px-3 py-2">Date</div>
        <div className="px-3 py-2">Status</div>
        <div className="px-3 py-2">Remark</div>
      </div>
      <div className="divide-y">
        {records.map((r) => (
          <div key={r.date} className="grid grid-cols-3 text-sm">
            <div className="px-3 py-2 text-muted-foreground">{r.date}</div>
            <div className="px-3 py-2">
              <Pill
                className={cn(
                  r.status === "Present" &&
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                  r.status === "Absent" &&
                    "bg-rose-50 text-rose-700 border-rose-200",
                  r.status === "On Leave" &&
                    "bg-amber-50 text-amber-700 border-amber-200",
                )}
              >
                {r.status === "Present" && <Check className="h-3.5 w-3.5" />}{" "}
                {r.status}
                {r.status === "Absent" && <X className="h-3.5 w-3.5" />}
              </Pill>
            </div>
            <div className="px-3 py-2 text-muted-foreground">
              {r.status === "Present"
                ? "—"
                : r.status === "Absent"
                  ? "Uninformed"
                  : "Approved"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacultyCard({ faculty }: { faculty: FacultyMember }) {
  const [open, setOpen] = useState(false);
  const presentCount = useMemo(
    () => faculty.attendance.filter((a) => a.status === "Present").length,
    [faculty],
  );
  const absentCount = useMemo(
    () => faculty.attendance.filter((a) => a.status === "Absent").length,
    [faculty],
  );
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-indigo-500" />
              <h4 className="font-medium leading-tight">{faculty.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{faculty.role}</p>
            <div className="flex gap-2 mt-3">
              <Pill className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Present {presentCount}
              </Pill>
              <Pill className="bg-rose-50 text-rose-700 border-rose-200">
                Absent {absentCount}
              </Pill>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            aria-expanded={open}
            aria-label={open ? "Hide attendance" : "Show attendance"}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "shrink-0 rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 hover:from-violet-500/20 hover:to-indigo-500/20 border-0",
            )}
          >
            <Plus
              className={cn(
                "h-5 w-5 text-indigo-600 transition-transform",
                open && "rotate-45",
              )}
            />
          </Button>
        </div>
        {open && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Last 14 days
            </div>
            <AttendanceTable records={faculty.attendance} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HODCard({ hod }: { hod: HOD }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <div>
              <h4 className="font-medium leading-tight">{hod.name}</h4>
              <p className="text-xs text-muted-foreground">
                {hod.faculties.length}{" "}
                {hod.faculties.length === 1
                  ? "Faculty Member"
                  : "Faculty Members"}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            aria-expanded={open}
            aria-label={open ? "Hide faculty" : "Show faculty"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-0"
          >
            <Plus
              className={cn(
                "h-5 w-5 text-indigo-600 transition-transform",
                open && "rotate-45",
              )}
            />
          </Button>
        </div>
        {open && (
          <div className="mt-4">
            <SectionHeader
              icon={UserRound}
              title="Faculty"
              subtitle="Tap + to view attendance details"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hod.faculties.map((f) => (
                <FacultyCard key={f.id} faculty={f} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DepartmentCard({
  dept,
  open,
  onOpenChange,
  selected,
  defaultOpen,
}: {
  dept: Department;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selected?: boolean;
  defaultOpen?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
  const isOpen = open ?? internalOpen;
  const toggle = () =>
    onOpenChange ? onOpenChange(!isOpen) : setInternalOpen((v) => !v);

  return (
    <Card
      className={cn(
        "overflow-hidden",
        selected && "ring-2 ring-indigo-200 border-indigo-200",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white grid place-items-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">{dept.name}</h3>
              <p className="text-xs text-muted-foreground">
                {dept.hods.length} HOD{dept.hods.length === 1 ? "" : "s"} • Code{" "}
                {dept.code}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Hide HOD" : "Show HOD"}
            onClick={toggle}
            className="rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-0"
          >
            <Plus
              className={cn(
                "h-5 w-5 text-indigo-600 transition-transform",
                isOpen && "rotate-45",
              )}
            />
          </Button>
        </div>
        {isOpen && (
          <div className="mt-5">
            <SectionHeader
              icon={Users}
              title="Heads of Department"
              subtitle="Tap + to view faculty"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dept.hods.map((h) => (
                <HODCard key={h.id} hod={h} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PrincipalDashboard() {
  const departments = useMemo(() => sampleData(), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Department grid • Expand into HOD → Faculty → Attendance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Departments</p>
            <p className="text-2xl font-semibold">{departments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total HODs</p>
            <p className="text-2xl font-semibold">
              {departments.reduce((s, d) => s + d.hods.length, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Faculty</p>
            <p className="text-2xl font-semibold">
              {departments.reduce(
                (s, d) =>
                  s + d.hods.reduce((x, h) => x + h.faculties.length, 0),
                0,
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Attendance Window</p>
            <p className="text-2xl font-semibold">14 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <SectionHeader
          icon={Building2}
          title="Departments"
          subtitle="Tap + on a department to view HOD"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {departments.map((dept) => (
          <DepartmentCard key={dept.id} dept={dept} defaultOpen selected />
        ))}
      </div>
    </div>
  );
}
