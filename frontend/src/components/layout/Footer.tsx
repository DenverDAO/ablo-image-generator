export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ablo Image Generator. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
