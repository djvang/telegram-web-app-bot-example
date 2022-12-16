require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const cors = require("cors");
const { checkWebAppSignature, parseInitData } = require("./utils/webApp");
const { connect } = require("./utils/we3Auth");

const TOKEN = process.env.TELEGRAM_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log({ msg });

  if (text === "/start") {
    bot.sendMessage(
      chatId,
      "Hello, I'm a bot. Below is a button to open the web application",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Open Web App",
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      }
    );
  }

  if (msg.web_app_data?.data) {
    const data = msg.web_app_data.data; //JSON.parse(msg.web_app_data.data);

    console.log(data);

    bot.sendMessage(chatId, `You sent me ${data}`);
  }
});

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function verifySignature(req, res, next) {
  const initData = req.body.initData;

  if (!initData) {
    return res.status(401).send({
      message: "No initData provided",
    });
  }

  const isSafe = checkWebAppSignature(TOKEN, initData);

  if (!isSafe) {
    return res
      .status(401)
      .send({ done: false, error: "Invalid init data signature" });
  }

  next();
}

app.post("/api/v1/sendMessage", verifySignature, (req, res) => {
  const initData = req.body.initData;

  const { query_id, user } = parseInitData(initData);

  bot
    .answerWebAppQuery(query_id, {
      type: "article",
      id: query_id,
      title: "Title of the article",
      input_message_content: {
        message_text: `Hello, ${user.first_name}!`,
      },
    })
    .then(async (data) => {
      console.log({ data });
      res.status(200).send({ done: true });
    })
    .catch((error) => {
      res.status(500).send({ done: false, error: error.message });
    });
});

app.post("/api/v1/users/auth", verifySignature, async (req, res) => {
  res.status(200).send({ done: true, value: "TOKEN" });

  // const connected = await connect({
  //   verifier: "verifier-name",
  //   verifierId: "verifier-Id",
  //   idToken: "JWT Token",
  // });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}; CORS-enabled`);
});
