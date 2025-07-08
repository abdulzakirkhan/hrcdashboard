import { ORDERS_TYPES } from '@modules/Orders/constants';
import { getOrderTypeName, getOrderTypeValues } from './helpers';

const clientsLabelValues = [
  {
    id: 1,
    title: 'OOP',
    pieValue: 35,
  },
  {
    id: 2,
    title: 'Data Structure',
    pieValue: 10,
  },
  {
    id: 3,
    title: 'Business',
    pieValue: 5,
  },
  {
    id: 4,
    title: 'English',
    pieValue: 20,
  },
  {
    id: 5,
    title: 'Eassy Writing',
    pieValue: 5,
  },
  {
    id: 6,
    title: 'Calculas',
    pieValue: 25,
  },
];

const batchesData = [
  {
    batchNo: '1',
    title: 'Bachelors - Computer Science',
    type: 'Assignment',
    qty: '5',
    description:
      'The impact of Artificial Intelligence (AI) spans industries, transforming processes through automation, improved decision-making, and personalized experiences. AI enhances productivity, reduces costs, and drives innovation, but also raises concerns about job displacement, privacy, and ethical challenges. Its rapid adoption continues to reshape society and the global economy.',
    downloadFile:
      'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
    price: '$50.00',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PARTIAL_PAID_ORDERS),
    orderPlacedDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    orders: [
      {
        id: '12450',
        clientName: 'John Doe',
        completePercentage: 20,
        orderStatus: 'In Progress',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$50.00',
        marks: '',
        downloadFile: '',
      },
      {
        id: '12451',
        clientName: 'Albert John',
        completePercentage: 100,
        orderStatus: 'Completed',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$99.00',
        marks: '87',
        downloadFile:
          'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
      },
      {
        id: '12452',
        clientName: 'Abdullah',
        completePercentage: 0,
        orderStatus: '',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.UNPAIND_ORDERS),
        price: '$150.00',
        marks: '',
        downloadFile: '',
      },
    ],
  },
  {
    batchNo: '2',
    title: 'Bachelors - Computer Science',
    type: 'Assignment',
    qty: '5',
    description:
      'The impact of Artificial Intelligence (AI) spans industries, transforming processes through automation, improved decision-making, and personalized experiences. AI enhances productivity, reduces costs, and drives innovation, but also raises concerns about job displacement, privacy, and ethical challenges. Its rapid adoption continues to reshape society and the global economy.',
    downloadFile: '',
    price: '$50.00',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PARTIAL_PAID_ORDERS),
    orderPlacedDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    orders: [
      {
        id: '12450',
        clientName: 'John Doe',
        completePercentage: 20,
        orderStatus: 'In Progress',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$50.00',
        marks: '',
        downloadFile: '',
      },
      {
        id: '12451',
        clientName: 'Albert',
        completePercentage: 100,
        orderStatus: 'Completed',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$99.00',
        marks: '87',
        downloadFile:
          'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
      },
      {
        id: '12452',
        clientName: 'Abdullah',
        completePercentage: 0,
        orderStatus: '',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.UNPAIND_ORDERS),
        price: '$150.00',
        marks: '',
        downloadFile: '',
      },
    ],
  },
  {
    batchNo: '3',
    title: 'Bachelors - Computer Science',
    type: 'Assignment',
    qty: '5',
    description:
      'The impact of Artificial Intelligence (AI) spans industries, transforming processes through automation, improved decision-making, and personalized experiences. AI enhances productivity, reduces costs, and drives innovation, but also raises concerns about job displacement, privacy, and ethical challenges. Its rapid adoption continues to reshape society and the global economy.',
    downloadFile: '',
    price: '$50.00',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PARTIAL_PAID_ORDERS),
    orderPlacedDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    orders: [
      {
        id: '12450',
        clientName: 'John Doe',
        completePercentage: 20,
        orderStatus: 'In Progress',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$50.00',
        marks: '',
        downloadFile: '',
      },
      {
        id: '12451',
        clientName: 'Albert',
        completePercentage: 100,
        orderStatus: 'Completed',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$99.00',
        marks: '87',
        downloadFile:
          'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
      },
      {
        id: '12452',
        clientName: 'Abdullah',
        completePercentage: 0,
        orderStatus: '',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.UNPAIND_ORDERS),
        price: '$150.00',
        marks: '',
        downloadFile: '',
      },
    ],
  },
  {
    batchNo: '4',
    title: 'Bachelors - Computer Science',
    type: 'Assignment',
    qty: '5',
    description:
      'The impact of Artificial Intelligence (AI) spans industries, transforming processes through automation, improved decision-making, and personalized experiences. AI enhances productivity, reduces costs, and drives innovation, but also raises concerns about job displacement, privacy, and ethical challenges. Its rapid adoption continues to reshape society and the global economy.',
    downloadFile: '',
    price: '$50.00',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PARTIAL_PAID_ORDERS),
    orderPlacedDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    orders: [
      {
        id: '12450',
        clientName: 'John Doe',
        completePercentage: 20,
        orderStatus: 'In Progress',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$50.00',
        marks: '',
        downloadFile: '',
      },
      {
        id: '12451',
        clientName: 'Albert',
        completePercentage: 100,
        orderStatus: 'Completed',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$99.00',
        marks: '87',
        downloadFile:
          'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
      },
      {
        id: '12452',
        clientName: 'Abdullah',
        completePercentage: 0,
        orderStatus: '',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.UNPAIND_ORDERS),
        price: '$150.00',
        marks: '',
        downloadFile: '',
      },
    ],
  },
  {
    batchNo: '5',
    title: 'Bachelors - Computer Science',
    type: 'Assignment',
    qty: '5',
    description:
      'The impact of Artificial Intelligence (AI) spans industries, transforming processes through automation, improved decision-making, and personalized experiences. AI enhances productivity, reduces costs, and drives innovation, but also raises concerns about job displacement, privacy, and ethical challenges. Its rapid adoption continues to reshape society and the global economy.',
    downloadFile: '',
    price: '$50.00',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PARTIAL_PAID_ORDERS),
    orderPlacedDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    orders: [
      {
        id: '12450',
        clientName: 'John Doe',
        completePercentage: 20,
        orderStatus: 'In Progress',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$50.00',
        marks: '',
        downloadFile: '',
      },
      {
        id: '12451',
        clientName: 'Albert',
        completePercentage: 100,
        orderStatus: 'Completed',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
        price: '$99.00',
        marks: '87',
        downloadFile:
          'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
      },
      {
        id: '12452',
        clientName: 'Abdullah',
        completePercentage: 0,
        orderStatus: '',
        paymentStatus: getOrderTypeValues(ORDERS_TYPES.UNPAIND_ORDERS),
        price: '$150.00',
        marks: '',
        downloadFile: '',
      },
    ],
  },
];

