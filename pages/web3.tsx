import dynamic from "next/dynamic";
const Web3Component = dynamic(()=>import("./web3Content"),{
    ssr:false,
    loading:()=><p>Loading web3 content...</p>
})

export default function Web3Page() {
  return <Web3Component />;
}