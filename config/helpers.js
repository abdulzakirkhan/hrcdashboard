// import { COUNTRY_DETAILS, DSS_DEFAULT_COUNTRY } from '@libs/inputs/constants';
// import { ChangeUser } from '@modules/Auth/store/authSlice';
// import { ORDERS_TYPES } from '@modules/Orders/constants';
// import navigationRoutes from '@navigation/routes/navigationRoutes';
// import { api } from '@services/index';
// import store from '@store/index';
import parsePhoneNumber from 'libphonenumber-js';
import { DateTime } from 'luxon';
// import { Alert } from 'react-native';
// import { OneSignal } from 'react-native-onesignal';

// import { APP_NAME_CODES } from '@config/constants';
import {
  ALL_CURRENCIES_OBJ,
  APP_NAME_CODES,
  NEW_SEC_CURRENCIES,
  SEC_DSS_DEFAULT_CURRENCY,
  UserRole,
} from './constants';
import { appNameCode } from './index';
import { COUNTRY_DETAILS, DSS_DEFAULT_COUNTRY } from '@/lib/inputs/constants';
import store from '@/redux/store';

const getSizeFromPercentage = (percentage, totalSize) => {
  if (percentage && totalSize) return (percentage * totalSize) / 100;
};

const handleVerifiedOnpress = (
  isVerified = false,
  verifedOnpress,
  navigation,
  unverifiedMessageReason
) => {
  if (isVerified) verifedOnpress();
  else {
    Alert.alert(
      'Unverified Phone Number',
      `You need to verify your number to perform further action for ${unverifiedMessageReason}`,
      [
        {
          text: 'Verify Phone Number',
          style: 'default',
          onPress: () => navigation?.navigate(navigationRoutes.VERIFY_NUMBER),
        },
        {
          text: 'Cancel',
          style: 'default',
        },
      ]
    );
  }
};

const getOrderTypeValues = (type) => {
  if (type == ORDERS_TYPES.PAID_ORDERS) return '1';
  else if (type == ORDERS_TYPES.UNPAIND_ORDERS) return '0';
  else if (type == ORDERS_TYPES.PARTIAL_PAID_ORDERS) return '2';
  else if (type == ORDERS_TYPES.ALL_ORDERS) return '3';
};

const getOrderTypeName = (value) => {
  if (value == '1') return ORDERS_TYPES.PAID_ORDERS;
  else if (value == '0') return ORDERS_TYPES.UNPAIND_ORDERS;
  else if (value == '2') return ORDERS_TYPES.PARTIAL_PAID_ORDERS;
  else if (value == '3') return ORDERS_TYPES.ALL_ORDERS;
};

const getCurrency = (inputString) => {
  if (inputString) {
    inputString = inputString.trim();
    let lastSpaceIndex = inputString.lastIndexOf(' ');
    let lastWord = inputString.substring(lastSpaceIndex + 1);
    return lastWord;
  } else return '';
};

const getCurrencyFromCode = (currencyCode) => {
  if (currencyCode) {
    const currencyName = ALL_CURRENCIES_OBJ?.[currencyCode]?.name;
    return currencyName;
  } else return '';
};

const isLocalUri = (uri) => {
  const localPrefixes = [
    'file://',
    'content://',
    'asset://',
    'https://',
    'http://',
  ];
  if (uri) return localPrefixes.some((prefix) => uri.startsWith(prefix));
  else return true;
};

const calculatePaymentFees = (paymentAmount) => {
  const storeValues = store?.getState();
  const fee = Number(storeValues?.shared?.serviceChargePercentage);
  return (fee * paymentAmount) / 100;
};

const calculatePaymentVatFees = (paymentAmount) => {
  const storeValues = store?.getState();

  const fee = Number(storeValues?.shared?.vatFeePercentage);
  return (fee * paymentAmount) / 100;
};

