import { BaseModel } from 'esix';

export default class RawMeasurement extends BaseModel {
  public endpointId = '';
  public statusCode = 0;
  public region = '';
  public responseTime = 0;
  public timestamp = 0;

  public errorMessage?: string;
}
