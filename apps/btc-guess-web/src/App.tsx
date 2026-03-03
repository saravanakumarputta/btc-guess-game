import "./App.css";
import { BtcPriceCard } from "@/features/btc-price";

function App() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <BtcPriceCard />
    </main>
  );
}

export default App;
