"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ScoreBreakdownProps {
  topicRelevance: number;
  viewsScore: number;
  engagementScore: number;
  consistencyScore: number;
  audienceMatchScore: number;
  authenticityScore?: number;
  overallScore: number;
}

const SCORE_COLORS: Record<string, string> = {
  Topic: "hsl(var(--chart-1))",
  Views: "hsl(var(--chart-2))",
  Engagement: "hsl(var(--chart-3))",
  Consistency: "hsl(var(--chart-4))",
  Audience: "hsl(var(--chart-5))",
  Authenticity: "hsl(210, 70%, 55%)",
};

function getScoreColor(score: number): string {
  if (score >= 75) return "hsl(142, 71%, 45%)";
  if (score >= 50) return "hsl(48, 96%, 53%)";
  return "hsl(0, 84%, 60%)";
}

export function ScoreBreakdown(props: ScoreBreakdownProps) {
  const data = [
    { name: "Topic", score: props.topicRelevance, weight: "30%" },
    { name: "Views", score: props.viewsScore, weight: "25%" },
    { name: "Engagement", score: props.engagementScore, weight: "20%" },
    { name: "Consistency", score: props.consistencyScore, weight: "15%" },
    { name: "Audience", score: props.audienceMatchScore, weight: "10%" },
  ];

  if (props.authenticityScore !== undefined) {
    data.push({
      name: "Authenticity",
      score: props.authenticityScore,
      weight: "bonus",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Score Breakdown</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Overall</span>
          <span
            className="text-2xl font-bold"
            style={{ color: getScoreColor(props.overallScore) }}
          >
            {props.overallScore}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis domain={[0, 100]} type="number" />
            <YAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              type="category"
              width={100}
            />
            <Tooltip
              formatter={(value) => [`${value}/100`, "Score"]}
              labelFormatter={(label) => {
                const item = data.find((d) => d.name === String(label));
                return `${String(label)} (${item?.weight} weight)`;
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={SCORE_COLORS[entry.name] ?? getScoreColor(entry.score)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <span className="text-muted-foreground">{item.name}</span>
            <span
              className="font-medium"
              style={{ color: getScoreColor(item.score) }}
            >
              {item.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
