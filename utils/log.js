const chalk = require("chalk");
const DEBUG = process.env.DEBUG;

const sperate = Array.from({ length: 10 })
  .fill("-")
  .join("");

const logger = DEBUG
  ? {
      warn(...args) {
        console.warn(chalk.yellow("[WARN] "), getDateStr(), ...args);
      },
      error(...args) {
        console.error(chalk.red("[ERROR]"), getDateStr(), ...args);
      },
      info(...args) {
        args.forEach((info, index) => {
          info = info || "";
          if (info.toString() === "[object Object]") {
            info = JSON.stringify(info);
          }
          console.log(
            chalk.blue("[INFO] "),
            getDateStr(),
            !!index ? "   " : "",
            info
          );
        });
        console.log("");
      }
    }
  : {
      warn() {},
      error() {},
      info() {}
    };

function getDateStr() {
  return chalk.cyan(`[${new Date().toUTCString()}] `);
}

module.exports = logger;
