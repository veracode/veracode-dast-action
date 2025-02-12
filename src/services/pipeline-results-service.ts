// import * as core from '@actions/core';
// import { Octokit } from '@octokit/rest';
// import { DefaultArtifactClient } from '@actions/artifact';
// import * as fs from 'fs/promises';
// import * as Checks from '../namespaces/Checks';
// import * as VeracodePipelineResult from '../namespaces/VeracodePipelineResult';
// import * as VeracodePolicyResult from '../namespaces/VeracodePolicyResult';
// import { Inputs, vaildateScanResultsActionInput } from '../inputs';
// import { updateChecks } from './check-service';
// import { getApplicationByName } from './application-service';
// import { getApplicationFindings } from './findings-service';

// const LINE_NUMBER_SLOP = 3; //adjust to allow for line number movement

// export async function preparePipelineResults(inputs: Inputs): Promise<void> {
//   const repo = inputs.source_repository.split('/');
//   const ownership = {
//     owner: repo[0],
//     repo: repo[1],
//   };

//   const checkStatic: Checks.ChecksStatic = {
//     owner: ownership.owner,
//     repo: ownership.repo,
//     check_run_id: inputs.check_run_id,
//     status: Checks.Status.Completed,
//   };

//   const octokit = new Octokit({
//     auth: inputs.token,
//   });

//   // When the action is preparePolicyResults, need to make sure token,
//   // check_run_id and source_repository are provided
//   if (!vaildateScanResultsActionInput(inputs)) {
//     core.setFailed('token, check_run_id and source_repository are required.');
//     await updateChecks(
//       octokit,
//       checkStatic,
//       inputs.fail_checks_on_error ? Checks.Conclusion.Failure : Checks.Conclusion.Success,
//       [],
//       'Token, check_run_id and source_repository are required.',
//     );
//     return;
//   }

//   let findingsArray: VeracodePipelineResult.Finding[] = [];
//   let veracodePipelineResult;
//   try {
//     const data = await fs.readFile('filtered_results.json', 'utf-8');
//     const parsedData: VeracodePipelineResult.ResultsData = JSON.parse(data);
//     findingsArray = parsedData.findings;
//     veracodePipelineResult = JSON.parse(data);
//   } catch (error) {
//     core.debug(`Error reading or parsing filtered_results.json:${error}`);
//     core.setFailed('Error reading or parsing pipeline scan results.');
//     await updateChecks(
//       octokit,
//       checkStatic,
//       inputs.fail_checks_on_error ? Checks.Conclusion.Failure : Checks.Conclusion.Success,
//       [],
//       'Error reading or parsing pipeline scan results.',
//     );
//     return;
//   }

//   core.info(`Pipeline findings: ${findingsArray.length}`);

//   const filePath = 'filtered_results.json';
//   const artifactName = 'Veracode Pipeline-Scan Results - Mitigated findings';
//   const rootDirectory = process.cwd();
//   const artifactClient = new DefaultArtifactClient();

//   if (findingsArray.length === 0) {
//     try {
//       veracodePipelineResult.findings = [];
//       await fs.writeFile(filePath, JSON.stringify(veracodePipelineResult, null, 2));
//       await artifactClient.uploadArtifact(artifactName, [filePath], rootDirectory);
//       core.info(`${artifactName} directory uploaded successfully under the artifact.`);
//     } catch (error) {
//       core.info(`Error while updating the ${artifactName} artifact ${error}`);
//     }
//     core.info('No pipeline findings, exiting and update the github check status to success');
//     // update inputs.check_run_id status to success
//     await updateChecks(octokit, checkStatic, Checks.Conclusion.Success, [], 'No pipeline findings');
//     return;
//   }

//   let policyFindings: VeracodePolicyResult.Finding[] = [];

//   try {
//     const application = await getApplicationByName(inputs.appname, inputs.vid, inputs.vkey);
//     const applicationGuid = application.guid;
//     policyFindings = await getApplicationFindings(applicationGuid, inputs.vid, inputs.vkey);
//   } catch (error) {
//     core.info(`No application found with name ${inputs.appname}`);
//     policyFindings = [];
//   }

//   // What if no policy scan?
//   core.info(`Policy findings: ${policyFindings.length}`);

//   const filter_mitigated_flaws = inputs.filter_mitigated_flaws;
//   let policyFindingsToExlcude: VeracodePolicyResult.Finding[] = [];

//   if (filter_mitigated_flaws) {
//     // filter out policy findings based on violates_policy = true and finding_status.status = "CLOSED" and
//     // resolution = "POTENTIAL_FALSE_POSITIVE" or "MITIGATED" and resolution_status = "APPROVED"
//     policyFindingsToExlcude = policyFindings.filter((finding) => {
//       return (
//         finding.violates_policy === true &&
//         finding.finding_status.status === 'CLOSED' &&
//         (finding.finding_status.resolution === 'POTENTIAL_FALSE_POSITIVE' ||
//           finding.finding_status.resolution === 'MITIGATED') &&
//         finding.finding_status.resolution_status === 'APPROVED'
//       );
//     });
//   } else {
//     policyFindingsToExlcude = policyFindings.filter((finding) => {
//       return finding.violates_policy === true;
//     });
//   }

