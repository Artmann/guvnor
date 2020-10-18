import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

import { log, logError, sleep } from '../utils';
import Endpoint from '../models/endpoint';
import MonitoringJob, { Region, regions } from '../models/monitoring-job';

async function schedule(endpoint: Endpoint, region: Region): Promise<void> {
  try {
    const job = await MonitoringJob
      .where('endpointId', endpoint.id)
      .where('region', region)
      .where('status', 'pending')
      .first();

    if (job) {
      return;
    }

    await MonitoringJob.create({
      endpointId: endpoint.id,
      region,
      status: 'pending'
    });

    log(chalk.gray(`Scheduling job for ${ endpoint.path } in ${ region }.`));
  } catch(error) {
    logError(error);
  }
}

(async function() {
  log(chalk.green('Scheduler Started.'));

  let shouldKeepGoing = true;

  process.on('SIGTERM', () => {
    shouldKeepGoing = false;
  });

  while (shouldKeepGoing) {

    const endpoints = await Endpoint.all();

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];

      const promises = [];

      for (const [region, isEnabled] of Object.entries(regions)) {
        if (!isEnabled) {
          continue;
        }

        promises.push(schedule(endpoint, region as Region));
      }

      await Promise.all(promises);
    }

    await sleep(10_000);
  }

  log(chalk.green('Scheduler Finished.'));
})();
