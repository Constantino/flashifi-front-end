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
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import Button from '@mui/joy/Button';
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { ethers } from 'ethers';
import { abi as tokenAbi } from '../assets/tokenAbi.json';
import { createThirdwebClient } from "thirdweb";
import OPLogo from '../assets/OPLogo.svg';

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

// interface Token {
//     symbol: string;
//     name: string;
//     logo?: string;
// }

// const commonTokens: Token[] = [
//     { symbol: 'ETH', name: 'Ethereum', logo: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
//     { symbol: 'USDT', name: 'Tether USD', logo: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
//     { symbol: 'USDC', name: 'USD Coin', logo: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
//     { symbol: 'DAI', name: 'Dai Stablecoin', logo: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
// ]

interface FlashLoanEvent {
    flashLoanId: string;
    amount: ethers.BigNumber;
    chainId: ethers.BigNumber;
    userAddress: string;
}

export const CrossFlashLoan = () => {

    const contractHandlerAddress = import.meta.env.VITE_ENVIRONMENT == 'local' ? import.meta.env.VITE_CONTRACT_HANDLER_LOCAL : import.meta.env.VITE_CONTRACT_HANDLER_DEVNET;

    // const [fromToken, setFromToken] = useState<Token>(commonTokens[0])
    // const [toToken, setToToken] = useState<Token>(commonTokens[1])
    // const [amount, setAmount] = useState<string>('')
    const [value, setValue] = useState(0)

    // const handleSwapTokens = () => {
    //     const temp = fromToken
    //     setFromToken(toToken)
    //     setToToken(temp)
    // }

    const [chainFrom, setChainFrom] = useState('0')
    const [chainTo, setChainTo] = useState('1')
    const [isInProgress, setIsInProgress] = useState(false)
    const [advancedFeatures, setAdvancedFeatures] = useState(false);
    const [arbitrageContractAddress, setArbitrageContractAddress] = useState("");

    const switchChain = useSwitchActiveWalletChain();
    const activeAccount = useActiveAccount();
    const address = activeAccount?.address;
    const chainInUse = useActiveWalletChain()

    const [loanAmountReceived, setLoanAmountReceived] = useState<FlashLoanEvent>({
        flashLoanId: '',
        amount: ethers.BigNumber.from('0'),
        chainId: ethers.BigNumber.from('0'),
        userAddress: ''
    });
    const [ethSold, setEthSold] = useState<FlashLoanEvent>({
        flashLoanId: '',
        amount: ethers.BigNumber.from('0'),
        chainId: ethers.BigNumber.from('0'),
        userAddress: ''
    });
    const [ethBought, setEthBought] = useState<FlashLoanEvent>({
        flashLoanId: '',
        amount: ethers.BigNumber.from('0'),
        chainId: ethers.BigNumber.from('0'),
        userAddress: ''
    });
    const [loanAmountRepaid, setLoanAmountRepaid] = useState<FlashLoanEvent>({
        flashLoanId: '',
        amount: ethers.BigNumber.from('0'),
        chainId: ethers.BigNumber.from('0'),
        userAddress: ''
    });
    const [profitSent, setProfitSent] = useState<FlashLoanEvent>({
        flashLoanId: '',
        amount: ethers.BigNumber.from('0'),
        chainId: ethers.BigNumber.from('0'),
        userAddress: ''
    });

    const [isLoanReceived, setIsLoanReceived] = useState(false)
    const [isEthSold, setIsEthSold] = useState(false)
    const [isEthBought, setIsEthBought] = useState(false)
    const [isLoanRepaid, setIsLoanRepaid] = useState(false)
    const [isProfitSent, setIsProfitSent] = useState(false)

    const client = createThirdwebClient({
        clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    });

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

    useEffect(() => {

        setIsInProgress(false)
        setValue(0)
        setIsLoanReceived(false)
        setIsEthSold(false)
        setIsEthBought(false)
        setIsLoanRepaid(false)
        setIsProfitSent(false)
        chainFrom == '0' ? switchChain(superchainA) : switchChain(superchainB)

    }, [address])

    const executeFlashLoan = async () => {

        setValue(0);
        setIsLoanReceived(false)
        setIsEthSold(false)
        setIsEthBought(false)
        setIsLoanRepaid(false)
        setIsProfitSent(false)
        setIsInProgress(true)

        await callContract()
    }

    useEffect(() => {
        console.log("useEffect loanAmountReceived called")
        console.log("prev progress: ", value)
        if (isLoanReceived && !isEthSold && !isEthBought && !isLoanRepaid && !isProfitSent) {
            console.log("new progress: ", 20)
            setValue(20)
        }
    }, [isLoanReceived])

    useEffect(() => {
        console.log("useEffect ethSold called")
        console.log("prev progress: ", value)
        if (isEthSold && !isEthBought && !isLoanRepaid && !isProfitSent) {
            console.log("new progress: ", 40)
            setValue(40)
        }
    }, [isEthSold])

    useEffect(() => {
        console.log("useEffect ethBought called")
        console.log("prev progress: ", value)
        if (isEthBought && !isLoanRepaid && !isProfitSent) {
            console.log("new progress: ", 60)
            setValue(60)
        }
    }, [isEthBought])

    useEffect(() => {
        console.log("useEffect loanAmountRepaid called")
        console.log("prev progress: ", value)
        if (isLoanRepaid && !isProfitSent) {
            console.log("new progress: ", 80)
            setValue(80)
        }
    }, [isLoanRepaid])

    useEffect(() => {
        console.log("useEffect profitSent called")
        console.log("useEffect profitSent userAddress: ", profitSent)
        console.log("prev progress: ", value)
        if (isProfitSent) {
            setValue(100)
            console.log("new progress: ", 100)
            setIsInProgress(false)
        }
    }, [isProfitSent])


    const IsAddressChecksumGood = (address: string) => {
        if (address === undefined) {
            return false
        }
        if (!ethers.utils.isAddress(address)) {
            return false
        }
        try {
            const checksumAddress = ethers.utils.getAddress(address)
            const icap = ethers.utils.getIcapAddress(address);
            console.log("checksum address: ", checksumAddress);
            console.log("icap address: ", icap);
            return true;
        } catch (error) {
            console.log("error: ", error)
            return false;
        }

    }


    const getSigner = async (chain: any) => {
        if (!activeAccount) {
            throw new Error("Active account is undefined");
        }
        const signer = await ethers5Adapter.signer.toEthers({ client, chain: chain, account: activeAccount });
        console.log("signer: ", signer);
        return signer;
    }

    const suscribeToChainEvents = (connectedContractA: any, connectedContractB: any) => {
        let flashLoanRecievedFilter = connectedContractA.filters.flashLoanRecieved(null, null, null, address);

        connectedContractA.on(flashLoanRecievedFilter, (flashLoanId: any, loanAmountRecieved: any, chainId: any, userAddress: any) => {

            setLoanAmountReceived({ flashLoanId: flashLoanId, amount: loanAmountRecieved, chainId: chainId, userAddress: userAddress })
            setIsLoanReceived(true)
            console.log('loan amount received: ', { flashLoanId: flashLoanId, amount: loanAmountRecieved, chainId: chainId, userAddress: userAddress })

        })

        let soldEthFilter = connectedContractB.filters.soldEth(null, null, null, address);
        connectedContractB.on(soldEthFilter, (flashLoanId: any, amount: any, chainId: any, userAddress: any) => {
            setEthSold({ flashLoanId: flashLoanId, amount: amount, chainId: chainId, userAddress: userAddress })
            setIsEthSold(true)
            console.log('sold eth: ', { flashLoanId: flashLoanId, amount: amount, chainId: chainId, userAddress: userAddress });
        })


        let boughtEthFilter = connectedContractB.filters.boughtEth(null, null, null, address);
        connectedContractB.on(boughtEthFilter, (flashLoanId: any, amount: any, chainId: any, userAddress: any) => {
            setEthBought({ flashLoanId: flashLoanId, amount: amount, chainId: chainId, userAddress: userAddress })
            setIsEthBought(true)
            console.log('bought eth: ', { flashLoanId: flashLoanId, amount: amount, chainId: chainId, userAddress: userAddress });
        })


        let flashLoanRepayedFilter = connectedContractA.filters.flashLoanRepayed(null, null, null, address);
        connectedContractA.on(flashLoanRepayedFilter, (flashLoanId: any, loanAmount: any, chainId: any, userAddress: any) => {
            setLoanAmountRepaid({ flashLoanId: flashLoanId, amount: loanAmount, chainId: chainId, userAddress: userAddress })
            setIsLoanRepaid(true)
            console.log('Flash loan repaid: ', { flashLoanId: flashLoanId, amount: loanAmount, chainId: chainId, userAddress: userAddress });
        })

        let sentProfitFilter = connectedContractA.filters.sentProfit(null, null, null, address);
        connectedContractA.on(sentProfitFilter, (flashLoanId: any, profit: any, chainId: any, userAddress: any) => {
            setProfitSent({ flashLoanId: flashLoanId, amount: profit, chainId: chainId, userAddress: userAddress })
            setIsProfitSent(true)
            console.log('profit sent: ', { flashLoanId: flashLoanId, amount: profit, chainId: chainId, userAddress: userAddress });
        })
    }

    const callContract = async () => {

        let willUseCustomArbitrageContract = false;
        if (arbitrageContractAddress != "") {
            console.log("arbitrageContractAddress: ", arbitrageContractAddress)
            willUseCustomArbitrageContract = IsAddressChecksumGood(arbitrageContractAddress)
            if (!willUseCustomArbitrageContract) {
                alert("Invalid address for arbitrage contract")
                setValue(0);
                setIsInProgress(false);
                return;
            }
        }

        const signerA = await getSigner(superchainA);
        const signerB = await getSigner(superchainB);

        console.log("contract handler address: ", contractHandlerAddress)

        const connectedContractA = new ethers.Contract(contractHandlerAddress, tokenAbi, signerA);
        const connectedContractB = new ethers.Contract(contractHandlerAddress, tokenAbi, signerB);


        console.log(connectedContractA)
        console.log(connectedContractB)

        setValue(0);

        if (!chainInUse) {
            throw new Error("chainInUse is undefined");
        }

        if (chainInUse.id == superchainA.id) {
            try {
                if (willUseCustomArbitrageContract) {
                    await connectedContractA.callFlashLoanHandler(superchainB.id, arbitrageContractAddress).then(() => {
                        suscribeToChainEvents(connectedContractA, connectedContractB);
                    });
                } else {
                    await connectedContractA.callFlashLoanHandler(superchainB.id).then(() => {
                        suscribeToChainEvents(connectedContractA, connectedContractB);
                    });
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("An unknown error occurred");
                }
                setValue(0);
                setIsInProgress(false);
            }

        } else {
            try {
                if (willUseCustomArbitrageContract) {
                    await connectedContractB.callFlashLoanHandler(superchainA.id, arbitrageContractAddress).then(() => {
                        suscribeToChainEvents(connectedContractA, connectedContractB);
                    });
                } else {
                    await connectedContractB.callFlashLoanHandler(superchainA.id).then(() => {
                        suscribeToChainEvents(connectedContractA, connectedContractB);
                    });
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("An unknown error occurred");
                }
                setValue(0);
                setIsInProgress(false);
            }

        }

        console.log('contract called')
    }

    return (
        <div className="swap-container">
            <div className="swap-header">
                <h1>Super Flash Loan Arbitrage</h1>
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
                    <Typography
                        level="body-sm"
                        textColor="common.white"
                        sx={{ fontWeight: 'xl', mixBlendMode: 'difference' }}
                    >

                        Powered by Optimism Superchain Interop
                    </Typography>
                    <img src={OPLogo} />
                </Stack>
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
                                disabled={isInProgress || !activeAccount}
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
                            sx={{ width: '100%' }
                            }>

                            <Input
                                placeholder="Arbitrage contract address 0x00...000"
                                value={arbitrageContractAddress}
                                onChange={(e) => setArbitrageContractAddress(e.target.value)}
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

                <Button
                    className="swap-action-button"
                    onClick={() => executeFlashLoan()}
                    loading={isInProgress}
                    disabled={!activeAccount}
                >
                    Execute Strategy
                </Button>

                <Box sx={{ width: '100%' }}>
                    <LinearProgress
                        determinate
                        variant="solid"
                        size="sm"
                        thickness={24}
                        value={Number(value)}
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
                            {`${Math.round(Number(value))}%`}
                        </Typography>
                    </LinearProgress>
                    {
                        value >= 10 &&
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

                    }
                    {
                        value >= 100 / 5 * 1 &&
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
                                Borrowing {ethers.utils.formatEther(loanAmountReceived.amount)} ETH on {loanAmountReceived.chainId.toNumber()}
                            </Typography>
                        </Stack>
                    }
                    {
                        value >= 100 / 5 * 2 &&
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
                                Selling {ethers.utils.formatEther(ethSold.amount)} ETH for USDC on {ethSold.chainId.toNumber()}
                            </Typography>
                        </Stack>
                    }
                    {
                        value >= 100 / 5 * 3 &&
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
                                Buying {ethers.utils.formatEther(ethBought.amount)} ETH for USDC on {ethBought.chainId.toNumber()}
                            </Typography>
                        </Stack>
                    }
                    {
                        value >= 100 / 5 * 4 &&
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
                                Repaying loan of {ethers.utils.formatEther(loanAmountRepaid.amount)} ETH on Chain {loanAmountRepaid.chainId.toNumber()}
                            </Typography>
                        </Stack>
                    }
                    {
                        value == 100 &&
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
                                Review your profit of {ethers.utils.formatEther(profitSent.amount)} ETH on your wallet account
                            </Typography>
                        </Stack>
                    }
                </Box>

            </Stack >
        </div >
    )
}
