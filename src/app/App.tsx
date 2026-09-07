import { AppProviders } from "./providers";
import { AppRouter } from "./router";
import { AppErrorBoundary } from "./AppErrorBoundary";

const App = () => {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AppRouter />
        </div>
      </AppProviders>
    </AppErrorBoundary>
  );
};

export default App;
