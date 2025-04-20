import './App.css'
import { Headers } from './components/Headers';
import { CrossFlashLoan } from './components/CrossFlashLoan';
import { ThirdwebProvider } from "thirdweb/react";
import { Routes, Route } from "react-router-dom";
import { SingleFlashLoan } from './components/SingleFlashLoan';

function App() {

  return (
    <div className="app-wrapper">
      <ThirdwebProvider>

        <Headers />
        <main className="main-content">
          <Routes>
            <Route path="/*" element={<CrossFlashLoan />} />
            <Route path="/super-flash-loan" element={<CrossFlashLoan />} />
            <Route path="/single-flash-loan" element={<SingleFlashLoan />} />
          </Routes>
        </main>
      </ThirdwebProvider>
    </div>
  )
}

export default App