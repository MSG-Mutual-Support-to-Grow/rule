import { Switch } from "@/components/ui/switch"; // If you're using Shadcn UI

export default function ThemeSettings() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Theme Mode</h3>
      <div className="flex items-center space-x-4">
        <span>Light</span>
        <Switch />
        <span>Dark</span>
      </div>
    </div>
  );
}
