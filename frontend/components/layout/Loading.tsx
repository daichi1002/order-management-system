export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-background">
    <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-16 w-16" />
    <p className="mt-4 text-primary-foreground">Loading...</p>
  </div>
);
