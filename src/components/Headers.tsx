import { useState, useEffect } from 'react'
import '../App.css'
// import Select, { selectClasses } from '@mui/joy/Select';
// import Option from '@mui/joy/Option';
// import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// import Avatar from '@mui/joy/Avatar';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Tooltip from '@mui/joy/Tooltip';
import { ConnectButton, darkTheme, lightTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { NavLink } from "react-router-dom";

export const Headers = () => {

    const [activeTab, setActiveTab] = useState('simple')
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const client = createThirdwebClient({
        clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    });

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <img src="/flashifi_logo.png" alt="logo" />
                    <span className="logo-text">FlashiFi</span>
                </div>
                <nav className="main-nav">
                    <NavLink key={"super-flash-loan"} to={"super-flash-loan"}>
                        <button className={`nav-button ${activeTab === 'super' ? 'active' : ''}`} onClick={() => setActiveTab('super')}>
                            ⭐ Super Flash Loan
                        </button>
                    </NavLink>
                    <NavLink key={"single-flash-loan"} to={"single-flash-loan"}>
                        <button className={`nav-button ${activeTab === 'single' ? 'active' : ''}`} onClick={() => setActiveTab('single')}>
                            🔗 Single Flash Loan
                        </button>
                    </NavLink>
                    <Tooltip title="Coming soon..." variant="solid">
                        <button disabled className={`nav-button ${activeTab === 'strategies' ? 'active' : ''}`} onClick={() => setActiveTab('strategies')}>
                            🧠 Strategies
                        </button>
                    </Tooltip>
                </nav>
                {/* 
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
                </Select> */}
                <div className="header-actions">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </button>
                    {/* <button className="connect-wallet-button">
                        Connect Wallet
                    </button> */}
                    {/* chains={[superchainA, superchainB]} */}
                    <ConnectButton theme={theme === "dark" ? darkTheme({
                        colors: {
                            primaryButtonBg: 'var(--accent-gradient)',
                            primaryButtonText: 'var(--text-primary)',
                        }
                    }) : lightTheme({
                        colors: {
                            primaryButtonBg: 'var(--accent-gradient)',
                            primaryButtonText: 'white',
                        }
                    })
                    } client={client} />
                </div>
            </div>
        </header>
    )
}
