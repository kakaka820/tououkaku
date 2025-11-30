// client/src/App.tsx
// ページ遷移担当

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomerOrderPage from "@/pages/CustomerOrderPage";
import StaffDashboard from "@/pages/StaffDashboard";
import KitchenDisplay from "@/pages/KitchenDisplay";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import "@/lib/i18n";



function Router() {
  return (
    <Switch>
      <Route path="/order/:tableNumber">
        {(params) => (
          <CustomerOrderPage tableNumber={parseInt(params.tableNumber) || 1} />
        )}
      </Route>
      <Route path="/staff" component={StaffDashboard} />
      <Route path="/kitchen" component={KitchenDisplay} />
      <Route path="/history">{() => <OrderHistoryPage />}</Route>
      <Route>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mt-2 text-muted-foreground">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
