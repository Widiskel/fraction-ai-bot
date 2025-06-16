import { ethers } from "ethers";
import { privateKey } from "../../accounts/accounts.js";
import { Helper } from "../utils/helper.js";
import logger from "../utils/logger.js";
import { RPC } from "./network/rpc.js";
import { API } from "../api/api.js";
import { proxyList } from "../../config/proxy_list.js";
import { Config } from "../../config/config.js";

export default class Core extends API {
  constructor(acc) {
    const accIdx = privateKey.indexOf(acc);
    if (proxyList.length != privateKey.length && proxyList.length != 0)
      throw Error(
        `You Have ${privateKey.length} Accounts But Provide ${proxyList.length} Proxy`
      );
    const proxy = proxyList[accIdx];

    super(proxy);
    this.acc = acc;
    this.provider = new ethers.JsonRpcProvider(RPC.RPCURL, RPC.CHAINID);
  }

  async connectWallet() {
    try {
      const data = this.acc;
      const accIdx = privateKey.indexOf(this.acc);
      await Helper.delay(
        1000,
        this.acc,
        `Connecting to Account : ${accIdx + 1}`,
        this
      );
      const type = Helper.determineType(data);
      logger.info(`Account Type : ${type}`);
      if (type == "Secret Phrase") {
        /**
         * @type {Wallet}
         */
        this.wallet = new ethers.Wallet.fromPhrase(data, this.provider);
      } else if (type == "Private Key") {
        /**
         * @type {Wallet}
         */
        this.wallet = new ethers.Wallet(data.trim(), this.provider);
      } else {
        throw Error("Invalid account Secret Phrase or Private Key");
      }
      this.address = this.wallet.address;
      await Helper.delay(
        1000,
        this.acc,
        `Wallet connected ${JSON.stringify(this.wallet.address)}`,
        this
      );
    } catch (error) {
      throw error;
    }
  }

  async getBalance(update = false) {
    try {
      if (!update) {
        await Helper.delay(
          500,
          this.acc,
          `Getting Wallet Balance of ${this.wallet.address}`,
          this
        );
      }

      const ethBalance = ethers.formatEther(
        await this.provider.getBalance(this.wallet.address)
      );

      this.balance = {
        ETH: ethBalance,
      };
      await Helper.delay(500, this.acc, `Balance updated`, this);
    } catch (error) {
      throw error;
    }
  }

  async getNonce() {
    const res = await this.fetch(
      "https://dapp-backend-4x.fractionai.xyz/api3/auth/nonce"
    );
    return res.data.nonce;
  }

  async signIn() {
    try {
      await Helper.delay(500, this.acc, `Connecting to Fraction AI`, this);
      const msg = `dapp.fractionai.xyz wants you to sign in with your Ethereum account:
${this.address}

Sign in with your wallet to Fraction AI.

URI: https://dapp.fractionai.xyz
Version: 1
Chain ID: 11155111
Nonce: ${await this.getNonce()}
Issued At: ${new Date().toISOString()}`;

      const signature = await this.wallet.signMessage(msg);
      const refCode = Helper.solveRef(Helper.code);
      const res = await this.fetch(
        "https://dapp-backend-4x.fractionai.xyz/api3/auth/verify",
        "POST",
        undefined,
        {
          message: msg,
          signature: signature,
          referralCode: refCode,
        }
      );
      this.user = res.data.user;
      this.token = res.data.accessToken;
      await Helper.delay(500, this.acc, `Connected to Fraction AI`, this);
    } catch (error) {
      throw error;
    }
  }

