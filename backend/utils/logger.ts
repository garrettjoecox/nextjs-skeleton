/* eslint-disable no-console */
import chalk from 'chalk';
import strip from 'strip-ansi';
import { logConfig } from '../config';

const LOG_LEVELS: { [index: string]: number } = {
  verbose: 3,
  info: 2,
  error: 1,
  silent: 0,
};

export class Logger {
  private category?: string;

  private strippedCategory?: string;

  private logLevel: number;

  constructor(category?: string) {
    if (category) {
      this.category = this.surround(category);
      this.strippedCategory = strip(category);
    }

    if (category && logConfig[this.strippedCategory as string]) {
      this.logLevel = LOG_LEVELS[logConfig[this.strippedCategory as string]];
    } else {
      this.logLevel = LOG_LEVELS[logConfig.default as string];
    }
  }

  verbose(...args: any[]) {
    if (this.logLevel < 3) return;

    if (this.category) args.unshift(this.category);
    args.unshift(this.surround(chalk.magenta('Verbose')));
    console.log(...args);
  }

  info(...args: any[]) {
    if (this.logLevel < 2) return;

    if (this.category) args.unshift(this.category);
    args.unshift(this.surround(chalk.green('Info')));
    console.log(...args);
  }

  error(...args: any[]) {
    if (this.logLevel < 1) return;

    if (this.category) args.unshift(this.category);
    args.unshift(this.surround(chalk.red('Error')));
    console.log(...args);
  }

  // eslint-disable-next-line class-methods-use-this
  private surround(string: string) {
    return chalk.gray('[') + string + chalk.gray(']');
  }
}

export default new Logger();
