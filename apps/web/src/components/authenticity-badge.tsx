interface AuthenticityBadgeProps {
  score: number;
  riskLevel: "low" | "medium" | "high";
}

const RISK_CONFIG = {
  low: {
    label: "Low Risk",
    bgClass: "bg-green-100 dark:bg-green-900/30",
    textClass: "text-green-800 dark:text-green-300",
    dotClass: "bg-green-500",
  },
  medium: {
    label: "Medium Risk",
    bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
    textClass: "text-yellow-800 dark:text-yellow-300",
    dotClass: "bg-yellow-500",
  },
  high: {
    label: "High Risk",
    bgClass: "bg-red-100 dark:bg-red-900/30",
    textClass: "text-red-800 dark:text-red-300",
    dotClass: "bg-red-500",
  },
};

export function AuthenticityBadge({ score, riskLevel }: AuthenticityBadgeProps) {
  const config = RISK_CONFIG[riskLevel];

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${config.bgClass}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
      <span className={`text-sm font-medium ${config.textClass}`}>
        Authenticity: {score}/100
      </span>
      <span className={`text-xs ${config.textClass} opacity-75`}>
        ({config.label})
      </span>
    </div>
  );
}
