import * as core from '@actions/core';
import { parseInputs } from './inputs';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as exec from '@actions/exec';
import { Octokit } from '@octokit/rest';
import * as dastService from './services/dast-service';
// import * as pipelineResultsService from './services/pipeline-results-service';
// import * as policyResultsService from './services/policy-results-services';
// import * as applicationService from './services/application-service';

/**
 * Runs the action.
 */
export async function run(): Promise<void> {
  const inputs = parseInputs(core.getInput);
  console.log('Inputs:', inputs);
  
  const token = core.getInput('token');
  const owner = core.getInput('owner');
  const repo = core.getInput('repo');
  const vid = core.getInput('vid');
  const vkey = core.getInput('vkey');

  try {
    const dast_input_file_name = inputs.dast_config_file_name;
    const octokit = new Octokit({ auth: `token ${token}` });
    // read the file from the source code repo
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: dast_input_file_name
    });
    if (response.status === 200 && response.data && 'content' in response.data) {
      // Decode Base64 content
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      const jsonContent = JSON.parse(content);
      await dastService.createDastProfileAndKickOffScan(vid, vkey, jsonContent);
      // console.log('Content:', content);
      // // Define output file path
      // const outputFilePath = path.resolve('input.json');

      // // Save content to input.json
      // fs.writeFileSync(outputFilePath, content, 'utf-8');
      // console.log(`Content successfully saved to ${outputFilePath}`);
    }
  } catch (error) {
    core.setFailed('File not found');
  }
}