  async getAgentList() {
    try {
      await Helper.delay(500, this.acc, `Getting User Agent List`, this);
      const res = await this.fetch(
        `https://dapp-backend-4x.fractionai.xyz/api3/agents/user/${this.user.id}`,
        "GET",
        this.token
      );
      this.agentList = res.data;
      await Helper.delay(
        500,
        this.acc,
        `Successfully Get User Agent List`,
        this
      );
    } catch (error) {
      throw error;
    }
  }
  async getSessionList() {
    try {
      await Helper.delay(500, this.acc, `Getting Session List`, this);
      const res = await this.fetch(
        `https://dapp-backend-4x.fractionai.xyz/api3/session-types/list/${this.user.id}`,
        "GET",
        this.token,
        undefined
      );
      this.sessionList = res.data;
      await Helper.delay(500, this.acc, `Successfully Get Session List`, this);
    } catch (error) {
      throw error;
    }
  }
  async matchMarkingEnabled(agent, session) {
    try {
      await Helper.delay(
        2000,
        this.acc,
        `Starting Automated Matchmarking for Agent ${agent.name} on Session ${session.sessionType.name}`,
        this
      );
      const res = await this.fetch(
        `https://dapp-backend-4x.fractionai.xyz/api3/automated-matchmaking/enable`,
        "POST",
        this.token,
        {
          agentId: agent.id,
          sessionTypeId: session.sessionType.id,
          maxGames: 1,
          stopLoss: 0.5,
          takeProfit: 0.1,
          feeTier: Config.ENTRYFEE,
          maxParallelGames: 10,
        }
      );
      if (res.status == 200) {
        await Helper.delay(
          500,
          this.acc,
          `Successfully Automated Matchmarking for Agent ${agent.name} on Session ${session.sessionType.name}`,
          this
        );
      } else {
        await Helper.delay(
          3000,
          this.acc,
          `${agent.name} : ${res.data.error}`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async getCaptchaNonce() {
    try {
      await Helper.delay(2000, this.acc, `Getting Captcha Nonce`, this);
      const res = await this.fetch(
        `https://dapp-backend-4x.fractionai.xyz/api3/auth/nonce`,
        "GET",
        this.token
      );
      if (res.status == 200) {
        await Helper.delay(500, this.acc, `Try to Solving Captcha`, this);
        const img =
          "https://neural-arena-upload.s3.ap-south-1.amazonaws.com/captcha/1739941033436-8nhdw.png";
      } else {
        await Helper.delay(
          3000,
          this.acc,
          `${agent.name} : ${res.data.error}`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async matchMarking(agent, session) {
    try {
      await Helper.delay(
        2000,
        this.acc,
        `Starting Matchmarking for Agent ${agent.name} on Session ${session.sessionType.name}`,
        this
      );
      const res = await this.fetch(
        `https://dapp-backend-4x.fractionai.xyz/api3/matchmaking/initiate`,
        "POST",
        this.token,
        {
          userId: this.user.id,
          agentId: agent.id,
          entryFees: Config.ENTRYFEE,
          sessionTypeId: session.sessionType.id,
        }
      );
      if (res.status == 200) {
        await Helper.delay(
          500,
          this.acc,
          `Successfully Start Matchmarking for Agent ${agent.name} on Session ${session.sessionType.name}`,
          this
        );
      } else {
        await Helper.delay(
          3000,
          this.acc,
          `${agent.name} : ${res.data.error}`,
          this
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async executeTx(tx) {
    try {
      logger.info(`TX DATA ${JSON.stringify(Helper.serializeBigInt(tx))}`);
      await Helper.delay(500, this.acc, `Executing TX...`, this);
      const txRes = await this.wallet.sendTransaction(tx);

      logger.info(`Tx Executed \n${RPC.EXPLORER}tx/${txRes.hash}`);
      await Helper.delay(
        500,
        this.acc,
        `Tx Executed Waiting For Block Confirmation...`,
        this
      );
      const txRev = await txRes.wait();
      logger.info(`Tx Confirmed and Finalizing: ${JSON.stringify(txRev)}`);
      await Helper.delay(
        5000,
        this.acc,
        `Tx Executed and Confirmed \n${RPC.EXPLORER}tx/${txRev.hash}`,
        this
      );

      await this.getBalance(true);
    } catch (error) {
      if (error.message.includes("504")) {
        await Helper.delay(5000, this.acc, error.message, this);
      } else {
        throw error;
      }
    }
  }

  async getOptimalNonce() {
    try {
      const latestNonce = await this.provider.getTransactionCount(
        this.wallet.address,
        "latest"
      );
      const pendingNonce = await this.provider.getTransactionCount(
        this.wallet.address,
        "pending"
      );
      const optimalNonce =
        pendingNonce > latestNonce ? pendingNonce : latestNonce;
      return optimalNonce;
    } catch (error) {
      throw error;
    }
  }

  async estimateGasWithRetry(
    address,
    amount,
    rawdata,
    directThrow = false,
    retries = 3,
    delay = 3000
  ) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        logger.info(`Estimating Gas for ${rawdata} TX`);
        const gasLimit = await this.provider.estimateGas({
          from: this.wallet.address,
          to: address,
          value: amount,
          data: rawdata,
        });
        // console.log(gasLimit);
        return gasLimit;
      } catch (err) {
        if (directThrow) {
          throw err;
        } else {
          await Helper.delay(
            delay,
            this.acc,
            `${err.reason}... Attempt ${attempt + 1} of ${retries}`,
            this
          );

          if (attempt === retries - 1) {
            throw Error(`Failed to estimate gas after ${retries} attempts.`);
          }
        }
      }
    }
  }

  async buildTxBody(data, direct = false, value = 0) {
    const nonce = await this.getOptimalNonce();
    const gasLimit = await this.estimateGasWithRetry(
      data.to,
      value,
      data.data,
      direct
    );
    const tx = {
      to: data.to,
      from: this.address,
      value: value,
      gasLimit,
      gasPrice: ethers.parseUnits("1.5", "gwei"),
      nonce: nonce,
      data: data.data,
    };
    return tx;
  }
}
