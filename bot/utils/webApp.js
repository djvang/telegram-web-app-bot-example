const CryptoJS = require("crypto-js");

const WEB_APP_DATA = "WebAppData";

function parseInitData(initData) {
  const params = new URLSearchParams(initData);
  const entries = Object.fromEntries(params);
  entries.user = JSON.parse(entries.user);

  return entries;
}

function checkWebAppSignature(token, initData) {
  // https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
  // https://github.com/aiogram/aiogram/blob/3b66a2b2e0a90ffc80582be3d1ef0e7045ce51fa/aiogram/utils/web_app.py

  // It is not clear from the documentation weather is URL
  // escaped or not, maybe you will need to uncomment this
  // initData = decodeURIComponent(initData)
  // Parse URL Query

  const searchParams = new URLSearchParams(initData);
  const hash = searchParams.get("hash");

  // Re encode in accordance to the documentation. Remember
  // to remove hash before.
  searchParams.delete("hash");

  // sort params
  const restKeys = Array.from(searchParams.entries());
  restKeys.sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

  // and join it with \n
  const dataCheckString = restKeys.map(([n, v]) => `${n}=${v}`).join("\n");

  // Perform the algorithm provided with the documentation
  const secretKey = CryptoJS.HmacSHA256(token, WEB_APP_DATA);
  const key = CryptoJS.HmacSHA256(dataCheckString, secretKey).toString(
    CryptoJS.enc.Hex
  );

  return key === hash;
}

module.exports = {
  checkWebAppSignature,
  parseInitData,
};
