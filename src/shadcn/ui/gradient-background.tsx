export function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-background to-purple-50/30 -z-10" />
      {children}
    </div>
  );
}
