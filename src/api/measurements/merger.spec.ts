import Measurement from '../../models/measurement';
import { merge } from './merger';

describe('merger', () => {
  it('merges multiple measurements', () => {
    const m1 = new Measurement();
    const m2 = new Measurement();
    const m3 = new Measurement();

    m1.responseTimes = [ 500 ];
    m2.responseTimes = [ 200, 200 ];
    m3.responseTimes = [ 300, 300 ];

    m1.statusCodes = [ 200 ];
    m2.statusCodes = [ 404 ];
    m3.statusCodes = [ 500 ];

    const merged = merge(m1, [ m2, m3 ]);

    expect(merged.responseTimeMin).toEqual(200);
    expect(merged.responseTimeMax).toEqual(500);
    expect(merged.responseTimeAverage).toEqual(300);

    expect(merged.statusCodes).toEqual([ 200, 404, 500 ]);
  });
});
