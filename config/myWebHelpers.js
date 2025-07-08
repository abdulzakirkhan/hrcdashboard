import { ORDERS_TYPES } from "./constants";

const getOrderTypeValues = (type) => {
  if (type == ORDERS_TYPES.PAID_ORDERS) return '1';
  else if (type == ORDERS_TYPES.UNPAIND_ORDERS) return '0';
  else if (type == ORDERS_TYPES.PARTIAL_PAID_ORDERS) return '2';
  else if (type == ORDERS_TYPES.ALL_ORDERS) return '3';
};


export {
  getOrderTypeValues,
};