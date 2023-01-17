import { useState } from "react";

import { BlockchainTypes, CrossmintEVMWalletAdapter } from "@crossmint/connect";
import * as ethers from "ethers";

export default function EVMConnectButton() {
    const [address, setAddress] = useState<string | undefined>(undefined);

    async function connectToCrossmint() {
        // Initialize the Crossmint embed.
        const _crossmintEmbed = new CrossmintEVMWalletAdapter({
            apiKey: "sk_live.yKC2hgNw.ujKvGNQGHc47tOVf0i1Yey3WACTZ9f5i",
            chain: BlockchainTypes.ETHEREUM, // BlockchainTypes.ETHEREUM || BlockchainTypes.POLYGON. For solana use BlockchainTypes.SOLANA
        });

        // Ask the user to sign in and give access to their publicKey
        const address = await _crossmintEmbed.connect();

        // If the user successfully connects to Crossmint, the address will be returned.
        if (address) {
            console.log("EVM Address",address);
            setAddress(address);

            const msg = "Hello World 2.0";
            console.log("Requiring user to sign a test message:", msg);

            const signature = await _crossmintEmbed.signMessage(msg);
            console.log("Signature", signature);

            const hash = ethers.utils.hashMessage(msg);
            //let pubKey = ethers.utils.recoverPublicKey(ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(hash))), signature);
            //let recoveredAddress = ethers.utils.computeAddress(pubKey)
            const recoveredAddress = ethers.utils.recoverAddress(hash, signature);
            console.log("Address from signature", recoveredAddress);
            console.log("Address match?", recoveredAddress === address);

            // Not necessary
            //_crossmintEmbed.disconnect();
            //console.log("Wallet disconnected");
        } else{
            console.log("Connection failed");
        }
    }

    return (
        <button onClick={connectToCrossmint} className="px-6 py-2 font-semibold text-black bg-white rounded-md">
            {address ? address.slice(0, 6) + "..." : "Connect"}
        </button>
    );
}