const getRoleSwitchingValues = (roles, activeRole) => {
  let switchBtnTitle = '';
  let switchTo = '';

  if (!roles?.includes(UserRole.agent)) {
    switchBtnTitle = 'Become an Agent';
    // switchTo=UserRole.agent;
  } else {
    if (activeRole == UserRole.agent) {
      switchBtnTitle = 'Switch to Student Mode';
      switchTo = UserRole.client;
    } else {
      switchBtnTitle = 'Switch to Agent Mode';
      switchTo = UserRole.agent;
    }
  }

  return { switchBtnTitle, switchTo };
};

const getFormattedPrice = (price) => {
  if (price) {
    const truncatedAmount = Math.trunc(price * 100) / 100;
    return truncatedAmount.toFixed(2);
  } else return '0.00';
};

const getFormattedPriceWith3 = (price) => {
  if (price) {
    const truncatedAmount = Math.trunc(price * 100) / 100;
    return truncatedAmount.toFixed(3);
  } else return '0.00';
};

const getStringAfterLastCharacter = (character, inputString) => {
  var lastIndex = inputString.lastIndexOf(character);

  if (lastIndex !== -1) {
    var substringAfterLastCharacter = inputString
      .substring(lastIndex + 1)
      .trim();
    return substringAfterLastCharacter;
  } else {
    return '';
  }
};

const getCurrencySymbol = (currencyName) => {
  if (currencyName) {
    const currencyCode = getStringAfterLastCharacter('-', currencyName);
    const currencySymbol = ALL_CURRENCIES_OBJ?.[currencyCode]?.symbol;
    return currencySymbol;
  } else return '';
};

const formatSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
};

const getConsumableAmounts = (
  walletAmount = 0,
  rewardAmount = 0,
  orderAmount = 0
) => {
  let walletConsumableAmount = 0;
  let rewardConsumableAmount = 0;
  let totalWalletConsumableAmount = 0;
  let cardConsumableAmount = 0;
  let additionalAmount = 0;

  let minimumCardAmount = store?.getState()?.shared?.minimumCardAmount ?? 0.6;

  // First, consume from rewards (high priority)
  rewardConsumableAmount = Math.min(rewardAmount, orderAmount);
  orderAmount -= rewardConsumableAmount;

  // If order amount is still remaining, consume from wallet
  if (orderAmount > 0) {
    walletConsumableAmount = Math.min(walletAmount, orderAmount);
    orderAmount -= walletConsumableAmount;
  }

  // Calculate total wallet consumable amount
  totalWalletConsumableAmount = rewardConsumableAmount + walletConsumableAmount;

  // Handle card consumable amount
  if (orderAmount > 0) {
    cardConsumableAmount = orderAmount;
  }

  // Ensure cardConsumableAmount meets minimumCardAmount
  if (cardConsumableAmount > 0 && cardConsumableAmount < minimumCardAmount) {
    additionalAmount = minimumCardAmount - cardConsumableAmount;
    cardConsumableAmount = minimumCardAmount;
  }

  return {
    walletConsumableAmount: Number(walletConsumableAmount) ?? 0,
    rewardConsumableAmount: Number(rewardConsumableAmount) ?? 0,
    totalWalletConsumableAmount: Number(totalWalletConsumableAmount) ?? 0,
    cardConsumableAmount: Number(cardConsumableAmount) ?? 0,
    additionalAmount: Number(additionalAmount) ?? 0, // New property
  };
};

