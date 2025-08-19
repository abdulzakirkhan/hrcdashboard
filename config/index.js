
// import { APP_NAME_CODES } from './constants';

import { APP_NAME_CODES } from "./constants";

const baseUrl = 'https://staging.portalteam.org';


const appNameCode = "hrc";
const appVersion = '2.2';

let privacyPolicyLink = '';
let oneSignalId = '';
let webAppUrl = 'https://www.hybridresearchcenter.com/';
let androidAppUrl = '';
let iosAppUrl = '';

if (appNameCode == "hrc") {
  privacyPolicyLink = 'https://hybridresearchcenter.com/Privacypolicy';
  webAppUrl = 'https://www.hybridresearchcenter.com/';
  androidAppUrl =
    'https://play.google.com/store/apps/details?id=com.hybridresearchcenter';
  iosAppUrl =
    'https://apps.apple.com/us/app/hybrid-research-center/id6444208842';
}

export {
  androidAppUrl,
  appNameCode,
  appVersion,
  baseUrl,
  iosAppUrl,
  oneSignalId,
  privacyPolicyLink,
  webAppUrl,
};
