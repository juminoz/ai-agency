import Link from "next/link";

interface DataBreadcrumbProps {
  current: string;
}

export function DataBreadcrumb({ current }: DataBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link
        className="transition-colors hover:text-foreground"
        href="/admin/data"
      >
        Data Pipeline
      </Link>
      <span>/</span>
      <span className="font-medium text-foreground">{current}</span>
    </nav>
  );
}
