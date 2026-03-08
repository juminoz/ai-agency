import Image from "next/image";
import Link from "next/link";

interface ChannelCardProps {
  channelId: string;
  title: string;
  description: string | null;
  subscriberCount: number;
  videoCount: number;
  thumbnailUrl: string | null;
  overallScore?: number;
  matchReason?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getScoreBadgeClass(score: number): string {
  if (score >= 75)
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (score >= 50)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
}

export function ChannelCard({
  channelId,
  title,
  description,
  subscriberCount,
  videoCount,
  thumbnailUrl,
  overallScore,
  matchReason,
}: ChannelCardProps) {
  return (
    <Link
      className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
      href={`/admin/channels/${channelId}`}
    >
      <div className="flex gap-4">
        {thumbnailUrl ? (
          <Image
            alt={title}
            className="h-16 w-16 rounded-full object-cover"
            height={64}
            src={thumbnailUrl}
            width={64}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-bold">
            {title.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold">{title}</h3>
            {overallScore !== undefined && (
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-medium ${getScoreBadgeClass(overallScore)}`}
              >
                {overallScore}
              </span>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description || "No description"}
          </p>

          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formatNumber(subscriberCount)} subscribers</span>
            <span>{formatNumber(videoCount)} videos</span>
          </div>

          {matchReason && (
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              {matchReason}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
