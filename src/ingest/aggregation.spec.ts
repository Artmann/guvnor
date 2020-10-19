jest.mock('../models/raw-measurement');

import dayjs from 'dayjs';
import { QueryBuilder } from 'esix';
import { createMock } from 'ts-auto-mock';
import { mocked } from 'ts-jest/utils';

import RawMeasurement from '../models/raw-measurement';
import { aggregate } from './aggregation';

const queryBuilderMock = createMock<QueryBuilder<RawMeasurement>>();
mocked(RawMeasurement.limit).mockReturnValue(queryBuilderMock);

function createMeasurements(data: any[]): RawMeasurement[] {
  const measurements = data.map(item => {
    const measurement = new RawMeasurement();

    measurement.createdAt = item.createdAt;
    measurement.endpointId = item.endpointId;
    measurement.responseTime = item.responseTime;
    measurement.statusCode = item.statusCode;

    return measurement;
  });

  return measurements;
}


describe('aggregation', () => {
  describe('aggregate', () => {
    it.skip('aggregates values on an hourly basis', async() => {
      const data = [
        {
          endpointId: 'e1',
          statusCode: 200,
          responseTime: 100,
          createdAt: dayjs('2020-01-01 11:59:59').unix()
        },
        {
          endpointId: 'e1',
          statusCode: 200,
          responseTime: 500,
          createdAt: dayjs('2020-01-01 12:30:32').unix()
        },
        {
          endpointId: 'e1',
          statusCode: 200,
          responseTime: 200,
          createdAt: dayjs('2020-01-01 12:45:53').unix()
        },
        {
          endpointId: 'e1',
          statusCode: 200,
          responseTime: 200,
          createdAt: dayjs('2020-01-01 13:10:00').unix()
        },
      ];

      mocked(queryBuilderMock.get).mockResolvedValue(createMeasurements(data));

      await aggregate();
    });
  });
});
