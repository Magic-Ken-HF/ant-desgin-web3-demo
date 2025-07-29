import { parseEther } from "viem";
import { Button, message } from "antd";
import {createConfig, http, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { Mainnet, WagmiWeb3ConfigProvider, MetaMask } from "@ant-design/web3-wagmi";
import { Address, NFTCard, Connector, ConnectButton, useAccount } from "@ant-design/web3";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "c07c0051c2055890eade3556618e38a6",
      showQrModal: false,
    }),
  ],
});

const CallTest = () => {
  const { account } = useAccount();
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
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
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
      {result.data?.toString()}
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
            address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
            functionName: "mint",
            args: [BigInt(1)],
            value: parseEther("0.01"),
          }
        )
      }}
      >
        mint
      </button>
    </div>
  )

}

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider
      chains={[Mainnet]}
      transports={{
        [Mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/804bd2bc265f47c3ba8ea64dc38b17cf') // Replace with your own RPC URL,
      }}
      wallets={[MetaMask()]}
      eip6963={{
        autoAddInjectedWallets: true, // Automatically add injected wallets like MetaMask
      }}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard
        address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
        tokenId={641}
      />
      <Connector>
        <ConnectButton>登录钱包</ConnectButton>
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>

  );
}