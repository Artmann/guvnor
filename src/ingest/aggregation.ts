import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Measurement from '../models/measurement';
import RawMeasurement from '../models/raw-measurement';

dayjs.extend(utc);

export type Aggregation = {
  average: number;
  max: number;
  min: number;
}

export async function aggregate(): Promise<void> {
  var rawMeasurements = await RawMeasurement.limit(20).get();

  if (rawMeasurements.length === 0) {
    return;
  }

  const resolutions = {
    minute10: 60 * 10,
    hour: 60 * 60,
    day: 60 * 60 * 24
  };

  for (const [resolutionLabel, resolutionValue] of Object.entries(resolutions)) {
    for (let i = 0; i < rawMeasurements.length; i++) {
      const raw = rawMeasurements[i];

      if (!raw.responseTime) {
        continue;
      }

      const t = raw.timestamp;
      const timestamp = t - (t % resolutionValue);

      console.log(resolutionLabel, dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss'))

      let measurement = await Measurement
        .where('endpointId', raw.endpointId)
        .where('resolution', resolutionLabel)
        .where('timestamp', timestamp)
        .first();

      if (!measurement) {
        measurement = new Measurement();

        measurement.endpointId = raw.endpointId;
        measurement.resolution = resolutionLabel;
        measurement.timestamp = timestamp;
      }

      measurement.responseTimes.push(raw.responseTime);
      measurement.statusCodes.push(raw.statusCode);

      measurement.calculateResponseTimes();

      await measurement.save();
    }
  }

  for (let i = 0; i < rawMeasurements.length; i++) {
    await rawMeasurements[i].delete();
  }
}
