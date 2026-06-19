import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved. Try
        browsing our tools instead.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tools">Browse tools</Link>
        </Button>
      </div>
    </div>
  );
}
