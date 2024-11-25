import { v4 as uuidv4 } from 'uuid';

// Types
export interface Product {
  name: string;
  dimensions: string;
  weight: string;
}

export interface Order {
  order_id: string;
  order_placed_timestamp: string;
  order_status: 'OPEN' | 'SHIPPED' | 'DELIVERED';
  product: {
    name: string;
    dimensions: string;
    weight: string;
    quantity: number;
  };
  customer_address: string;
  warehouse_address: string;
  seller_address: string;
}

export interface Document {
  id: string;
  orderId: string;
  name: string;
  type: 'Invoice' | 'Shipping' | 'Customs' | 'Insurance' | 'Label';
  date: string;
  size: string;
  status: 'Draft' | 'Final' | 'Approved' | 'Rejected';
  url: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  orderId: string;
  origin: string;
  destination: string;
  status: 'Order Received' | 'Order Picked' | 'Order in Transit' | 'Out For Delivery' | 'Reached Destination';
  carrier: string;
  type: string;
  eta: string;
  lastUpdate: string;
  progress: number;
  tracking: Array<{
    id: string;
    timestamp: string;
    location: string;
    status: string;
    description: string;
    type: 'Order Received' | 'Order Picked' | 'Order in Transit' | 'Out For Delivery' | 'Reached Destination';
  }>;
}

// Sample data
const products: Product[] = [
  {
    name: 'iPhone 15 Pro Max',
    dimensions: '15.9 x 7.67 x 0.83 cm',
    weight: '221g'
  },
  {
    name: 'MacBook Pro M3',
    dimensions: '30.41 x 21.24 x 1.55 cm',
    weight: '1.55kg'
  },
  {
    name: 'iPad Pro 12.9"',
    dimensions: '28.06 x 21.49 x 0.64 cm',
    weight: '682g'
  },
  {
    name: 'Apple Watch Series 9',
    dimensions: '4.51 x 3.84 x 1.07 cm',
    weight: '51.5g'
  }
];

const destinations = [
  {
    country: 'USA',
    address: 'John Smith, 123 Tech Plaza, New York, NY 10001, USA'
  },
  {
    country: 'UK',
    address: 'Emma Watson, 45 Innovation Street, London, SW1A 1AA, UK'
  },
  {
    country: 'Australia',
    address: 'James Cook, 78 Digital Avenue, Sydney, NSW 2000, Australia'
  }
];

const warehouseAddress = 'ExportEdge Fulfillment Center, Sector 5, MIDC, Andheri East, Mumbai, 400093, India';

// Generate mock orders
export const MOCK_ORDERS: Record<string, Order> = {};

// Current order (OPEN status)
MOCK_ORDERS['ORD334256'] = {
  order_id: 'ORD334256',
  order_placed_timestamp: new Date().toISOString(),
  order_status: 'OPEN',
  product: {
    name: 'iPhone 15 Pro Max',
    dimensions: '15.9 x 7.67 x 0.83 cm',
    weight: '221g',
    quantity: 2
  },
  customer_address: destinations[0].address,
  warehouse_address: warehouseAddress,
  seller_address: warehouseAddress
};

// Generate past orders (all DELIVERED)
for (let i = 1; i <= 29; i++) {
  const orderNumber = 334257 + i;
  const daysAgo = Math.floor(Math.random() * 30) + 1;
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  const product = products[Math.floor(Math.random() * products.length)];
  const destination = destinations[Math.floor(Math.random() * destinations.length)];
  const quantity = Math.floor(Math.random() * 3) + 1;

  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - daysAgo);
  timestamp.setHours(timestamp.getHours() - hoursAgo);
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

  MOCK_ORDERS[`ORD${orderNumber}`] = {
    order_id: `ORD${orderNumber}`,
    order_placed_timestamp: timestamp.toISOString(),
    order_status: 'DELIVERED',
    product: {
      name: product.name,
      dimensions: product.dimensions,
      weight: product.weight,
      quantity: quantity
    },
    customer_address: destination.address,
    warehouse_address: warehouseAddress,
    seller_address: warehouseAddress
  };
}

// Generate mock documents
export const MOCK_DOCUMENTS: Record<string, Document> = {};

Object.keys(MOCK_ORDERS).forEach(orderId => {
  const docTypes = ['Invoice', 'Shipping', 'Customs'];
  docTypes.forEach((type, index) => {
    const docId = `DOC-${orderId}-${type.toUpperCase()}`;
    MOCK_DOCUMENTS[docId] = {
      id: docId,
      orderId: orderId,
      name: `${type} Document`,
      type: type as Document['type'],
      date: MOCK_ORDERS[orderId].order_placed_timestamp,
      size: '245 KB',
      status: 'Final',
      url: `https://aws-exportedge-dev-order-processing-bucket.s3.us-east-1.amazonaws.com/orders_docs/${orderId}/${orderId}_${type.toLowerCase()}.pdf`
    };
  });
});

// Generate mock shipments
export const MOCK_SHIPMENTS: Record<string, Shipment> = {};

Object.keys(MOCK_ORDERS).forEach(orderId => {
  const shipmentId = `SHP-${orderId}`;
  const trackingNumber = `TRK${Math.floor(100000 + Math.random() * 900000)}`;
  const order = MOCK_ORDERS[orderId];
  const isDelivered = order.order_status === 'DELIVERED';

  const shipment: Shipment = {
    id: shipmentId,
    tracking_number: trackingNumber,
    orderId: orderId,
    origin: 'Mumbai, India',
    destination: order.customer_address.split(',').slice(-2, -1)[0].trim(),
    status: isDelivered ? 'Reached Destination' : 'Order in Transit',
    carrier: ['DHL', 'FedEx', 'UPS', 'Bluedart'][Math.floor(Math.random() * 4)],
    type: 'Express Air Freight',
    eta: new Date(order.order_placed_timestamp).toISOString(),
    lastUpdate: 'Package in transit',
    progress: isDelivered ? 100 : 65,
    tracking: [
      {
        id: uuidv4(),
        timestamp: order.order_placed_timestamp,
        location: 'Mumbai, India',
        status: 'Order Received',
        description: 'Order has been received',
        type: 'Order Received'
      },
      {
        id: uuidv4(),
        timestamp: order.order_placed_timestamp,
        location: 'Mumbai, India',
        status: 'Order Picked',
        description: 'Order has been picked',
        type: 'Order Picked'
      },
      {
        id: uuidv4(),
        timestamp: order.order_placed_timestamp,
        location: 'Mumbai, India',
        status: isDelivered ? 'Reached Destination' : 'Order in Transit',
        description: isDelivered ? 'Package delivered' : 'Package in transit',
        type: isDelivered ? 'Reached Destination' : 'Order in Transit'
      }
    ]
  };

  MOCK_SHIPMENTS[shipmentId] = shipment;
});