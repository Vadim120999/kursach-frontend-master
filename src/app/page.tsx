import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Task Management App</h1>
        <p className="text-muted-foreground">Manage your tasks efficiently</p>
        <div className="space-x-4">
          <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Login
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}