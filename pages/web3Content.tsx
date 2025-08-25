import { parseEther } from "viem";
import { Button, message } from "antd";
import {
  createConfig,
  http,
  useReadContract,
  useWriteContract,
  useWatchContractEvent
} from "wagmi";
import {
  Mainnet,
  WagmiWeb3ConfigProvider,
  MetaMask,
  WalletConnect,
  Polygon,
  Sepolia,
  Hardhat
} from "@ant-design/web3-wagmi";
import {
  Address,
  NFTCard,
  Connector,
  ConnectButton,
  useAccount,
  useProvider
} from "@ant-design/web3";
import { mainnet, polygon, sepolia, hardhat} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
//配置
const config = createConfig({
  chains: [mainnet, sepolia, polygon,hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(), // Replace with your own RPC URL
    [hardhat.id]: http("localhost:8545"), // Replace with your own RPC URL
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "bf406776b7a3f89c69a68fa1567fa6f8",
      showQrModal: false,
    }),
  ],
});
//合约地址
const contractInfo = [
  {
    id: 1,
    name: "Ethereum",
    contractAddress: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",

  }, {
    id: 5,
    name: "Sepolia",
    contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c",
  }, {
    id: 137,
    name: "Polygon",
    contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c",
  },{
    id:hardhat.id,
    name: "Hardhat",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  }
]
//组件
const CallTest = () => {
  const { account } = useAccount();
  const { chain } = useProvider();
  const result = useReadContract({
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutiability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }]
      }
    ],
    address: contractInfo.find(item => item.id === chain?.id)
      ?.contractAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });
  const { writeContract } = useWriteContract();
  useWatchContractEvent({
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Minted",
        type: "event",
      },
    ],
    eventName: "Minted",
    onLogs() {
      message.success("new minted!");
    },
  });

  return (
    <div>
      持有NFT数量:{result.data?.toString()}
      <button onClick={() => {
        writeContract(
          {
            abi: [
              {
                type: "function",
                name: "mint",
                stateMutability: "payable",
                inputs: [
                  {
                    internalType: "uint256",
                    name: "quantity",
                    type: "uint256"
                  }
                ],
                outputs: [],
              }
            ],
            address: contractInfo.find(item => item.id === chain?.id)
              ?.contractAddress as `0x${string}`,
            functionName: "mint",
            args: [BigInt(1)],
            value: parseEther("0.01"),
          }
        )
      }}
      >
        打造一个NFT
      </button>
    </div>
  )

}

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider
      config={config}
      chains={[Sepolia, Polygon, Hardhat]}
      wallets={[MetaMask(), WalletConnect()]}
    >
      <NFTCard
        address="0x5FbDB2315678afecb367f032d93F642f64180aa3"
        tokenId={0}
      />
      <Connector>
        <ConnectButton>登录钱包</ConnectButton>
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}