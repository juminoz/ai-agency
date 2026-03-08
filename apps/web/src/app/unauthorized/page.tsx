import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to access this page. Admin privileges
          are required.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            href="/dashboard"
          >
            Go to Dashboard
          </Link>
          <Link
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            href="/"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
