import { BaseModel } from 'esix';

export default class Endpoint extends BaseModel {
  public apiId = '';
  public method = 'GET';
  public path = '/';
}
