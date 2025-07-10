import { INITIATE_ORDER_TYPE } from "@/config/constants";

const ORDERS_TYPES = {
  PAID_ORDERS: 'Paid',
  UNPAIND_ORDERS: 'Unpaid',
  PARTIAL_PAID_ORDERS: 'Partial Paid',
  ALL_ORDERS: 'All Orders',
};

const CARDS_TYPES = {
  MASTER_CARD: 'MasterCard',
  VISA: 'Visa',
};

const PAYMENT_ERROR = 'Stripe API Error: Your card was declined.';

const ACADEMIC_LEVELS = [
  {
    id: 1,
    label: 'GCSE, GNVQ, A-level, A',
  },
  {
    id: 2,
    label: 'Master',
  },
  {
    id: 3,
    label: 'PHD',
  },
  {
    id: 4,
    label: 'Undergraduate',
  },
];

const TYPE_OF_PAPERS = [
  {
    value: 'Assignment',
    label: 'Assignment',
  },
  {
    value: 'Blog',
    label: 'Blog',
  },
  {
    value: 'case_study',
    label: 'Case Study',
  },
  {
    value: 'Coursework',
    label: 'Coursework',
  },
  {
    value: 'Dissertation',
    label: 'Dissertation',
  },
  {
    value: 'Dissertation Proposal',
    label: 'Dissertation Proposal',
  },
  {
    value: 'Essay',
    label: 'Essay',
  },
  {
    value: 'Literature Review',
    label: 'Literature Review',
  },
  {
    value: 'Non-word Assignments',
    label: 'Non-word Assignments',
  },
  {
    value: 'PowerPoint Presentation',
    label: 'PowerPoint Presentation',
  },
  {
    value: 'Proofreading & Editing',
    label: 'Proofreading & Editing',
  },
  {
    value: 'Publication',
    label: 'Publication',
  },
  {
    value: 'report',
    label: 'Report',
  },
  {
    value: 'Turnitin Report',
    label: 'Turnitin Report',
  },
];

const TYPE_OF_MEETING = [
  {
    value: 'Online Class',
    label: 'Online Class',
  },
  {
    value: 'Supervisor Meeting',
    label: 'Supervisor Meeting',
  },
  {
    value: 'Meeting with Tutor',
    label: 'Post-Order Meeting / Meeting with Tutor',
  },
];

const TYPE_OF_ORDERS = [
  {
    value: INITIATE_ORDER_TYPE.paper,
    label: INITIATE_ORDER_TYPE.paper,
  },
  {
    value: INITIATE_ORDER_TYPE.meeting,
    label: INITIATE_ORDER_TYPE.meeting,
  },
];

export {
  ORDERS_TYPES,
  CARDS_TYPES,
  PAYMENT_ERROR,
  ACADEMIC_LEVELS,
  TYPE_OF_PAPERS,
  TYPE_OF_MEETING,
  TYPE_OF_ORDERS,
};
