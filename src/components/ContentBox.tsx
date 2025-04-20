import React from 'react';
import { useState, useEffect } from 'react'
import '../App.css'
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Box from '@mui/joy/Box';

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

export const ContentBox = () => {

    const [fromToken, setFromToken] = useState<Token>(commonTokens[0])
    const [toToken, setToToken] = useState<Token>(commonTokens[1])
    const [amount, setAmount] = useState<string>('')

    const handleSwapTokens = () => {
        const temp = fromToken
        setFromToken(toToken)
        setToToken(temp)
    }

    const [chainFrom, setChainFrom] = useState('0')
    const [chainTo, setChainTo] = useState('1')
    const [isInProgress, setIsInProgress] = useState(false)
    const activeAccount = "";

    const handleChangeChainA = (event: ChangeEvent<HTMLSelectElement>) => {
        // console.log('chain in use: ', chainInUse)
        console.log("chain dropdown1: ", event.target.value)
        let chainToUse = Number(event.target.value);
        setChainTo(chainToUse)
        setChainFrom(chainToUse == 0 ? 1 : 0)
        if (chainFrom == 0 && chainToUse == 1) {
            console.log('request change of network')
            // console.log("switching to: ", superchainB)
            //switchChain(superchainB)
        }
        if (chainFrom == 1 && chainToUse == 0) {
            console.log('request change of network')
            // console.log("switching to: ", superchainA)
            //switchChain(superchainA)
        }

    };

    const handleChangeChainB = (event: ChangeEvent<HTMLSelectElement>) => {
        console.log("chain dropdown2: ", event.target.value)
        let chainToUse = Number(event.target.value);
        setChainTo(chainToUse)
        setChainFrom(chainToUse == 0 ? 1 : 0)
    };

    return (
        <div className="swap-container">
            <div className="swap-header">
                <h1>Flash Loan Arbitrage</h1>
                <div className="swap-settings">
                    <button className="icon-button">⚙️</button>
                </div>
            </div>

            <div className="swap-box">
                {/* <div className="input-box">
                    <div className="input-header">
                        <span>You Pay</span>
                        <span className="balance">Balance: 0.0</span>
                    </div>
                    <div className="input-content">
                        <div className="token-select" onClick={() => { }}>
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
                        <div className="token-select" onClick={() => { }}>
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
                </div> */}

                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl>
                            <FormLabel>From</FormLabel>
                            <Select
                                value={chainFrom}
                                onChange={(_, value) => {
                                    if (value !== null) {
                                        setChainTo(value === '0' ? '1' : '0');
                                        setChainFrom(value);
                                    }
                                }}
                            >
                                <Option value="0">Devnet 0</Option>
                                <Option value="1">Devnet 1</Option>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl>
                            <FormLabel>To</FormLabel>
                            <Select
                                value={chainTo}
                                onChange={(_, value) => {
                                    if (value !== null) {
                                        setChainFrom(value === '0' ? '1' : '0');
                                        setChainTo(value);
                                    }
                                }}
                                disabled
                            >
                                <Option value="0">Devnet 0</Option>
                                <Option value="1">Devnet 1</Option>
                            </Select>
                        </FormControl>
                    </Box>
                </Stack>

                <button className="swap-action-button">
                    Execute Strategy
                </button>
            </div>
        </div>
    )
}
