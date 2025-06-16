import { HttpsProxyAgent } from "https-proxy-agent";
import { Helper } from "../utils/helper.js";
import logger from "../utils/logger.js";
import https from "https";
import fetch from "node-fetch";

export class API {
  constructor(proxy) {
    this.proxy = proxy;
    this.ua = Helper.randomUserAgent();
  }

  async generateHeaders(token) {
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      "Content-Type": "application/json",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-Mode": "cors",
      "Sec-Ch-Ua": this.ua,
      "User-Agent": this.ua,
      "allowed-state": "na",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async fetch(
    endpoint,
    method = "GET",
    token,
    body = {},
    additionalHeader = {}
  ) {
    try {
      const url = endpoint;
      const headers = {
        ...(await this.generateHeaders(token)),
        ...additionalHeader,
      };

      logger.info(`${method} : ${url} ${this.proxy ? this.proxy : ""}`);
      logger.info(`Request Header : ${JSON.stringify(headers)}`);
      logger.info(`Request Body : ${JSON.stringify(body)}`);

      const options = {
        method,
        headers,
        agent: this.proxy
          ? new HttpsProxyAgent(this.proxy)
          : new https.Agent({ rejectUnauthorized: false }),
        body: method !== "GET" ? JSON.stringify(body) : undefined,
      };
      const res = await fetch(url, options);

      if (res.ok) {
        const contentType = res.headers.get("Content-Type");
        let responseData;
        if (contentType && contentType.includes("application/json")) {
          responseData = await res.json();
        } else {
          responseData = {
            message: await res.text(),
          };
        }

        logger.info(`Response : ${res.status} ${res.statusText}`);
        logger.info(
          `Response Data : ${JSON.stringify(responseData).substring(0, 150)}...`
        );

        const data = {
          status: res.ok ? 200 : res.status,
          data: responseData,
        };

        return data;
      } else {
        throw res;
      }
    } catch (err) {
      if (err.status) {
        const status = err.status;
        const contentType = err.headers.get("Content-Type");
        let responseData;
        if (contentType && contentType.includes("application/json")) {
          responseData = await err.json();
        } else {
          responseData = {
            message: await err.text(),
          };
        }
        if (status == 400 || status == 403 || status == 409) {
          const data = {
            status,
            data: responseData,
          };
          return data;
          // } else if (status === 504 || status == 404) {
          // console.error("DETECT API CHANGE.. EXIT");
          // await process.exit();
        } else {
          throw Error(`${status} - ${err.message ?? err.statusText}`);
        }
      } else {
        throw err;
      }
    }
  }
}
