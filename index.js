const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5108650279:AAGNEYMsToLI6Juzm5rPWBg3SxQvwIFTheY";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Я сейчас загадаю цифру от 0 до 9, а ты должен её угадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Началmное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра - угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот автора Интерлинк бота`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
      //   await bot.sendMessage(
      //     chatId,
      //     `Я сейчас загадаю цифру от 0 до 9, а ты должен её угадать!`
      //   );
      //   const randomNumber = Math.floor(Math.random() * 10);
      //   chats[chatId] = randomNumber;
      //   return bot.sendMessage(chatId, `Отгадывай`, gameOptions);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй ещё раз!");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    console.log(msg);

    if (data === "/again") {
      return startGame(chatId);
    }
    if (Number(data) === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
    // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
    // console.log(msg);
  });
};

start();