//   core.info(`Mitigated policy findings: ${policyFindingsToExlcude.length}`);

//   // Remove item in findingsArray if there are item in policyFindingsToExlcude if the file_path and
//   // cwe_id and line_number are the same
//   const filteredFindingsArray = findingsArray.filter((finding) => {
//     return !policyFindingsToExlcude.some((mitigatedFinding) => {
//       if (mitigatedFinding.finding_details.file_path.charAt(0) === '/') {
//         mitigatedFinding.finding_details.file_path = mitigatedFinding.finding_details.file_path.substring(1);
//       }
//       return (
//         finding.files.source_file.file === mitigatedFinding.finding_details.file_path &&
//         +finding.cwe_id === mitigatedFinding.finding_details.cwe.id &&
//         Math.abs(finding.files.source_file.line - mitigatedFinding.finding_details.file_line_number) <= LINE_NUMBER_SLOP
//       );
//     });
//   });

//   try {
//     veracodePipelineResult.findings = filteredFindingsArray;
//     await fs.writeFile(filePath, JSON.stringify(veracodePipelineResult, null, 2));
//     await artifactClient.uploadArtifact(artifactName, [filePath], rootDirectory);
//     core.info(`${artifactName} directory uploaded successfully under the artifact.`);
//   } catch (error) {
//     core.info(`Error while updating the ${artifactName} artifact ${error}`);
//   }

//   core.info(`Filtered pipeline findings: ${filteredFindingsArray.length}`);

//   if (filteredFindingsArray.length === 0) {
//     core.info('No pipeline findings after filtering, exiting and update the github check status to success');
//     // update inputs.check_run_id status to success
//     await updateChecks(octokit, checkStatic, Checks.Conclusion.Success, [], 'No pipeline findings');
//     return;
//   } else {
//     // use octokit to check the language of the source repository. If it is a java project, then
//     // use octokit to check if the source repository is using java maven or java gradle
//     // if so, filePathPrefix = 'src/main/java/'
//     const repoResponse = await octokit.repos.get(ownership);
//     const language = repoResponse.data.language;
//     core.info(`Source repository language: ${language}`);

//     let javaMaven = false;
//     if (language === 'Java') {
//       let pomFileExists = false;
//       let gradleFileExists = false;
//       try {
//         await octokit.repos.getContent({ ...ownership, path: 'pom.xml' });
//         pomFileExists = true;
//       } catch (error) {
//         core.debug(`Error reading or parsing source repository:${error}`);
//       }
//       try {
//         await octokit.repos.getContent({ ...ownership, path: 'build.gradle' });
//         gradleFileExists = true;
//       } catch (error) {
//         core.debug(`Error reading or parsing source repository:${error}`);
//       }
//       if (pomFileExists || gradleFileExists) javaMaven = true;
//     }

//     core.info('Pipeline findings after filtering, continue to update the github check status');

//     const annotations = getAnnotations(filteredFindingsArray, javaMaven);
//     const maxNumberOfAnnotations = 50;

//     for (let index = 0; index < annotations.length / maxNumberOfAnnotations; index++) {
//       const annotationBatch = annotations.slice(index * maxNumberOfAnnotations, (index + 1) * maxNumberOfAnnotations);
//       if (annotationBatch.length > 0) {
//         await updateChecks(
//           octokit,
//           checkStatic,
//           inputs.fail_checks_on_policy ? Checks.Conclusion.Failure : Checks.Conclusion.Success,
//           annotationBatch,
//           "Here's the summary of the scan result.",
//         );
//       }
//     }
//   }
// }

// function getAnnotations(pipelineFindings: VeracodePipelineResult.Finding[], javaMaven: boolean): Checks.Annotation[] {
//   const annotations: Checks.Annotation[] = [];
//   pipelineFindings.forEach(function (element) {
//     if (javaMaven) {
//       element.files.source_file.file = `src/main/java/${element.files.source_file.file}`;
//       if (element.files.source_file.file.includes('WEB-INF'))
//         element.files.source_file.file = element.files.source_file.file.replace(
//           /src\/main\/java\//, // Use regular expression for precise replacement
//           'src/main/webapp/',
//         );
//     }

//     const displayMessage = element.display_text
//       .replace(/<span>/g, '')
//       .replace(/<\/span> /g, '\n')
//       .replace(/<\/span>/g, '');
//     const message =
//       `Filename: ${element.files.source_file.file}\n` +
//       `Line: ${element.files.source_file.line}\n` +
//       `CWE: ${element.cwe_id} (${element.issue_type})\n\n${displayMessage}`;

//     annotations.push({
//       path: `${element.files.source_file.file}`,
//       start_line: element.files.source_file.line,
//       end_line: element.files.source_file.line,
//       annotation_level: 'warning',
//       title: element.issue_type,
//       message: message,
//     });
//   });
//   return annotations;
// }
