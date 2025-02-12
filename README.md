# Fraction Ai Testnet BOT

## Table Of Contents
- [Fraction Ai Testnet BOT](#fraction-ai-testnet-bot)
  - [Table Of Contents](#table-of-contents)
  - [Prerequisite](#prerequisite)
  - [Sight Ai Incentive Testnet](#sight-ai-incentive-testnet)
  - [BOT FEATURE](#bot-feature)
  - [Setup \& Configure BOT](#setup--configure-bot)
    - [Linux](#linux)
    - [Windows](#windows)
  - [Update Bot](#update-bot)
  - [NOTE](#note)
  - [CONTRIBUTE](#contribute)
  - [SUPPORT](#support)

## Prerequisite
- Git
- Node JS
- Wallet Funded with Eth Sepolia

## Sight Ai Incentive Testnet
#New

Fraction AI Testnet

Reward : Potential
Network : ETH Sepolia

Link:
https://dapp.fractionai.xyz?referral=FE0C5B58
- Connect Wallet  (New / BURNER)
- Go to "Dashboard"
- Link Social
- Hold 0.005 ETH MAINNET
- Go to "My Agent" Tab
- Click "+ Create New Agent
- Fill Starting Balance 
- Fill the System Prompt (You can Generate With AI)
- Go to "My Agents"
- Click "Enable Automation"
- Done!

Buy $ETH on Sepolia if need so much ETH Sepolia:
https://testnetbridge.com/sepolia

You'll need a significant amount of $ETH on Sepolia, as this testnet involves battles that depend on your $ETH balance.

## BOT FEATURE

- Multi Account 
- Support PK
- Proxy Support
- Agent Matchmarking Automation 


## Setup & Configure BOT

### Linux
1. clone project repo
   ```
   git clone https://github.com/Widiskel/fraction-ai-bot.git 
   cd fraction-ai-bot
   ```
2. run
   ```
   npm install
   npm run setup
   ```
3. Configure your accounts
   ```
   nano accounts/accounts.js
   ```
4. Configure your bot configuration and proxy
   ```
   nano config/config.js
   nano config/proxy_list.js
   ```
5. to start the app run
   ```
   npm run start
   ```
   
### Windows
1. Open your `Command Prompt` or `Power Shell`.
2. Clone project repo
   ```
   git clone https://github.com/Widiskel/fraction-ai-bot.git
   ```
   and cd to project dir
   ```
   cd fraction-ai-bot
   ```
3. Run 
   ```
   npm install
   npm run setup
   ```
5. Navigate to `fraction-ai-bot` directory. 
6. Navigate to `accounts` and configure `accounts.js`.
7. Back to `fraction-ai-bot` directory. 
8. Navigate to `config` and configure `config.js` and `proxy_list.js` if you use proxy.
9. To start the app open your `Command Prompt` or `Power Shell` again and run
    ```
    npm run start
    ```

## Update Bot

To update bot follow this step :
1. run
   ```
   git pull
   ```
   or
   ```
   git pull --rebase
   ```
   if error run
   ```
   git stash && git pull
   ```
2. run
   ```
   npm update
   ```
2. start the bot

## NOTE
DWYOR & Always use a new wallet when running the bot, I am not responsible for any loss of assets.

You need to use proxy with rotating feature (Residential) so the IP will change every specific minutes, otherwise you will got 429 - To Many Request Error
- [proxyscrappe](https://proxyscrape.com/?ref=yzi1n2y)
- [dataimpulse](https://dataimpulse.com/?aff=66393)



## CONTRIBUTE

Feel free to fork and contribute adding more feature thanks. To get original unencrypted code just join my channel, original code (index.js and src folder) are Obfuscated during build

## SUPPORT

want to support me for creating another bot ?
**star** my repo or buy me a coffee on

EVM : `0x94c442d21ba584c0562ab5cacc8efd633ec89470`

SOLANA : `3tE3Hs7P2wuRyVxyMD7JSf8JTAmEekdNsQWqAnayE1CN`
