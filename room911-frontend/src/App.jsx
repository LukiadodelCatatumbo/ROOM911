import { AccessibilityProvider } from "./context/AccessibilityContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <AccessibilityProvider>
            <AppRoutes />
        </AccessibilityProvider>
    );
}

export default App;