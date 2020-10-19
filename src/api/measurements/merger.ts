import Measurement from '../../models/measurement';

export function merge(base: Measurement, others: Measurement[]): Measurement {
  const responseTimes = [ base, ...others ].flatMap(m => m.responseTimes);
  const statusCodes = [ base, ...others ].flatMap(m => m.statusCodes);

  base.responseTimes = responseTimes;
  base.statusCodes = statusCodes;

  base.calculateResponseTimes();

  return base;
}
