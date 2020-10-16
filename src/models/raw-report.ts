import { BaseModel } from 'esix';

export default class RawReport extends BaseModel {
  public endpointId = '';
  public statusCode = 0;
  public region = '';
  public responseTime = 0;
}
