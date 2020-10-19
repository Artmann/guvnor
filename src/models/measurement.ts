import { BaseModel } from 'esix';

export default class Measurement extends BaseModel {
  public endpointId = '';
  public region = '';

  public responseTimes: number[] = [];
  public responseTimeAverage = 0;
  public responseTimeMin = 0;
  public responseTimeMax = 0;

  public resolution = '';

  public statusCodes: number[] = [];

  public timestamp = 0;

  public errorMessage?: string;

  calculateResponseTimes() {
    this.responseTimeMin = this.responseTimes.length > 0 ? this.responseTimes.sort()[0] : 0;
    this.responseTimeMax = this.responseTimes.length > 0 ? this.responseTimes.sort()[this.responseTimes.length - 1] : 0;
    this.responseTimeAverage = this.responseTimes.length > 0 ? this.responseTimes.reduce((sum, v) => sum + v, 0) / this.responseTimes.length : 0;
  }
}
