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
}
