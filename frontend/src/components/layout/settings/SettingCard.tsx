// components/SettingCard.tsx

import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export default function SettingCard({ title, description, icon, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md hover:shadow-lg transition duration-200 cursor-pointer aspect-square flex flex-col justify-between"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </div>
  );
}
