import {
    createPublicClient,
    createWalletClient,
    http,
    parseEther,
    parseGwei,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celoAlfajores } from "viem/chains";
import "dotenv/config"; // use to read private key from environment variable

const PRIVATE_KEY = process.env.PRIVATE_KEY

/**
 * Boilerplate to create a viem client
 */
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});
const walletClient = createWalletClient({
    chain: celoAlfajores, // Celo testnet
    transport: http(),
});

/**
 * Transation type: 0 (0x00)
 * Name: "Legacy"
 * Description: Ethereum legacy transaction
 */
async function demoLegacyTransactionType() {
    console.log(`Initiating legacy transaction...`);
    const transactionHash = await walletClient.sendTransaction({
        account, // Sender
        to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Recipient (illustrative address)
        value: parseEther("0.01"), // 0.01 CELO
        gasPrice: parseGwei("20"), // Special field for legacy transaction type
    });

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
    });
    
    printFormattedTransactionReceipt(transactionReceipt);
}

/**
 * Transaction type: 2 (0x02)
 * Name: "Dynamic fee"
 * Description: Ethereum EIP-1559 transaction
 */
async function demoDynamicFeeTransactionType() {
    console.log(`Initiating dynamic fee (EIP-1559) transaction...`);
    const transactionHash = await walletClient.sendTransaction({
        account, // Sender
        to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Recipient (illustrative address)
        value: parseEther("0.01"), // 0.01 CELO
        maxFeePerGas: parseGwei("10"), // Special field for dynamic fee transaction type (EIP-1559)
        maxPriorityFeePerGas: parseGwei("10"), // Special field for dynamic fee transaction type (EIP-1559)
    });

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
    });
    
    printFormattedTransactionReceipt(transactionReceipt);
}

/**
 * Transaction type: 123 (0x7b)
 * Name: "Dynamic fee"
 * Description: Celo dynamic fee transaction (with custom fee currency)
 */
async function demoFeeCurrencyTransactionType() {
    console.log(`Initiating custom fee currency transaction...`);
    const transactionHash = await walletClient.sendTransaction({
        account, // Sender
        to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Recipient (illustrative address)
        value: parseEther("0.01"), // 0.01 CELO
        feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD fee currency
        maxFeePerGas: parseGwei("10"), // Denominated in the token the fee is paid in
        maxPriorityFeePerGas: parseGwei("10"), // Denominated in the token the fee is paid in
    });

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
    });

    printFormattedTransactionReceipt(transactionReceipt);
}

// /**
//  * Transaction type: 122 (0x7a)
//  * Name: "Celo Denominated Easy Fee Transaction"
//  * Description: Celo dynamic fee transaction (with custom fee currency)
//  */
// async function demoCeloDenominatedFeeCurrencyTransactionType() {
//     console.log(`Initiating Celo denominated fee currency transaction...`);
//     const transactionHash = await walletClient.sendTransaction({
//         account, // Sender
//         to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Recipient (illustrative address)
//         value: parseEther("0.01"), // 0.01 CELO
//         feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD fee currency
//         maxFeePerGas: parseGwei("10"), // Denominated in CELO but paid in the fee currency 
//         maxPriorityFeePerGas: parseGwei("10"), // Denominated in CELO but paid in the fee currency
//         maxFeeInFeeCurrency:  parseGwei("10") // Calculated as maxFeePerGas * gasLimit * conversionRateFromCELOtoToken
//     });

//     const transactionReceipt = await publicClient.waitForTransactionReceipt({
//         hash: transactionHash,
//     });

//     printFormattedTransactionReceipt(transactionReceipt);
// }

function printFormattedTransactionReceipt(transactionReceipt: any) {

    const {
        blockHash,
        blockNumber,
        contractAddress,
        cumulativeGasUsed,
        effectiveGasPrice,
        from,
        gasUsed,
        logs,
        logsBloom,
        status,
        to,
        transactionHash,
        transactionIndex,
        type,
        feeCurrency,
        gatewayFee,
        gatewayFeeRecipient
      } = transactionReceipt;
      
      const filteredTransactionReceipt = {
        type,
        status,
        transactionHash,
        from,
        to
      };

    console.log(`Transaction details:`, filteredTransactionReceipt, `\n`);
}

// Wrap all demos in an async function to await their completion
async function runDemosSequentially() {
    // Run each demo and await its completion
    await demoLegacyTransactionType();
    await demoDynamicFeeTransactionType();
    await demoFeeCurrencyTransactionType();
}

// Run the demos sequentially
runDemosSequentially().catch((err) => {
    // Handle any errors that might occur in the demos
    console.error("An error occurred:", err);
});
