import { BaseModel } from 'esix';
import Endpoint from './endpoint';

export default class Api extends BaseModel {
  public name = '';
  public url = '';

  endpoints() {
    return this.hasMany(Endpoint);
  }
}

