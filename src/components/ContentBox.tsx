import React from 'react';
import { useState, useEffect } from 'react'
import '../App.css'
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Box from '@mui/joy/Box';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Input from '@mui/joy/Input';

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

    const handleChangeChainA = (_: any, value: string | null) => {
        if (value !== null) {
            console.log("chain dropdown1: ", value)
            setChainTo(value === '0' ? '1' : '0')
            setChainFrom(value)

            if (value === '1') {
                console.log('request change of network')
                // console.log("switching to: ", superchainB)
                //switchChain(superchainB)
            }
            if (value === '0') {
                console.log('request change of network')
                // console.log("switching to: ", superchainA)
                //switchChain(superchainA)
            }
        }
    };


    return (
        <div className="swap-container">
            <div className="swap-header">
                <h1>Flash Loan Arbitrage</h1>
                <div className="swap-settings">
                    <button className="icon-button">⚙️</button>
                </div>
            </div>

            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%' }}
            >
                <Input
                    placeholder="Arbitrage contract address 0x000"
                    sx={{
                        width: '100%',
                        backgroundColor: 'var(--surface-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        '&:hover': {
                            borderColor: 'var(--accent-color)',
                        },
                    }}
                />

                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl>
                            <FormLabel sx={{ color: 'var(--text-primary)' }}>From</FormLabel>
                            <Select
                                value={chainFrom}
                                onChange={handleChangeChainA}
                                indicator={<KeyboardArrowDown />}
                                sx={{
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
                                <Option value="0">Devnet 0</Option>
                                <Option value="1">Devnet 1</Option>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl>
                            <FormLabel sx={{ color: 'var(--text-primary)' }}>To</FormLabel>
                            <Select
                                value={chainTo}
                                indicator={<KeyboardArrowDown />}
                                sx={{
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
            </Stack>
        </div>
    )
}
