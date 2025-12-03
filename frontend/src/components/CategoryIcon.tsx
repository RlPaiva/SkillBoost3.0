// src/components/CategoryIcon.tsx
import React from "react";
import {
  Code,
  Cpu,
  Database,
  Shield,
  Cloud,
  PenTool,
  BarChart2,
  Users,
  Layers,
} from "lucide-react";

const iconClasses =
  "w-7 h-7 text-blue-600 bg-blue-100 p-1.5 rounded-xl shadow-inner";

interface Props {
  category: string;
}

const CategoryIcon: React.FC<Props> = ({ category }) => {
  const normalized = category.toLowerCase();

  const icons: Record<string, JSX.Element> = {
    "front-end": <Code className={iconClasses} />,
    frontend: <Code className={iconClasses} />,
    "back-end": <Cpu className={iconClasses} />,
    backend: <Cpu className={iconClasses} />,
    "full stack": <Layers className={iconClasses} />,
    data: <Database className={iconClasses} />,
    "data science": <Database className={iconClasses} />,
    "data engineering": <Database className={iconClasses} />,
    security: <Shield className={iconClasses} />,
    "cyber security": <Shield className={iconClasses} />,
    cloud: <Cloud className={iconClasses} />,
    design: <PenTool className={iconClasses} />,
    "ux ui": <PenTool className={iconClasses} />,
    "project management": <Users className={iconClasses} />,
    business: <BarChart2 className={iconClasses} />,
  };

  return icons[normalized] || <Layers className={iconClasses} />;
};

export default CategoryIcon;
