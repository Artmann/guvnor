import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Context } from 'koa';

import Api from '../../models/api';
import Measurement from '../../models/measurement';
import { merge } from './merger';

dayjs.extend(utc);

interface CompactMeasurement {
  average: number;
  endpointId: string;
  id: string;
  max: number;
  min: number;
  statusCodes: number[],
  timestamp: number;
}

function resolutionKey(resolution: string): string {
  if (resolution === 'day') {
    return 'day';
  }
  if (resolution === 'hour') {
    return 'hour';
  }

  return 'minute10';
}

function numberOfMeasurements(resolution: string): number {
  if (resolution === 'day') {
    return 7;
  }
  if (resolution === 'hour') {
    return 12 + 1;
  }

  return 36 + 1;
}

function timespanByResolution(resolution: string): number {
  if (resolution === 'day') {
    return 60 * 60 * 24;
  }
  if (resolution === 'hour') {
    return 60 * 60;
  }

  return 60 * 10;
}


export async function measurementsRoute(context: Context): Promise<void> {
  const { id } = context.params;

  const api = await Api.find(id);

  if (!api) {
    return context.throw(404, 'Api not found.');
  }

  const endpointId = context.request.query.endpointId;
  const resolution = context.request.query.resolution || 'minute';
  const rawTimestamp = parseInt(context.request.query.timestamp, 10);
  const timestamp = rawTimestamp ? dayjs(rawTimestamp).utc().unix() : dayjs().utc().unix();

  const endpointIds = endpointId ? [ endpointId ] : (await api.endpoints().pluck('id'));

  const query = Measurement
    .whereIn('endpointId', endpointIds)
    .where('resolution', resolutionKey(resolution));

  const allMeasurements = await query
    .orderBy('timestamp')
    .get();

  const timespan = timespanByResolution(resolution);
  const start = timestamp - (numberOfMeasurements(resolution) * timespan);
  const end = timestamp;

  const filteredMeasurements = allMeasurements
    .filter(measurement => measurement.timestamp >= start && measurement.timestamp <= end)

  const mergedIds: string[] = [];
  const mergedMeasurements = filteredMeasurements.map(measurement => {
    if (mergedIds.includes(measurement.id)) {
      return;
    }

    const mergeableMeasurements = filteredMeasurements.filter(m => m.id !== measurement.id && m.timestamp === measurement.timestamp);

    mergedIds.push(...mergeableMeasurements.map(m => m.id));

    return merge(measurement, mergeableMeasurements);
  }).filter(Boolean) as Measurement[];

  const measurements = mergedMeasurements.map((measurement): CompactMeasurement => ({
    average: measurement.responseTimeAverage,
    endpointId: measurement.endpointId,
    id: measurement.id,
    max: measurement.responseTimeMax,
    min: measurement.responseTimeMin,
    statusCodes: measurement.statusCodes,
    timestamp: measurement.timestamp
  }));

  context.body = {
    meta: {
      start,
      end
    },
    measurements
  };
}
