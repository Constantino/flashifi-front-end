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
import { defineChain, sepolia } from "thirdweb/chains";
import { useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import Button from '@mui/joy/Button';
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { ethers } from 'ethers';
import { abi as tokenAbi } from '../assets/tokenAbi.json';
import SimpleFlashLoanABI from '../assets/SimpleFlashLoan.abi.json';
import { createThirdwebClient } from "thirdweb";
import Tooltip from '@mui/joy/Tooltip';
import FormHelperText from '@mui/joy/FormHelperText';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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

const explorerUrl = {
    sepolia: "https://sepolia.etherscan.io/tx/",
    optimism: "https://optimistic.etherscan.io/tx/",
}

export const SingleFlashLoan = () => {

    const contractHandlerAddress = import.meta.env.VITE_ENVIRONMENT == 'local' ? import.meta.env.VITE_CONTRACT_HANDLER_LOCAL : import.meta.env.VITE_CONTRACT_HANDLER_DEVNET;

    const [value, setValue] = useState(0)
    const [isInProgress, setIsInProgress] = useState(false)
    const [flashLoanContractHandlerAddress, setFlashLoanContractHandlerAddress] = useState("0xe0501A11247f59F5b647E29F037E48F2ff3F9383");
    const [tokenContractAddress, setTokenContractAddress] = useState("0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8");
    const [amountToBorrow, setAmountToBorrow] = useState(0);
    const feePercentage = 0.09;
    const [amountOfFee, setAmountOfFee] = useState(0);
    const [arbitrageContractAddress, setArbitrageContractAddress] = useState("");

    const [amountError, setAmountError] = useState<string>('');
    const [tokenAddressError, setTokenAddressError] = useState<string>('');
    const [flashLoanContractAddressError, setFlashLoanContractAddressError] = useState<string>('');
    const [arbitrageContractAddressError, setArbitrageContractAddressError] = useState<string>('');

    const [txHash, setTxHash] = useState<string>('second');
    const [txHashCopied, setTxHashCopied] = useState<boolean>(false);

    const switchChain = useSwitchActiveWalletChain();
    const activeAccount = useActiveAccount();
    const address = activeAccount?.address;
    const chainInUse = useActiveWalletChain()

    const client = createThirdwebClient({
        clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    });

    useEffect(() => {

        setIsInProgress(false)
        setValue(0)
        // chainFrom == '0' ? switchChain(superchainA) : switchChain(superchainB)
        switchChain(sepolia);

    }, [address])

    useEffect(() => {

        setAmountOfFee(amountToBorrow * feePercentage);

    }, [amountToBorrow])

    const executeFlashLoan = async () => {

        setValue(0);
        setIsInProgress(true)

        await callSimpleFlashLoan()
    }


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

    const callSimpleFlashLoan = async () => {
        const signer = await getSigner(sepolia);
        const connectedContract = new ethers.Contract(flashLoanContractHandlerAddress, SimpleFlashLoanABI, signer);
        const tx = await connectedContract.fn_RequestFlashLoan(
            tokenContractAddress,
            amountToBorrow
        )

        const result = await tx.wait();

        console.log("result: ", result);
        setTxHash(result.transactionHash);

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let isThereAnError = false;
        if (flashLoanContractHandlerAddress === "") {
            setFlashLoanContractAddressError('Please enter a valid flash loan handler address');
            isThereAnError = true;
        } else {
            if (!IsAddressChecksumGood(flashLoanContractHandlerAddress)) {
                setFlashLoanContractAddressError('Please enter a valid flash loan handler address');
                isThereAnError = true;
            }
        }
        // if (tokenContractAddress === "") {
        //     setTokenAddressError('Please enter a valid token contract address');
        //     isThereAnError = true;
        // } else {
        //     if (!IsAddressChecksumGood(tokenContractAddress)) {
        //         setTokenAddressError('Please enter a valid token contract address');
        //         isThereAnError = true;
        //     }
        // }
        if (!amountToBorrow || amountToBorrow <= 0) {
            setAmountError('Please enter a valid amount to borrow');
            isThereAnError = true;
        }
        // if (arbitrageContractAddress === "") {
        //     setArbitrageContractAddressError('Please enter a valid arbitrage contract address');
        //     isThereAnError = true;
        // } else {
        //     if (!IsAddressChecksumGood(arbitrageContractAddress)) {
        //         setArbitrageContractAddressError('Please enter a valid arbitrage contract address');
        //         isThereAnError = true;
        //     }
        // }

        if (isThereAnError) {
            return;
        }

        // alert("execute flash loan");
        const txResult = await callSimpleFlashLoan();
        console.log("txResult: ", txResult);
        setValue(100);
    };

    const shortenTxHash = (txHash: string): string => {
        if (!txHash || txHash.length <= 10) return txHash; // Return as is if too short
        const halfLength = Math.floor(txHash.length / 2);
        return `${txHash.slice(0, halfLength / 2)}...${txHash.slice(-halfLength / 2)}`;
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard:', text);
                setTxHashCopied(true);
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
            });
    }

    return (
        <div className="swap-container">
            <div className="swap-header">
                <h1>Single Flash Loan Arbitrage</h1>
            </div>

            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%' }}
            >

                <FormControl
                    error={!!amountError}
                    sx={{
                        width: '100%',
                    }}
                >
                    <FormLabel
                        sx={{
                            color: 'var(--text-primary)',
                        }}
                    >
                        Flash Loan handler contract address
                    </FormLabel>
                    <Tooltip title="This is the contract that will handle the loan, arbitrage logic and profit." variant="solid">
                        <Input
                            error={!!amountError}
                            required
                            placeholder="0x00...000"
                            value={flashLoanContractHandlerAddress}
                            onChange={(e) => setFlashLoanContractHandlerAddress(e.target.value)}
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
                    </Tooltip>
                    {flashLoanContractAddressError && (
                        <FormHelperText sx={{ color: 'var(--accent-color)' }}>
                            {flashLoanContractAddressError}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl
                    sx={{
                        width: '100%',
                    }}
                >
                    <FormLabel
                        sx={{
                            color: 'var(--text-primary)',
                        }}
                    >
                        Token to borrow
                    </FormLabel>
                    <Tooltip title="USDC contract address. More coming soon." variant="solid">
                        <span style={{ width: '100%' }}>
                            <Input
                                placeholder="Token contract address 0x00...000"
                                value={tokenContractAddress}
                                onChange={(e) => {
                                    setTokenContractAddress(e.target.value);
                                    setAmountError('');
                                }
                                }
                                disabled
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
                        </span>
                    </Tooltip>
                </FormControl>

                <FormControl
                    error={!!amountError}
                    sx={{
                        width: '100%',
                    }}
                >
                    <FormLabel
                        sx={{
                            color: 'var(--text-primary)',
                        }}
                    >
                        Amount to borrow
                    </FormLabel>
                    <Input
                        error={!!amountError}
                        required
                        type="number"
                        placeholder="Amount to borrow"
                        value={amountToBorrow === 0 ? "" : amountToBorrow}
                        onChange={(e) => {
                            setAmountToBorrow(Number(e.target.value));
                            setAmountError('');
                        }}
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
                    {amountError && (
                        <FormHelperText sx={{ color: 'var(--accent-color)' }}>
                            {amountError}
                        </FormHelperText>
                    )}
                </FormControl>
                <Tooltip title="Custom arbitrage contract coming soon." variant="solid">
                    <span style={{ width: '100%' }}>
                        <Input
                            placeholder="Arbitrage contract address 0x00...000"
                            value={arbitrageContractAddress}
                            onChange={(e) => setArbitrageContractAddress(e.target.value)}
                            disabled
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
                    </span>
                </Tooltip>

                <div className="rate-info">
                    <div className="rate-row">
                        <Typography
                            level="body-xs"
                            textColor="common.white"
                            sx={{ fontWeight: 'xl', mixBlendMode: 'difference' }}
                        >
                            Fee: {feePercentage * 100} %
                        </Typography>
                    </div>
                    <div className="rate-row">
                        <Typography
                            level="body-xs"
                            textColor="common.white"
                            sx={{ fontWeight: 'xl', mixBlendMode: 'difference' }}
                        >
                            Fee: {amountOfFee / 1e6} USDC
                        </Typography>
                    </div>
                </div>


                <Button
                    type='submit'
                    className="swap-action-button"
                    onClick={handleSubmit}
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
                        value >= 100 / 4 * 1 &&
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
                                Borrowing {amountToBorrow / 1e6} USDC
                            </Typography>
                        </Stack>
                    }
                    {
                        value >= 100 / 4 * 2 &&
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
                                Executing Arbitrage logic
                            </Typography>
                        </Stack>
                    }
                    {
                        value >= 100 / 4 * 3 &&
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
                                Repaying loan of {amountToBorrow / 1e6} USDC
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
                            <Typography sx={{ color: 'var(--text-primary)' }}>
                                Review your tx:
                            </Typography>
                            <Typography sx={{ color: 'var(--text-primary)' }} >

                                <a href={`${explorerUrl[chainInUse?.id == 11155111 ? 'sepolia' : 'optimism']}${txHash}`} target="_blank" rel="noopener noreferrer">
                                    {shortenTxHash(txHash)}
                                </a>

                            </Typography>
                            <Tooltip title={txHashCopied ? "Copied!" : "Copy to clipboard"} variant="solid">
                                <ContentCopyIcon
                                    onClick={() => handleCopy(txHash)}
                                    sx={{
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Tooltip>
                        </Stack>
                    }
                </Box>

            </Stack >
        </div >
    )
}
