# Veracode DAST Action

Veracode DAST Action starts Veracode DAST scan as an action on any GitHub pipeline. It requires a DAST scan to be already configured on the Veracode platform and restarts the scan.

## About

This action will simply use a little JSON file that is used to reconfigure the time to start and how long a scan should run.

## Usage
The action haas some required parameters

### `vid`
***Required*** - The Veracode API ID

### `vkey`
***Requireed*** - The Veracode API Key

### `dast_config_file_name`
***Requireed*** - The DAST Config File Name

### `token`
***Requireed*** - your GITHUB_TOKEN - This will be automatically set to ${{ github.token }}

### `owner`
***Requireed*** - owner of the repo - This will be automatically set to ${{ github.repository_owner }}

### `repo`
***Requireed*** - repo name - This will be automaticall set to  ${{ github.event.repository.name }}
    
