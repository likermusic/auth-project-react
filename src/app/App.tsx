import { Button } from "@/shared/ui/button";
import { AppRouter } from "./AppRouter";
import { AppProvider } from "./AppProvider";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
