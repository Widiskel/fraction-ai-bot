import { privateKey } from "./accounts/accounts.js";
import Core from "./src/core/core.js";
import { Helper } from "./src/utils/helper.js";
import logger from "./src/utils/logger.js";
import twist from "./src/utils/twist.js";

async function operation(acc) {
  const core = new Core(acc);
  try {
    await core.connectWallet();
    await core.getBalance();
    await core.signIn();
    await core.getSessionList();
    await core.getAgentList();

    if (core.agentList.length == 0) {
      await Helper.delay(
        10000,
        acc,
        `No Agent Available Please Create Agent First`,
        core
      );
      throw Error(`No Agent Available Please Create Agent First`);
    }

    for (const agent of core.agentList) {
      for (const session of core.sessionList) {
        if (agent.sessionType.sessionType == session.sessionType.sessionType) {
          if (!agent.automationEnabled) {
            // await core.matchMarkingEnabled(agent, session);
            await core.getCaptchaNonce();
            // await core.matchMarking(agent, session);
          }
        }
      }
    }

    let delay = 60 * 3;
    for (const session of core.sessionList) {
      const durationPerRound = session.sessionType.durationPerRound;
      const rounds = session.sessionType.rounds;
      const totalDuration = durationPerRound * rounds;

      if (totalDuration < delay) {
        delay = totalDuration;
      }
    }
    delay = delay * 1000;

    await Helper.delay(
      delay,
      acc,
      `Account ${core.address} Processing Done, Delaying for ${Helper.msToTime(
        delay
      )}`,
      core
    );
    await operation(acc);
  } catch (error) {
    if (error.message) {
      await Helper.delay(
        10000,
        acc,
        `Error : ${error.message}, Retry again after 10 Second`,
        core
      );
    } else {
      await Helper.delay(
        10000,
        acc,
        `Error :${JSON.stringify(error)}, Retry again after 10 Second`,
        core
      );
    }

    await operation(acc);
  }
}

async function startBot() {
  return new Promise(async (resolve, reject) => {
    try {
      logger.info(`BOT STARTED`);
      if (privateKey.length == 0)
        throw Error("Please input your account first on accounts.js file");
      const promiseList = [];

      for (const acc of privateKey) {
        promiseList.push(operation(acc));
      }

      await Promise.all(promiseList);
      resolve();
    } catch (error) {
      logger.info(`BOT STOPPED`);
      logger.error(JSON.stringify(error));
      reject(error);
    }
  });
}

(async () => {
  try {
    logger.clear();
    logger.info("");
    logger.info("Application Started");
    Helper.showSkelLogo();
    console.log(Helper.botName);
    console.log("By : Widiskel");
    console.log("Follow On : https://github.com/Widiskel");
    console.log("Join Channel : https://t.me/skeldrophunt");
    console.log("Dont forget to run git pull to keep up to date");
    await startBot();
  } catch (error) {
    twist.clear();
    twist.clearInfo();
    console.log("Error During executing bot", error);
    await startBot();
  }
})();
