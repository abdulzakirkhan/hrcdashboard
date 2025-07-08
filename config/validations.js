import * as Yup from 'yup';
import { INITIATE_ORDER_TYPE } from './constants';
import {
  generatePSTISOString,
  isWithinBusinessHoursInPakistan,
} from './helpers';
import { DateTime } from 'luxon';

const user_id_validator = Yup.string().required().label('* User ID or Email');
const secret_key_validtor = Yup.string().required().label('* Password');
const name_validator = Yup.string().required().label('* Name');
const email_validator = Yup.string().email().required().label('* Email');
const phone_number_validator = Yup.string()
  .required()
  .min(8)
  .max(12)
  .label('* Phone Number');
const amount_validator = Yup.string().required().label('* Amount');
const deadline_validator = Yup.string()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.paper) return schema.required();
    else return schema.notRequired();
  })
  .label('* Deadline');
const type_of_paper_validator = Yup.string()
  .required()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.paper)
      return schema.label('* Type of Paper');
    else return schema.label('* Type of Meeting');
  });
const currency_validator = Yup.string().required().label('* Currency');
const no_of_words_validator = Yup.string()
  .required()
  .label('* Number of Words');

const assignment_marks = Yup.string().required().label('* Assignment Marks');
const mark_sheet = Yup.mixed()
  .required('* Mark Sheet is required field')
  .label('* Mark Sheet');
const attachment_file = Yup.mixed()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.paper) return schema.required();
    else return schema.notRequired();
  })
  .label('* Attachment');
const no_of_Pages = Yup.string()
  .when(
    ['catagery', 'focusedOrderType'],
    (catagery, focusedOrderType, schema) => {
      if (focusedOrderType === INITIATE_ORDER_TYPE.meeting) {
        return schema.notRequired();
      } else if (catagery == 6) {
        return schema.notRequired();
      } else {
        return schema.required();
      }
    }
  )
  .label('* No of Pages');
const academic_level = Yup.string().required().label('* Academic Level');
const paper_Topic = Yup.string()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.paper) return schema.required();
    else return schema.notRequired();
  })
  .label('* Paper Topic');
const catagery_Type = Yup.string()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.paper) return schema.required();
    else return schema.notRequired();
  })
  .label('* Category Level');
const description_assignment = Yup.string().required().label('* Discription');
const tip_amount_validator = Yup.string().required().label('* Amount');
const other_amount_validator = Yup.string().required().label('* Amount');
const iT_Subject_Validator = Yup.string()
  .when(
    ['catagery', 'focusedOrderType'],
    (catagery, focusedOrderType, schema) => {
      if (catagery == 6 && focusedOrderType == INITIATE_ORDER_TYPE.paper)
        return schema.required();
      else return schema.notRequired();
    }
  )
  .label('* IT Subject');
const initaite_order_meeting_Start_time = Yup.string()
  .when(
    ['focusedOrderType', 'businessStartTime', 'businessEndTime'],
    (focusedOrderType, businessStartTime, businessEndTime, schema) => {
      if (focusedOrderType === INITIATE_ORDER_TYPE.meeting) {
        return schema
          .required('* Meeting Start Time is required')
          .test(
            'business_Start_Time',
            `* Meeting Start Time should be scheduled between ${DateTime.fromISO(
              generatePSTISOString(businessStartTime)
            ).toFormat('hh:mm a')} and ${DateTime.fromISO(
              generatePSTISOString(businessEndTime)
            ).toFormat('hh:mm a')}.`,
            function (value) {
              const { meetingStartTime, businessStartTime, businessEndTime } =
                this.parent; // Accessing sibling fields from parent object
              return isWithinBusinessHoursInPakistan(
                value,
                businessStartTime,
                businessEndTime
              );
            }
          );
      } else {
        return schema.notRequired();
      }
    }
  )
  .label('* Meeting Start Time');
const initaite_order_meeting_End_time = Yup.string()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.meeting)
      return schema.required();
    else return schema.notRequired();
  })
  .label('* Meeting End Time');
const initaite_order_meeting_date = Yup.string()
  .when('focusedOrderType', (focusedOrderType, schema) => {
    if (focusedOrderType == INITIATE_ORDER_TYPE.meeting)
      return schema.required();
    else return schema.notRequired();
  })
  .label('* Meeting Date');
const new_password_validator = Yup.string()
  .required()
  .min(8)
  .matches(/[0-9]/, '* New Password must contain at least one digit')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    '* New Password must contain at least one special character'
  )
  .label('* New Password');

const confirm_password_validator = Yup.string()
  .oneOf([Yup.ref('newPassword'), null], '* Passwords must match')
  .required()
  .min(8)
  .label('* Confrim Password');

const old_password_validator = Yup.string().required().label('* Old Password');

const existing_order_pyt_method_option_amount = Yup.number()
  .nullable() // Allow null
  .transform(
    (value, originalValue) => (originalValue.trim() === '' ? null : value) // Convert empty string to null
  )
  .moreThan(0, '* Amount must be greater than 0')
  .when('orderPrice', (orderPrice, schema) => {
    return schema.test(
      'is-10-or-between',
      `* Amount should be in between ${1} and ${orderPrice}`,
      (value) => value === orderPrice || (value > 0 && value <= orderPrice) // Ensure value is less than or equal to orderPrice
    );
  });

export {
  user_id_validator,
  secret_key_validtor,
  name_validator,
  email_validator,
  phone_number_validator,
  amount_validator,
  deadline_validator,
  type_of_paper_validator,
  currency_validator,
  no_of_words_validator,
  assignment_marks,
  mark_sheet,
  attachment_file,
  no_of_Pages,
  academic_level,
  paper_Topic,
  catagery_Type,
  description_assignment,
  tip_amount_validator,
  other_amount_validator,
  new_password_validator,
  confirm_password_validator,
  old_password_validator,
  iT_Subject_Validator,
  initaite_order_meeting_Start_time,
  initaite_order_meeting_End_time,
  initaite_order_meeting_date,
  existing_order_pyt_method_option_amount,
};
