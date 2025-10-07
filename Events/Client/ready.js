const { Client, ActivityType } = require("discord.js");
const { mongoose, connect } = require("mongoose");
const chalk = require("chalk");
const mongo = process.env.mongodb;

function progressBar(progress) {
  const width = 30;
  const percentage = Math.floor((progress / 100) * width);
  const progressBar = `${"█".repeat(percentage)}${"-".repeat(width - percentage)}`;
  return `[${progressBar}] ${progress}%`;
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Display CodeX ASCII art directly
    console.log("\n");
    console.log(" ▄████▄   ▒█████  ▓█████▄ ▓█████ ▒██   ██▒");
    console.log("▒██▀ ▀█  ▒██▒  ██▒▒██▀ ██▌▓█   ▀ ▒▒ █ █ ▒░");
    console.log("▒▓█    ▄ ▒██░  ██▒░██   █▌▒███   ░░  █   ░");
    console.log("▒▓▓▄ ▄██▒▒██   ██░░▓█▄   ▌▒▓█  ▄  ░ █ █ ▒ ");
    console.log("▒ ▓███▀ ░░ ████▓▒░░▒████▓ ░▒████▒▒██▒ ▒██▒");
    console.log("░ ░▒ ▒  ░░ ▒░▒░▒░  ▒▒▓  ▒ ░░ ▒░ ░▒▒ ░ ░▓ ░");
    console.log("  ░  ▒     ░ ▒ ▒░  ░ ▒  ▒  ░ ░  ░░░   ░▒ ░");
    console.log("░        ░ ░ ░ ▒   ░ ░  ░    ░    ░    ░  ");
    console.log("░ ░          ░ ░     ░       ░  ░ ░    ░  ");
    console.log("░                  ░                      ");
    console.log("\n");
    
    // Custom border with CodeX branding
    const border = "═".repeat(60);
    console.log(border);
    console.log(`║${" ".repeat(23)}CODEX SYSTEM${" ".repeat(23)}║`);
    console.log(border);
    
    mongoose.set("strictQuery", true);
    console.log(`\n[DATABASE] Initializing connection...`);

    try {
      let progress = 0;
      const progressUpdateInterval = 10;
      const maxProgress = 100;

      // Fancy database connection animation
      const loadingChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let charIndex = 0;
      
      while (progress <= maxProgress) {
        process.stdout.write(`\r[DATABASE] Connection progress: ${loadingChars[charIndex]} ${progressBar(progress)}`);
        await new Promise((resolve) => setTimeout(resolve, 150));
        progress += progressUpdateInterval;
        charIndex = (charIndex + 1) % loadingChars.length;
      }
      console.log("\n");

      mongoose.connection.on("connecting", () => {
        console.log(`[DATABASE] Establishing secure connection...`);
      });

      mongoose.connection.on("connected", () => {
        console.log(`[DATABASE] ✅ Connection established successfully`);
      });

      mongoose.connection.on("error", (error) => {
        console.error(
          chalk.redBright(`[DATABASE] ❌ Connection error: ${error.message}`)
        );
      });

      mongoose.connection.on("disconnected", () => {
        console.log(chalk.redBright(`[DATABASE] ❌ Connection terminated`));
      });

      await mongoose.connect(mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      if (mongoose.connection.readyState !== 1) {
        console.log(chalk.redBright(`[DATABASE] ⚠️ Connection unstable`));
      }

      // System initialization complete animation
      console.log("\n" + border);
      console.log(`║${" ".repeat(15)}SYSTEM INITIALIZATION COMPLETE${" ".repeat(15)}║`);
      console.log(border + "\n");

      // Bot statistics with fancy display
      let servers = await client.guilds.cache.size;
      let users = await client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
      );
      
      console.log(`[SYSTEM] ${client.user.username} is now online and operational.`);
      
      // Display stats in a box
      console.log("┌" + "─".repeat(58) + "┐");
      console.log(`│ CODEX STATISTICS${" ".repeat(42)}│`);
      console.log("├" + "─".repeat(58) + "┤");
      console.log(`│ Users    : ${formatNumber(users).padEnd(48)} │`);
      console.log(`│ Servers  : ${servers.toString().padEnd(48)} │`);
      console.log(`│ Commands : ${client.commands.size.toString().padEnd(48)} │`);
      console.log("└" + "─".repeat(58) + "┘");

      let status = [
        {
          name: `CodeX | Premium Features`,
          type: ActivityType.Playing,
        },
        {
          name: `/bot info | codex.gg/premium`,
          type: ActivityType.Listening,
        },
        {
          name: `/bot invite | ${client.commands.size} Commands`,
          type: ActivityType.Listening,
        },
        {
          name: "Powered by CodeX",
          type: ActivityType.Playing,
        },
        {
          name: `/help | in ${servers} Servers 🏆`,
          type: ActivityType.Playing,
        },
        {
          name: `/help | with ${formatNumber(users)} Users 👤`,
          type: ActivityType.Watching,
        },
      ];
      
      setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
      }, 15000);
      
      console.log(`[SYSTEM] Status rotation enabled successfully.`);
    } catch (error) {
      console.error(
        chalk.redBright(`[ERROR] Database connection failed: ${error.message}`)
      );
      console.log(chalk.redBright(`[DATABASE] ❌ Connection attempt failed`));
    }

    function formatNumber(number) {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
      } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
      } else {
        return number.toString();
      }
    }
  },
};

