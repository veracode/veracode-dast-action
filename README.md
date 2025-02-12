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

## Example usage

```yaml
name: Veracode DAST

jobs:
    Submit-DAST-Scan:
        runs-on: ubuntu-latest
        steps:
            - name: Submit Veracode DAST Scan
              uses: veracode-australia/veracode-dast-action@main with:
                vid: ${{ secrets.VERACODE_API_ID }}
                vkey: ${{ secrets.VERACODE_API_KEY }}
                dast_config_file_name: input.json
                owner: Veracode-DemoLabs repo: verademo-javascript
                token: ${{ secrets.GITHUB_TOKEN }}
```

An exampkle JSON file would look like this
```json
{
  "name": "Name-of-Your-Dynamic-Analysis",
  "schedule": {
    "start_date": "2020-09-26T02:00+00:00",
    "duration": {
      "length": 3,
      "unit": "DAY"
    }
  }
}
````
A full documentation about the JSON payload and the API used in the background can be found on [here]https://docs.veracode.com/r/c_dynamic_intro)