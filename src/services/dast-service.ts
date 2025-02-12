// // import * as core from '@actions/core';
import appConfig from '../app-config';
// // import { Octokit } from '@octokit/rest';
// // import * as Checks from '../namespaces/Checks';
// // import { updateChecks } from './check-service';
// // import * as VeracodeApplication from '../namespaces/VeracodeApplication';
import * as http from '../api/http-request';
// // // import { Inputs, vaildateRemoveSandboxInput } from '../inputs';
// // import * as fs from 'fs/promises';
// // import { DefaultArtifactClient } from '@actions/artifact';

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

//     const applicationResponse: VeracodeApplication.ResultsData =
//       await http.getResourceByAttribute<VeracodeApplication.ResultsData>(vid, vkey, getApplicationByNameResource);

//     const applications = applicationResponse._embedded?.applications || [];
//     if (applications.length === 0) {
//       throw new Error(`No application found with name ${appname}`);
//     } else if (applications.length > 1) {
//       core.info(`Multiple applications found with name ${appname}, selecting the first found`);
//     }

//     return applications[0];
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // export async function removeSandbox(inputs: Inputs): Promise<void> {
// //   if(!vaildateRemoveSandboxInput(inputs)) {
// //     core.setFailed('sandboxname is required.');
// //   }
// //   const appname = inputs.appname;
// //   const vid = inputs.vid;
// //   const vkey = inputs.vkey;
// //   const sandboxName = inputs.sandboxname;

// //   let application:VeracodeApplication.Application;

// //   try {
// //     application = await getApplicationByName(appname, vid, vkey);
// //   } catch (error) {
// //     core.setFailed(`No application found with name ${appname}`);
// //     throw new Error(`No application found with name ${appname}`);
// //   }

// //   const appGuid = application.guid;

// //   let sandboxes: VeracodeApplication.Sandbox[];
// //   try {
// //     sandboxes = await getSandboxesByApplicationGuid(appGuid, vid, vkey);
// //   } catch (error) {
// //     throw new Error(`Error retrieving sandboxes for application ${appname}`);
// //   }

// //   const sandbox = sandboxes.find((s) => s.name === sandboxName);

// //   if (sandbox === undefined) {
// //     core.setFailed(`No sandbox found with name ${sandboxName}`);
// //     return;
// //   }
  
// //   try {
// //     const removeSandboxResource = {
// //       resourceUri: appConfig.api.veracode.sandboxUri.replace('${appGuid}', appGuid),
// //       resourceId: sandbox.guid,
// //     };

// //     await http.deleteResourceById(vid, vkey, removeSandboxResource);
// //   } catch (error) {
// //     core.debug(`Error removing sandbox:${error}`);
// //     core.setFailed(`Error removing sandbox ${sandboxName}`);
// //   }
// // }

// // async function getSandboxesByApplicationGuid(
// //   appGuid: string, 
// //   vid: string, 
// //   vkey: string
// // ): Promise<VeracodeApplication.Sandbox[]> {
// //   try {
// //     const getSandboxesByApplicationGuidResource = {
// //       resourceUri: appConfig.api.veracode.sandboxUri.replace('${appGuid}', appGuid),
// //       queryAttribute: '',
// //       queryValue: '',
// //     };

// //     const sandboxResponse: VeracodeApplication.SandboxResultsData =
// //       await http.getResourceByAttribute<VeracodeApplication.SandboxResultsData>(vid, vkey, getSandboxesByApplicationGuidResource);

// //     return sandboxResponse._embedded?.sandboxes || [];
// //   } catch (error) {
// //     console.error(error);
// //     throw error;
// //   }
// // }

// // export async function validateVeracodeApiCreds(inputs: Inputs): Promise<string | void> {
// //   const annotations: Checks.Annotation[] = [];
// //   const repo = inputs.source_repository.split('/');
// //   const ownership = {
// //     owner: repo[0],
// //     repo: repo[1],
// //   };

// //   const octokit = new Octokit({
// //     auth: inputs.token,
// //   });

// //   const checkStatic: Checks.ChecksStatic = {
// //     owner: ownership.owner,
// //     repo: ownership.repo,
// //     check_run_id: inputs.check_run_id,
// //     status: Checks.Status.Completed,
// //   };
// //   try {
// //     if (!inputs.vid || !inputs.vkey) {
// //       core.setFailed('Missing VERACODE_API_ID / VERACODE_API_KEY secret key.');
// //       annotations.push({
// //         path: '/',
// //         start_line: 0,
// //         end_line: 0,
// //         annotation_level: 'failure',
// //         title: 'Missing VERACODE_API_ID / VERACODE_API_KEY secret key.',
// //         message: 'Please configure the VERACODE_API_ID and VERACODE_API_KEY under the organization secrets.',
// //       });
// //       await updateChecks(
// //         octokit,
// //         checkStatic,
// //         Checks.Conclusion.Failure,
// //         annotations,
// //         'Missing VERACODE_API_ID / VERACODE_API_KEY secret key.',
// //       );
// //       return;
// //     }
// //     const getSelfUserDetailsResource = {
// //       resourceUri: appConfig.api.veracode.selfUserUri,
// //       queryAttribute: '',
// //       queryValue: '',
// //     };

// //     const applicationResponse: VeracodeApplication.SelfUserResultsData =
// //       await http.getResourceByAttribute<VeracodeApplication.SelfUserResultsData>(inputs.vid, inputs.vkey, getSelfUserDetailsResource);

