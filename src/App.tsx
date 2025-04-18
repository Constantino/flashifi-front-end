import { useState } from 'react'
import './App.css'
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Avatar from '@mui/joy/Avatar';

interface Token {
  symbol: string;
  name: string;
  logo?: string;
}

const commonTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', logo: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
  { symbol: 'USDT', name: 'Tether USD', logo: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
  { symbol: 'USDC', name: 'USD Coin', logo: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
  { symbol: 'DAI', name: 'Dai Stablecoin', logo: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
]

function App() {
  const [fromToken, setFromToken] = useState<Token>(commonTokens[0])
  const [toToken, setToToken] = useState<Token>(commonTokens[1])
  const [amount, setAmount] = useState<string>('')
  const [activeTab, setActiveTab] = useState('simple')

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src="/flashifi_logo.png" alt="logo" />
            <span className="logo-text">FlashiFi</span>
          </div>
          <nav className="main-nav">
            <button className={`nav-button ${activeTab === 'simple' ? 'active' : ''}`} onClick={() => setActiveTab('simple')}>
              Flash Loan Arbitrage
            </button>
            <button className={`nav-button ${activeTab === 'pro' ? 'active' : ''}`} onClick={() => setActiveTab('pro')}>
              Strategies
            </button>
          </nav>

          <Select
            defaultValue='ethereum'
            placeholder="Select network"
            indicator={<KeyboardArrowDown />}
            sx={{
              width: 240,
              backgroundColor: 'var(--surface-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              '&:hover': {
                backgroundColor: 'var(--surface-bg)',
                borderColor: 'var(--accent-color)',
              },
              [`& .${selectClasses.indicator}`]: {
                transition: '0.2s',
                [`&.${selectClasses.expanded}`]: {
                  transform: 'rotate(-180deg)',
                },
              },
              
            }}
          >
          <Option value="ethereum" >Ethereum</Option>
          <Option value="sepolia" >Sepolia</Option>
          <Option value="alpha0" >Superchain Alpha 0</Option>
          <Option value="alpha1" >Superchain Alpha 1</Option>
          </Select>
          <div className="header-actions">
            <button className="connect-wallet-button">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="swap-container">
          <div className="swap-header">
            <h1>Swap</h1>
            <div className="swap-settings">
              <button className="icon-button">⚙️</button>
            </div>
          </div>
          
          <div className="swap-box">
            <div className="input-box">
              <div className="input-header">
                <span>You Pay</span>
                <span className="balance">Balance: 0.0</span>
              </div>
              <div className="input-content">
                <div className="token-select" onClick={() => {}}>
                  <img src={fromToken.logo} alt={fromToken.symbol} className="token-logo" />
                  <span>{fromToken.symbol}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <button className="swap-button" onClick={handleSwapTokens}>
              ⇅
            </button>

            <div className="input-box">
              <div className="input-header">
                <span>You Receive</span>
                <span className="balance">Balance: 0.0</span>
              </div>
              <div className="input-content">
                <div className="token-select" onClick={() => {}}>
                  <img src={toToken.logo} alt={toToken.symbol} className="token-logo" />
                  <span>{toToken.symbol}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  disabled
                  value=""
                />
              </div>
            </div>

            <div className="rate-info">
              <div className="rate-row">
                <span>Rate</span>
                <span>1 {fromToken.symbol} = 1,800.54 {toToken.symbol}</span>
              </div>
            </div>

            <button className="swap-action-button">
              Swap
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
