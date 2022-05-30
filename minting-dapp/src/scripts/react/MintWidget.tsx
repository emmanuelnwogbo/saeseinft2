import { Contract, providers, utils, BigNumber, ethers } from 'ethers';
import React from 'react';

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";

import Header from './Header';

interface Props {
  maxSupply: number,
  totalSupply: number,
  tokenPrice: BigNumber,
  maxMintAmountPerTx: number,
  isPaused: boolean,
  isWhitelistMintEnabled: boolean,
  isUserInWhitelist: boolean,
  mintTokens(mintAmount: number): Promise<void>,
  whitelistMintTokens(mintAmount: number): Promise<void>
  connectWallet: Function
  connecting: Boolean,
  userAddress: string|null;
}

interface State {
  mintAmount: number;
  currentSlide: number,
  web3Modal: Web3Modal | null
}

const defaultState: State = {
  mintAmount: 1,
  currentSlide: 1,
  web3Modal: null
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private canMint(): boolean {
    return !this.props.isPaused || true;
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private incrementMintAmount(): void {
    this.setState({
      mintAmount: Math.min(this.props.maxMintAmountPerTx, this.state.mintAmount + 1),
    });
  }

  private decrementMintAmount(): void {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return;
    }

      
    await this.props.whitelistMintTokens(this.state.mintAmount);
  }

  private async mintMobild(): Promise<void> {
    if (this.state.web3Modal !== null) {
      const web3Provider = await this.state.web3Modal.connect();
      const accounts = (await web3Provider.enable()) as string[];
      
      console.log(accounts)
    }
    console.log('mint mobile');
    /*const providerOptions = {
      walletconnect: {
        package: WalletConnect, // required
        options: {
          infuraId: "b84b6a3a88fc4655902dba0c9cb32b7a" // required
        }
      }
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    console.log(signer)*/
  }

  private connect(): void {

  }

  private toggleslide(): void {
    let currentSlide = this.state.currentSlide;
    currentSlide === 1 ? currentSlide = 2 : currentSlide = 1;
    this.setState({
      currentSlide
    })
  }

  componentDidMount() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: 'b84b6a3a88fc4655902dba0c9cb32b7a',
          },
        },
      },
    });

    this.setState({
      web3Modal
    });
  }

  render() {
    return (
      <>
        <Header />
        <div className="main__top" style={{
          backgroundImage: `url('/build/images/man.png')`
        }}>
          <div className="main__top--photos">
            <figure>
              <img src="/build/images/leftmint.svg"/>
            </figure>
            <figure>
              <img src="/build/images/rightmint.svg"/>
            </figure>
          </div>

          {this.canMint() ?
          <div className="main">
            {/*<div className="main__price">
              <strong></strong> {utils.formatEther(this.props.tokenPrice.mul(this.state.mintAmount))} ETH 
          </div>*/}
          {this.props.totalSupply}/{this.props.maxSupply}
          <a className="ethlink" href="https://etherscan.io/address/0xa35346ef08F731AF6E7D3d1F5B948c1De0AEcc8C#code" target="_blank">0xa35346ef08F731AF6E7D3d1F5B948c1De0AEcc8C</a>
          <div className="maxmint">10 Max</div>

            <div className="main__controls">
              <div className="main__controls--toggle">
                <button className="main__controls--decrease toggle" onClick={() => this.decrementMintAmount()}>-</button>
                <span className="main__controls--amount toggle">{this.state.mintAmount}</span>
                <button className="main__controls--increase toggle" onClick={() => this.incrementMintAmount()}>+</button>
              </div>
              <button className="main__controls--primary main__controls--primary-mobile" onClick={() => this.mintMobild()}>Mint</button>
              {
                this.props.userAddress ? <button className="main__controls--primary" onClick={() => this.mint()}>Mint</button> : 
                <button className="main__controls--primary">{this.props.connecting ? 'Connecting' : 'Connect'}</button>
                }
            </div>
          </div>
          :
          <div className="cannot-mint">
            <span className="emoji">⏳</span>
            
            {this.props.isWhitelistMintEnabled ? <>You are not included in the <strong>whitelist</strong>.</> : <>The contract is <strong>paused</strong>.</>}<br />
            Please come back during the next sale!
          </div>
        }
        </div>
        <div className="main__bottom--padding">
          <div className="main__bottom--heading">COLLECTION PREVIEW</div>
        <div className="main__bottom">
          <figure className="main__bottom--control" onClick={() => this.toggleslide()}>
            <img src="/build/images/rightarrow.svg"/>
          </figure>
          <div className="main__bottomcard main__bottomcard1" style={
            {
              transform: this.state.currentSlide === 1 ? 'translateX(0)' : 'translateX(100%)',
              opacity: this.state.currentSlide === 1 ? '1' : '0',
            }
          }>
            <div className="main__bottomcard--left">
              <figure>
                <img src="/build/images/slide1.svg"/>
              </figure>
            </div>
            <div className="main__bottomcard--right">
              <div className="main__bottomcard--pill">
                <span>Body</span>
                <span>body Type1</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>Face</span>
                <span>empty face</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>eye</span>
                <span>focused red eyes</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>clothing</span>
                <span>cyan leather jacket</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>mouth</span>
                <span>smirk</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>hair</span>
                <span>gold bob cut</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>eye wear</span>
                <span>no eyewear</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>ear</span>
                <span>gold ring2</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>hand</span>
                <span>wine</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>environ</span>
                <span>rain</span>
              </div>
            </div>
          </div>

          <div className="main__bottomcard main__bottomcard2" style={
            {
              transform: this.state.currentSlide === 2 ? 'translateX(0)' : 'translateX(100%)',
              opacity: this.state.currentSlide === 2 ? '1' : '0',
            }
          }>
            <div className="main__bottomcard--left">
              <figure>
                <img src="/build/images/slide2.svg"/>
              </figure>
            </div>
            <div className="main__bottomcard--right">
              <div className="main__bottomcard--pill">
                <span>Body</span>
                <span>body Type4</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>Face</span>
                <span>empty face</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>eye</span>
                <span>focused blue eyes</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>clothing</span>
                <span>blue kimono</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>mouth</span>
                <span>slightly opened</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>hair</span>
                <span>black bob cut</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>eye wear</span>
                <span>VR</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>ear</span>
                <span>gold hook</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>hand</span>
                <span>no hand</span>
              </div>
              <div className="main__bottomcard--pill">
                <span>environ</span>
                <span>rain</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }
}
