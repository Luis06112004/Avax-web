"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type DeviceKey = "desktop" | "tablet" | "mobile";

const DEVICES: { key: DeviceKey; icon: typeof Monitor; label: string }[] = [
  { key: "desktop", icon: Monitor, label: "Escritorio" },
  { key: "tablet", icon: Tablet, label: "Tablet" },
  { key: "mobile", icon: Smartphone, label: "Móvil" },
];

export default function DeviceSwitcher({
  value,
  onChange,
}: {
  value: DeviceKey;
  onChange: (d: DeviceKey) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] p-1">
      {DEVICES.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          title={label}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer",
            value === key
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--admin-fg-muted)] hover:bg-white/5 hover:text-[var(--admin-fg)]",
          )}
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