const getIntOrderConsumableAmnts = (
  walletAmount = 0,
  rewardAmount = 0,
  orderAmount = 0,
  discountPercent = 0, // Discount percentage based on initial order amount
  isWithVat = false
) => {
  const storeValues = store?.getState();
  const minimumCardAmount = Number(
    storeValues?.shared?.minimumCardAmount ?? 0.6
  );
  const SERVICE_FEE_PERCENT = Number(
    storeValues?.shared?.serviceChargePercentage ?? 4
  );
  const VAT_PERCENT = Number(
    isWithVat ? storeValues?.shared?.vatFeePercentage ?? 20 : 0
  );

  let walletConsumableAmount = 0;
  let rewardConsumableAmount = 0;
  let totalWalletConsumableAmount = 0;
  let cardConsumableAmount = 0;
  let finalDiscountAmount = 0;
  let actualServiceFee = 0;
  let actualVatFee = 0;
  let additionalAmount = 0;

  // Apply discount directly to the order amount
  finalDiscountAmount = (discountPercent / 100) * orderAmount;
  orderAmount -= finalDiscountAmount;

  // First, consume from rewards (high priority)
  rewardConsumableAmount = Math.min(rewardAmount, orderAmount);
  orderAmount -= rewardConsumableAmount;

  // If order amount is still remaining, consume from wallet
  if (orderAmount > 0) {
    walletConsumableAmount = Math.min(walletAmount, orderAmount);
    orderAmount -= walletConsumableAmount;
  }

  // Calculate total wallet consumable amount before card fees
  totalWalletConsumableAmount = rewardConsumableAmount + walletConsumableAmount;

  // Check if there is any remaining amount that needs to be covered by card
  if (orderAmount > 0) {
    cardConsumableAmount = orderAmount;

    // Ensure card amount meets the minimumCardAmount
    if (minimumCardAmount > 0 && cardConsumableAmount < minimumCardAmount) {
      additionalAmount = minimumCardAmount - cardConsumableAmount;
      cardConsumableAmount = minimumCardAmount;
    }

    // Recalculate service fee and VAT based on the adjusted card amount
    actualServiceFee = (SERVICE_FEE_PERCENT / 100) * cardConsumableAmount;
    actualVatFee = (VAT_PERCENT / 100) * cardConsumableAmount;

    // Add service fee and VAT to card amount
    cardConsumableAmount += actualServiceFee + actualVatFee;
  } else {
    // Recalculate total wallet consumable amount if no card amount is used
    totalWalletConsumableAmount =
      walletConsumableAmount + rewardConsumableAmount;
  }

  return {
    walletConsumableAmount: Number(walletConsumableAmount) ?? 0,
    rewardConsumableAmount: Number(rewardConsumableAmount) ?? 0,
    totalWalletConsumableAmount: Number(totalWalletConsumableAmount) ?? 0,
    cardConsumableAmount: Number(cardConsumableAmount) ?? 0,
    finalDiscountAmount: Number(finalDiscountAmount) ?? 0,
    actualServiceFee: Number(actualServiceFee) ?? 0,
    actualVatFee: Number(actualVatFee) ?? 0,
    additionalAmount: Number(additionalAmount) ?? 0,
  };
};