// //     if (applicationResponse && applicationResponse?.api_credentials?.expiration_ts) {
// //       core.info(`VERACODE_API_ID and VERACODE_API_KEY is valid, Credentials expiration date - ${applicationResponse.api_credentials.expiration_ts}`);
// //     } else {
// //       core.setFailed('Invalid/Expired VERACODE_API_ID and VERACODE_API_KEY');
// //       annotations.push({
// //         path: '/',
// //         start_line: 0,
// //         end_line: 0,
// //         annotation_level: 'failure',
// //         title: 'Invalid/Expired VERACODE_API_ID and VERACODE_API_KEY.',
// //         message: 'Please check the VERACODE_API_ID and VERACODE_API_KEY configured under the organization secrets.',
// //       });
// //       await updateChecks(
// //         octokit,
// //         checkStatic,
// //         Checks.Conclusion.Failure,
// //         annotations,
// //         'Invalid/Expired VERACODE_API_ID and VERACODE_API_KEY.',
// //       );
// //       return;
// //     }
// //     return applicationResponse?.api_credentials?.expiration_ts;
// //   } catch (error) {
// //     core.debug(`Error while validating Veracode API credentials: ${error}`);
// //     await updateChecks(
// //       octokit,
// //       checkStatic,
// //       Checks.Conclusion.Failure,
// //       [],
// //       'Error while validating Veracode API credentials.',
// //     );
// //     throw error;
// //   }
// // }

// // export async function validatePolicyName(inputs: Inputs): Promise<void> {
// //   const annotations: Checks.Annotation[] = [];
// //   const repo = inputs.source_repository.split('/');
// //   const ownership = {
// //     owner: repo[0],
// //     repo: repo[1],
// //   };

// //   const octokit = new Octokit({
// //     auth: inputs.token,
// //   });

// //   const checkStatic: Checks.ChecksStatic = {
// //     owner: ownership.owner,
// //     repo: ownership.repo,
// //     check_run_id: inputs.check_run_id,
// //     status: Checks.Status.Completed,
// //   };
// //   try {
// //     if (!inputs.policyname) {
// //       if (inputs.break_build_invalid_policy == true) {
// //         core.setFailed('Missing Veracode Policy name in the config.')
// //       } else {
// //         core.error('Missing Veracode Policy name in the config.')
// //       }
// //       annotations.push({
// //         path: '/',
// //         start_line: 0,
// //         end_line: 0,
// //         annotation_level: 'failure',
// //         title: 'Missing Veracode Policy name in the config.',
// //         message: 'Please configure the Veracode policy name under the config file.',
// //       });
// //       await updateChecks(
// //         octokit,
// //         checkStatic,
// //         Checks.Conclusion.Failure,
// //         annotations,
// //         'Missing Veracode Policy name in the config.',
// //       );
// //       return;
// //     }
// //     const getPolicyResource = {
// //       resourceUri: appConfig.api.veracode.policyUri,
// //       queryAttribute: 'name',
// //       queryValue: encodeURIComponent(inputs.policyname),
// //     };

// //     annotations.push({
// //       path: inputs.path,
// //       start_line: inputs.start_line,
// //       end_line: inputs.end_line,
// //       annotation_level: 'failure',
// //       title: 'Invalid Veracode Policy name',
// //       message: 'Please check the policy name provided in the config file.',
// //     });

// //     const applicationResponse: VeracodeApplication.policyResultsData =
// //       await http.getResourceByAttribute<VeracodeApplication.policyResultsData>(inputs.vid, inputs.vkey, getPolicyResource);

// //     core.setOutput('total_elements', applicationResponse?.page?.total_elements);
// //     if (applicationResponse && applicationResponse?.page?.total_elements != 1) {
// //       await updateChecks(
// //         octokit,
// //         checkStatic,
// //         Checks.Conclusion.Failure,
// //         annotations,
// //         'Please check the policy name provided in the config file.',
// //       );
// //       if (inputs.break_build_invalid_policy == true) {
// //         core.setFailed('Invalid Veracode Policy name.')
// //       } else {
// //         core.error('Invalid Veracode Policy name.')
// //       }
// //     }
// //   } catch (error) {
// //     core.debug(`Error while validating invalid policy name: ${error}`);
// //     await updateChecks(
// //       octokit,
// //       checkStatic,
// //       Checks.Conclusion.Failure,
// //       [],
// //       'Error while validating policy name.',
// //     );
// //     throw error;
// //   }
// // }

// // export async function registerBuild(inputs: Inputs): Promise<void> {
// //   const filePath = 'workflow-metadata.json';
// //   const artifactName = 'workflow-metadata';
// //   try {
// //     const repo = inputs.source_repository.split('/');
// //     const ownership = {
// //       owner: repo[0],
// //       repo: repo[1],
// //     };
// //     const rootDirectory = process.cwd();
// //     const artifactClient = new DefaultArtifactClient();
// //     const metadata = {
// //       'check_run_type': inputs.event_type,
// //       'repository_name': ownership.repo,
// //       'check_run_id': inputs.check_run_id,
// //       'branch': inputs.branch,
// //       'sha': inputs.head_sha,
// //       'issue_trigger_flow': inputs.issue_trigger_flow ?? false,
// //     }
// //     await fs.writeFile(filePath, JSON.stringify(metadata, null, 2));
// //     await artifactClient.uploadArtifact(artifactName, [filePath], rootDirectory);
// //     core.info(`${artifactName} directory uploaded successfully under the artifact.`);
// //   } catch (error) {
// //     core.info(`Error while creating the ${artifactName} artifact ${error}`);
// //   }
// // }