import './App.css'
import { Headers } from './components/Headers';
import { ContentBox } from './components/ContentBox';
import { ThirdwebProvider } from "thirdweb/react";

function App() {

  return (
    <div className="app-wrapper">
      <ThirdwebProvider>

        <Headers />
        <main className="main-content">
          <ContentBox />
        </main>
      </ThirdwebProvider>
    </div>
  )
}

export default App