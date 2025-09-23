const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="glass-panel p-8 rounded-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin animate-reverse" style={{ animationDuration: '0.75s' }} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">Loading Universe</h3>
            <p className="text-sm text-muted-foreground mt-1">Fetching asteroid data from NASA...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;