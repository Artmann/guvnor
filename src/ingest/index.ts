import chalk from 'chalk';
import dotenv from 'dotenv';
import RawMeasurement from '../models/raw-measurement';

dotenv.config();

import { log, logError, sleep } from '../utils';
import { aggregate } from './aggregation';

(async function() {
  log(chalk.green('Ingest Started.'));

  let shouldKeepGoing = true;

  process.on('SIGTERM', () => {
    shouldKeepGoing = false;
  });

  while (shouldKeepGoing) {

    try {
      await aggregate();
    } catch (error) {
      logError(error);
    }
    await sleep(10_000);
  }

  log(chalk.green('Ingest Finished.'));
})();
