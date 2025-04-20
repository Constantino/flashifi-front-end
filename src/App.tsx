import './App.css'
import { Headers } from './components/Headers';
import { CrossFlashLoan } from './components/CrossFlashLoan';
import { ThirdwebProvider } from "thirdweb/react";

function App() {

  return (
    <div className="app-wrapper">
      <ThirdwebProvider>

        <Headers />
        <main className="main-content">
          <CrossFlashLoan />
        </main>
      </ThirdwebProvider>
    </div>
  )
}

export default App