const getCountryCodeforUsCa = (phoneNumber) => {
  // Define known U.S. and Canadian area codes
  const usAreaCodes = [
    '201',
    '202',
    '203',
    '205',
    '206',
    '207',
    '208',
    '209',
    '210',
    '212',
    '213',
    '214',
    '215',
    '216',
    '217',
    '218',
    '219',
    '224',
    '225',
    '227',
    '228',
    '229',
    '231',
    '234',
    '239',
    '240',
    '248',
    '251',
    '252',
    '253',
    '254',
    '256',
    '260',
    '262',
    '267',
    '269',
    '270',
    '272',
    '274',
    '276',
    '279',
    '281',
    '283',
    '301',
    '302',
    '303',
    '304',
    '305',
    '307',
    '308',
    '309',
    '310',
    '312',
    '313',
    '314',
    '315',
    '316',
    '317',
    '318',
    '319',
    '320',
    '321',
    '323',
    '325',
    '327',
    '330',
    '331',
    '332',
    '334',
    '336',
    '337',
    '339',
    '346',
    '347',
    '351',
    '352',
    '360',
    '361',
    '364',
    '380',
    '385',
    '386',
    '401',
    '402',
    '404',
    '405',
    '406',
    '407',
    '408',
    '409',
    '410',
    '412',
    '413',
    '414',
    '415',
    '417',
    '419',
    '423',
    '424',
    '425',
    '430',
    '432',
    '434',
    '435',
    '440',
    '442',
    '443',
    '445',
    '447',
    '458',
    '463',
    '469',
    '470',
    '475',
    '478',
    '479',
    '480',
    '484',
    '501',
    '502',
    '503',
    '504',
    '505',
    '507',
    '508',
    '509',
    '510',
    '512',
    '513',
    '515',
    '516',
    '517',
    '518',
    '520',
    '530',
    '531',
    '534',
    '539',
    '540',
    '541',
    '551',
    '559',
    '561',
    '562',
    '563',
    '564',
    '567',
    '570',
    '571',
    '573',
    '574',
    '575',
    '580',
    '585',
    '586',
    '601',
    '602',
    '603',
    '605',
    '606',
    '607',
    '608',
    '609',
    '610',
    '612',
    '614',
    '615',
    '616',
    '617',
    '618',
    '619',
    '620',
    '623',
    '626',
    '628',
    '629',
    '630',
    '631',
    '636',
    '641',
    '646',
    '650',
    '651',
    '657',
    '659',
    '660',
    '661',
    '662',
    '667',
    '669',
    '678',
    '679',
    '681',
    '682',
    '689',
    '701',
    '702',
    '703',
    '704',
    '706',
    '707',
    '708',
    '712',
    '713',
    '714',
    '715',
    '716',
    '717',
    '718',
    '719',
    '720',
    '724',
    '725',
    '727',
    '730',
    '731',
    '732',
    '734',
    '737',
    '740',
    '743',
    '747',
    '754',
    '757',
    '760',
    '762',
    '763',
    '765',
    '769',
    '770',
    '772',
    '773',
    '774',
    '775',
    '779',
    '781',
    '785',
    '786',
    '801',
    '802',
    '803',
    '804',
    '805',
    '806',
    '808',
    '810',
    '812',
    '813',
    '814',
    '815',
    '816',
    '817',
    '818',
    '820',
    '828',
    '830',
    '831',
    '832',
    '835',
    '838',
    '839',
    '843',
    '845',
    '847',
    '848',
    '850',
    '854',
    '856',
    '857',
    '858',
    '859',
    '860',
    '862',
    '863',
    '864',
    '865',
    '870',
    '872',
    '878',
    '901',
    '903',
    '904',
    '906',
    '907',
    '908',
    '909',
    '910',
    '912',
    '913',
    '914',
    '915',
    '916',
    '917',
    '918',
    '919',
    '920',
    '925',
    '928',
    '929',
    '930',
    '931',
    '935',
    '936',
    '937',
    '938',
    '940',
    '941',
    '945',
    '947',
    '949',
    '951',
    '952',
    '954',
    '956',
    '959',
    '970',
    '971',
    '972',
    '973',
    '975',
    '978',
    '979',
    '980',
    '984',
    '985',
    '989',
  ];

  const canadaAreaCodes = [
    '204',
    '226',
    '236',
    '249',
    '250',
    '289',
    '306',
    '343',
    '365',
    '387',
    '403',
    '416',
    '418',
    '431',
    '437',
    '438',
    '450',
    '506',
    '514',
    '519',
    '548',
    '579',
    '581',
    '587',
    '604',
    '613',
    '639',
    '647',
    '672',
    '705',
    '709',
    '742',
    '778',
    '780',
    '782',
    '807',
    '819',
    '825',
    '867',
    '873',
    '902',
    '905',
  ];

  // Extract the area code from the phone number
  const areaCode = phoneNumber.slice(2, 5);

  // Determine the country based on the area code
  if (usAreaCodes.includes(areaCode)) {
    return 'US';
  } else if (canadaAreaCodes.includes(areaCode)) {
    return 'CA';
  } else {
    return 'US';
  }
};

