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
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { defineChain } from "thirdweb/chains";
import { useActiveAccount, useActiveWalletConnectionStatus, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";

const superchainA = import.meta.env.VITE_ENVIRONMENT == 'local' ? defineChain(
    {
        id: 901,
        name: "Supersim Chain A",
        rpc: "http://127.0.0.1:9545",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
    }
) :
    defineChain(
        {
            id: 420120000,
            name: "interop-alpha-0",
            rpc: "https://interop-alpha-0.optimism.io",
            nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
            },
        }
    )

const superchainB = import.meta.env.VITE_ENVIRONMENT == 'local' ? defineChain(
    {
        id: 902,
        name: "Supersim Chain B",
        rpc: "http://127.0.0.1:9546",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
    }
) :
    defineChain(
        {
            id: 420120001,
            name: "interop-alpha-1",
            rpc: "https://interop-alpha-1.optimism.io",
            nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
            },
        }
    )

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
    const [advancedFeatures, setAdvancedFeatures] = useState(false);
    const [ArbitrageContractAddress, setArbitrageContractAddress] = useState("");
    const switchChain = useSwitchActiveWalletChain();

    const handleChangeChainA = (_: any, value: string | null) => {
        if (value !== null) {
            console.log("chain dropdown1: ", value)
            setChainTo(value === '0' ? '1' : '0')
            setChainFrom(value)

            if (value === '1') {
                console.log('request change of network')
                console.log("switching to: ", superchainB)
                switchChain(superchainB)
            }
            if (value === '0') {
                console.log('request change of network')
                console.log("switching to: ", superchainA)
                switchChain(superchainA)
            }
        }
    };

    const handleAdvancedFeatures = () => {
        if (advancedFeatures) {
            setArbitrageContractAddress("")
        }
        setAdvancedFeatures(!advancedFeatures)
    }


    return (
        <div className="swap-container">
            <div className="swap-header">
                <h1>Flash Loan Arbitrage</h1>
                <div className="swap-settings">
                    <button onClick={handleAdvancedFeatures} className="icon-button">⚙️</button>
                </div>
            </div>

            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%' }}
            >

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

                {
                    advancedFeatures &&
                    <>
                        <Stack
                            direction="row"
                            justifyContent="left"
                            spacing={1}
                            sx={{ width: '100%', paddingTop: "10%" }
                            }>

                            <Input
                                placeholder="Arbitrage contract address 0x00...000"
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
                            <button onClick={handleAdvancedFeatures} className="icon-button">
                                <ClearIcon />
                            </button>
                        </Stack>


                    </>
                }

                <button className="swap-action-button" style={{ marginTop: "10%" }}>
                    Execute Strategy
                </button>

                <Box sx={{ width: '100%' }}>
                    <LinearProgress
                        determinate
                        variant="solid"
                        size="sm"
                        thickness={24}
                        value={Number(10)}
                        sx={{
                            backgroundColor: 'var(--primary-bg)',
                            color: 'var(--linear-bar-color)',
                            textColor: 'var(--text-primary)',
                            '--LinearProgress-radius': '20px',
                            '--LinearProgress-thickness': '24px',
                        }}
                    >
                        <Typography
                            level="body-xs"
                            textColor="common.white"
                            sx={{ fontWeight: 'xl', mixBlendMode: 'difference' }}
                        >
                            {`${Math.round(Number(50))}%`}
                        </Typography>
                    </LinearProgress>

                    <Stack
                        direction="row"
                        justifyContent="left"
                        spacing={2}
                        sx={{ width: '100%', paddingTop: "10%" }
                        }>

                        <Typography >
                            ⚡
                        </Typography>
                        <Typography sx={{ color: 'var(--text-primary)' }} >
                            Initiating flash loan
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="left"
                        spacing={2}
                        sx={{ width: '100%', paddingTop: "2%" }
                        }>

                        <Typography >
                            ✅
                        </Typography>
                        <Typography sx={{ color: 'var(--text-primary)' }} >
                            Borrowing {1.5} ETH for USDC on Devnet 0
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="left"
                        spacing={2}
                        sx={{ width: '100%', paddingTop: "2%" }
                        }>

                        <Typography >
                            ✅
                        </Typography>
                        <Typography sx={{ color: 'var(--text-primary)' }} >
                            Selling {1.5} ETH for USDC on Devnet 0
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="left"
                        spacing={2}
                        sx={{ width: '100%', paddingTop: "2%" }
                        }>

                        <Typography >
                            ✅
                        </Typography>
                        <Typography sx={{ color: 'var(--text-primary)' }} >
                            Buying {1.5} ETH for USDC on Devnet 0
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="left"
                        spacing={2}
                        sx={{ width: '100%', paddingTop: "2%" }
                        }>

                        <Typography >
                            ✅
                        </Typography>
                        <Typography sx={{ color: 'var(--text-primary)' }} >
                            Repaying loan of {1.5} ETH Devnet 0
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="left"
                        spacing={2}
                        sx={{ width: '100%', paddingTop: "2%" }
                        }>

                        <Typography >
                            🎉
                        </Typography>
                        <Typography sx={{ color: 'var(--text-primary)' }} >
                            Rewiew your profit of {0.1} ETH on you wallet
                        </Typography>
                    </Stack>
                </Box>

            </Stack >
        </div >
    )
}
