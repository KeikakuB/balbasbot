const tmi = require("tmi.js");
const util = require("./util.js");
const cmds = require("./commands.js");
const database = require("./database.js");

let commandFunctions = {};
for (c of util.data.commands.choices) {
  commandFunctions[c] = require(`./commands/${c}.js`);
}

database.init();

// Create a client with our options
const client = new tmi.client(util.opts);

// Register our event handlers (defined below)
client.on("message", (target, context, msg, self) => {
  if (self) {
    return;
  } // Ignore messages from the bot
  if (!msg.startsWith("!")) {
    return;
  }

  // Remove whitespace from chat message
  const command = msg.substr(1, msg.length).trim();

  const args = command.split(" ");

  const commandQuery = args.shift();

  const commandChoices = cmds.getCommandsForUser(context.username);

  const commandName = util.queryFrom(
    commandQuery,
    commandChoices,
    client,
    target
  );

  if (commandName in commandFunctions) {
    try {
      commandFunctions[commandName].run(args, context, function (response) {
        if (response && typeof response == "string") {
          client.say(target, response);
        }
        console.log(`* Executed ${commandName} command: ${response}`);
      });
    } catch (error) {
      if (error.message) {
        client.say(target, error.message);
        console.log(error.message);
      }
    }
  } else {
    console.log(`* Unknown command ${commandName}`);
    return;
  }
});
client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});
const USERNAME_FORMAT_STRING = "{username}";
let n_viewers = 0;
client.on("join", (target, username, self) => {
  if (self) {
    return;
  } // Ignore self joins from the bot
  if (util.data.join.ignoreList.includes(username)) {
    return;
  }
  n_viewers = n_viewers + 1;
  const atUser = `@${username}`;
  let joinMessage = util.pick(util.data.join.messages);
  if (joinMessage.includes(USERNAME_FORMAT_STRING)) {
    joinMessage = joinMessage.replace(USERNAME_FORMAT_STRING, atUser);
  } else {
    joinMessage = `${joinMessage} ${atUser}`;
  }
  client.say(target, joinMessage);
});
client.on("part", (target, username, self) => {
  if (self) {
    return;
  } // Ignore self joins from the bot
  if (util.data.join.ignoreList.includes(username)) {
    return;
  }
  n_viewers = n_viewers - 1;
});

// Connect to Twitch:
client.connect();
