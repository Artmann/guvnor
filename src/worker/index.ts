import AbortController from 'abort-controller';
import chalk from 'chalk';
import convertHrtime from 'convert-hrtime';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dayjs.extend(utc);
dotenv.config();

import { log, logError, sleep } from '../utils';
import Api from '../models/api';
import Endpoint from '../models/endpoint';
import MonitoringJob, { Region } from '../models/monitoring-job';
import RawMeasurement from '../models/raw-measurement';

async function perform(endpointId: string, region: string): Promise<void> {
  const endpoint = await Endpoint.find(endpointId);

  if (!endpoint) {
    return;
  }

  const api = await Api.find(endpoint.apiId);

  if (!api) {
    return;
  }

  const url = `${ api.url }${ endpoint.path }`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {

    const startTime = process.hrtime();

    const response = await fetch(url, {
      method: endpoint.method,
      signal: controller.signal
    });

    const { milliseconds: responseTime } = convertHrtime(process.hrtime(startTime));

    RawMeasurement.create({
      endpointId,
      region,
      responseTime,
      statusCode: response.status,
      timestamp: dayjs().utc().unix()
    })

  } catch (error) {
    logError(error);
  } finally {
    clearTimeout(timeout);
  }

  log(chalk.gray(`Performing request for ${ url }.`));
}

(async function() {
  const region: Region = process.env['REGION'] as Region || 'europe-west';

  log(chalk.green('Worker Started.'));

  let shouldKeepGoing = true;

  process.on('SIGTERM', () => {
    shouldKeepGoing = false;
  });

  while (shouldKeepGoing) {

    const job = await MonitoringJob
      .where('region', region)
      .where('status', 'pending')
      .first();

    if (job) {
      log(chalk.gray(`Performing Job ${ job.id }.`));

      job.status = 'running';

      await job.save();

      try {
        await perform(job.endpointId, region);
      } catch (error) {
        job.status = 'failed';
      }

      job.status = 'completed';

      await job.save();
    }

    await sleep(100 + Math.random() * 800);
  }

  log(chalk.green('Worker Finished.'));
})();
