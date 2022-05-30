import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import { ethereumTestnet, ethereumMainnet } from '../lib/Networks';
import { openSea } from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: ethereumTestnet,
  mainnet: ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'SaiseiNft',
  tokenName: 'SaiseiNft NFT',
  tokenSymbol: 'SaiseiNft',
  hiddenMetadataUri: 'ipfs://__CID__/hidden.json',
  maxSupply: 8000,
  whitelistSale: {
    price: 0.0,
    maxMintAmountPerTx: 5,
  },
  preSale: {
    price: 0.07,
    maxMintAmountPerTx: 2,
  },
  publicSale: {
    price: 0.006,
    maxMintAmountPerTx: 30,
  },
  contractAddress: '0xa35346ef08F731AF6E7D3d1F5B948c1De0AEcc8C',
  marketplaceIdentifier: 'SaiseiNftNFT',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;