const getCurrencyNameFromPhone = (phoneNumber) => {
  if (appNameCode == APP_NAME_CODES.DIGITAL_SKY_SERVICES) {
    if (phoneNumber) {
      return SEC_DSS_DEFAULT_CURRENCY.currency;
    } else return '';
  } else {
    if (phoneNumber) {
    } else return '';
  }
  let countryCode = parsePhoneNumber(phoneNumber)?.country;
  if (!countryCode) {
    countryCode = getCountryCodeforUsCa(phoneNumber);
  }
  const currencyName = NEW_SEC_CURRENCIES?.find(
    (currentCurrency) => currentCurrency.countryCode == countryCode
  )?.currency;
  return currencyName;
};

const getCountryNameFromPhone = (phoneNumber) => {
  if (appNameCode == APP_NAME_CODES.DIGITAL_SKY_SERVICES) {
    if (phoneNumber) {
      return DSS_DEFAULT_COUNTRY?.name;
    } else return '';
  } else {
    if (phoneNumber) {
      let countryCode = parsePhoneNumber(phoneNumber)?.country;
      if (!countryCode) {
        countryCode = getCountryCodeforUsCa(phoneNumber);
      }
      const countryName = COUNTRY_DETAILS?.find(
        (currentCountry) => currentCountry.code == countryCode
      )?.name;
      return countryName;
    }
  }
};

const percentOfAmount = (amount, percent) => {
  return (amount * percent) / 100;
};

const getTimeDifference = (startTime, endTime) => {
  // Parse the provided times using luxon
  try {
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);

    // Calculate the difference between the two times
    const diff = end.diff(start, ['hours', 'minutes']);

    // Extract hours and minutes
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);

    // Format the result as "X hour(s) Y minute(s)"
    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return result.trim();
  } catch (error) {
    return '';
  }
};

const isWithinBusinessHoursInPakistan = (
  meetingStartTime,
  businessStartTime = 9,
  businessEndTime = 17
) => {
  // Convert the provided date to Pakistan Standard Time (PST)
  const dateInPakistan =
    DateTime.fromISO(meetingStartTime).setZone('Asia/Karachi');

  // Extract the hour from the Pakistan time
  const hour = dateInPakistan.hour;

  // Check if the time is within the provided business hours
  const isWithinBusinessHours =
    hour >= businessStartTime && hour < businessEndTime;

  return isWithinBusinessHours;
};

const generatePSTISOString = (hour) => {
  let pstDateTime = DateTime.now()
    .setZone('Asia/Karachi')
    .set({ hour: hour, minute: 0, second: 0, millisecond: 0 });

  return pstDateTime.toISO();
};

const getFormatedDate = (DATE) => {
  let numOfSecondsFormCurrent = 0;

  try {
    const formatedDate = DateTime?.fromISO(DATE);
    const now = DateTime.now();

    // Check if the formatedDate is in the past
    if (formatedDate <= now) {
      numOfSecondsFormCurrent = 0;
    }

    const secondsDiff = formatedDate.diff(now, 'seconds').seconds;

    numOfSecondsFormCurrent = Math.floor(secondsDiff);
  } catch (error) {}

  return {
    numOfSecondsFormCurrent:
      numOfSecondsFormCurrent > 0 ? numOfSecondsFormCurrent : 0,
  };
};

const getOrderCountdownSeconds = (date, time) => {
  // Create DateTime object from input date and time in Pakistan Standard Time
  const deadline = DateTime.fromISO(`${date}T${time}`, {
    zone: 'Asia/Karachi',
  });

  // Get the current DateTime in Pakistan Standard Time
  const now = DateTime.now();

  // Calculate the difference in seconds
  const diffInSeconds = deadline.diff(now, 'seconds').seconds;

  // If the deadline has passed, return 0, otherwise return the positive difference
  return diffInSeconds > 0 ? Math.round(diffInSeconds) : 0;
};