const clientOrders=[
  {
    id: '12450',
    clientName: 'John Doe',
    completePercentage: 20,
    orderStatus: 'In Progress',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
    price: '$50.00',
    marks: '',
    downloadFile: '',
  },
  {
    id: '12451',
    clientName: 'Albert',
    completePercentage: 100,
    orderStatus: 'Completed',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.PAID_ORDERS),
    price: '$99.00',
    marks: '87',
    downloadFile:
      'https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc',
  },
  {
    id: '12452',
    clientName: 'Abdullah',
    completePercentage: 0,
    orderStatus: '',
    paymentStatus: getOrderTypeValues(ORDERS_TYPES.UNPAIND_ORDERS),
    price: '$150.00',
    marks: '',
    downloadFile: '',
  },
]

const inboxData=[
  {
    id:1,
    name:'Albert',
    pic:'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8MA%3D%3D',
    lastMsg:'Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.',
    unreadMsgs:2,
  },
  {
    id:2,
    name:'Huzefa Tariq',
    pic:'https://images.unsplash.com/photo-1650110002977-3ee8cc5eac91?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8MA%3D%3D',
    lastMsg:'Lorem ipsum dolor sit amet consectetur.',
    unreadMsgs:1,
  },
  {
    id:3,
    name:'Abdullah',
    pic:'https://images.unsplash.com/photo-1669475535925-a011d7c31d45?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBwaWN8ZW58MHx8MHx8fDA%3D',
    lastMsg:'Lorem ipsum dolor sit amet consectetur.',
    unreadMsgs:0,
  },
  {
    id:1,
    name:'Natasha',
    pic:'https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8MA%3D%3D',
    lastMsg:'Lorem ipsum dolor sit amet consectetur.',
    unreadMsgs:0,
  },
]

export { batchesData, clientsLabelValues,clientOrders,inboxData };

