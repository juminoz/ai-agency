import { Button } from "@repo/ui/components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">AI Agency</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Monorepo powered by Turborepo, Next.js &amp; React
        </p>
      </div>
      <div className="flex gap-4">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </main>
  );
}