const getColor = (isLightColor, param) => {
  let color;

  // Map the param to a base hue (range of 0 to 360 degrees for HSL)
  const baseHue = getBaseHue(param);

  // Generate a distinct HSL color for the given param
  let hue = baseHue;
  let saturation = 70 + (param % 30); // Vary saturation slightly for interest
  let lightness = 50 + ((param * 10) % 20); // Vary lightness slightly

  // Adjust lightness to make sure it's light or dark based on the `isLightColor` flag
  if (isLightColor) {
    lightness = Math.min(90, lightness + 20); // Increase lightness for light colors
  } else {
    lightness = Math.max(30, lightness - 20); // Decrease lightness for dark colors
  }

  // Convert HSL to HEX color
  color = hslToHex(hue, saturation, lightness);

  return color;

  function getBaseHue(param) {
    // Assign distinct color families (hues) for different `param` values
    if (param === 1) return 0; // Red
    if (param === 2) return 240; // Blue
    if (param === 3) return 120; // Green
    if (param === 4) return 60; // Yellow
    return (param * 60) % 360; // For larger values, continue cycling through hues
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    const rgb = [r + m, g + m, b + m];
    return (
      '#' +
      rgb
        .map((x) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
    );
  }
};

const getNotificationDateFormat = (date) => {
  const inputDate = DateTime.fromISO(date, 'dd MMM yyyy');

  // Check if the date is invalid
  if (!inputDate.isValid) {
    return 'Invalid DateTime';
  }

  const today = DateTime.local().startOf('day');
  const yesterday = today.minus({ days: 1 });

  if (inputDate.hasSame(today, 'day')) {
    return 'Today';
  } else if (inputDate.hasSame(yesterday, 'day')) {
    return 'Yesterday';
  } else {
    return inputDate.toFormat('dd LLL yyyy'); // "15 Nov 2024"
  }
};

const prepareNotificationSectionList = (notifications) => {
  if (!notifications || notifications.length === 0) {
    return []; // Return empty array if notifications are undefined or empty
  }

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const formattedDate = DateTime.fromISO(notification.ts).toFormat(
      'yyyy-MM-dd'
    );
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(notification);
    return acc;
  }, {});

  // Convert grouped notifications to SectionList format
  const sections = Object.keys(groupedNotifications)
    .sort(
      (a, b) => DateTime.fromISO(b).toMillis() - DateTime.fromISO(a).toMillis()
    ) // Sort by date descending
    .map((date) => ({
      title: DateTime.fromISO(date),
      data: groupedNotifications[date],
    }));

  return sections;
};

// const getAppLogo = () => {
//   if (appNameCode == APP_NAME_CODES.HYBRID_RESEARCH_CENTER)
//     return require('@assets/images/logo.png');
//   else if (appNameCode == APP_NAME_CODES.DIGITAL_SKY_SERVICES)
//     return require('@assets/images/dssLogo.png');
//   else if (appNameCode == APP_NAME_CODES.BRAIN_BENCH)
//     return require('@assets/images/bbLogo.png');
//   else return require('@assets/images/logo.png');
// };

const removeAdminFromURL = (url) => {
  return url.replace(/\/admin$/, '');
};

const logout = () => {
  store.dispatch(ChangeUser(null));
  store.dispatch(api.util.resetApiState());
  try {
    // OneSignal.User.removeTag('userId');
  } catch (error) {}
};

export {
  calculatePaymentFees,
  calculatePaymentVatFees,
  formatSeconds,
  generatePSTISOString,
  // getAppLogo,
  getColor,
  getConsumableAmounts,
  getCountryNameFromPhone,
  getCurrency,
  getCurrencyFromCode,
  getCurrencyNameFromPhone,
  getCurrencySymbol,
  getFormatedDate,
  getFormattedPrice,
  getFormattedPriceWith3,
  getIntOrderConsumableAmnts,
  getNotificationDateFormat,
  getOrderCountdownSeconds,
  getOrderTypeName,
  getOrderTypeValues,
  getRoleSwitchingValues,
  getSizeFromPercentage,
  getStringAfterLastCharacter,
  getTimeDifference,
  handleVerifiedOnpress,
  isLocalUri,
  isWithinBusinessHoursInPakistan,
  logout,
  percentOfAmount,
  prepareNotificationSectionList,
  removeAdminFromURL,
};
