import { BaseModel } from 'esix';

type Regions = {
  'europe-west': boolean;
  'north-america-west': boolean;
  'north-america-east': boolean;
};

export const regions: Regions = {
  'europe-west': true,
  'north-america-east': false,
  'north-america-west': false
};

export type JobStatus = 'completed' | 'failed' | 'pending' | 'running';
export type Region = keyof Regions;

export default class MonitoringJob extends BaseModel {
  public endpointId = '';
  public region: Region = 'europe-west';
  public status: JobStatus = 'pending';
}
