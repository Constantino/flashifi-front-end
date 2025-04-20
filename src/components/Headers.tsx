import { useState, useEffect } from 'react'
import '../App.css'
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Avatar from '@mui/joy/Avatar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export const Headers = () => {

    const [activeTab, setActiveTab] = useState('simple')
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
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
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </button>
                    <button className="connect-wallet-button">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </header>
    )
}
