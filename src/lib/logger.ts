import { env } from "@/env"
import chalk from "chalk"

/**
 * A basic logger for the console, so we can track usage
 * (especially when debbuging)
 */
export class Logger {
  private static getTimeStamp() {
    const date = new Date().toISOString()

    return chalk.gray(`[${date}]`)
  }

  public static Log(...messages: unknown[]) {
    console.log(chalk.green("[LOG]"), this.getTimeStamp(), messages.join(" "))
  }

  public static Info(...messages: unknown[]) {
    console.log(chalk.blue("[INFO]"), this.getTimeStamp(), messages.join(" "))
  }

  public static Error(...messages: unknown[]) {
    console.log(chalk.red("[ERROR]"), this.getTimeStamp(), messages.join(" "))
  }

  public static Warn(...messages: unknown[]) {
    console.log(chalk.yellow("[WARN]"), this.getTimeStamp(), messages.join(" "))
  }

  public static Debug(...messages: unknown[]) {
    if (env.IS_DEVELOPMENT === false) {
      return
    }

    console.log(
      chalk.magenta("[DEBUG]"),
      this.getTimeStamp(),
      messages.join(" ")
    )
  }
}
