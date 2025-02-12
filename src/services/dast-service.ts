import appConfig from '../app-config';
import * as http from '../api/http-request';


export async function createDastProfileAndKickOffScan(
  vid: string,
  vkey: string,
  dastConfig: string
): Promise<void> {
  try {
    const createDastResource = {
      resourceUri: appConfig.api.veracode.dastUri,
      body: dastConfig,
    };
    console.log('createDastResource:', createDastResource);
    await http.postResource<void>(vid, vkey, createDastResource);
  } catch (error) {
    console.error(error);
    throw error;
  }
}