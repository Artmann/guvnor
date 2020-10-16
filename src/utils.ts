import chalk from 'chalk';

function withTimestamp(message: string): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth().toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');

  const timestamp = `${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`;

  return `[${ timestamp }] ${ message }`;
}

export function log(...messages: any[]): void {
  messages.map(message => console.log(withTimestamp(message)));
}

export function logError(error: Error): void {
  console.error(chalk.red(withTimestamp(error.message)));
}

export function sleep(interval: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, interval);
  });
}
