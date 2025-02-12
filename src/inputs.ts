import { InputOptions } from '@actions/core';

type GetInput = (name: string, options?: InputOptions | undefined) => string;


export type Inputs = {
  vid: string;
  vkey: string;
  dast_config_file_name: string;
  token: string;
  owner: string;
  repo: string;
};

export const parseInputs = (getInput: GetInput): Inputs => {
  const vid = getInput('vid');
  const vkey = getInput('vkey');
  const dast_config_file_name = getInput('dast_config_file_name');
  const token = getInput('token');
  const owner = getInput('owner');
  const repo = getInput('repo');
  return { vid, vkey, dast_config_file_name, token, owner, repo } as Inputs;
};
