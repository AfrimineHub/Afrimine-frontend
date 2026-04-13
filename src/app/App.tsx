import { AppProviders } from "./providers";
import { AppRouter } from "./router";

const  App = () => {

  return (
    <AppProviders>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppRouter />
      </div>
    </AppProviders>
  )
}

export default App;
