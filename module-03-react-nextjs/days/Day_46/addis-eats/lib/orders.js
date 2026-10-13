const globalForOrders = globalThis;

globalForOrders.addisEatsOrders ??= new Map();

const orders = globalForOrders.addisEatsOrders;

export function saveOrder(order) {
  orders.set(String(order.id), order);

  return order;
}

export function getOrder(orderId) {
  return orders.get(String(orderId));
}

export function getAllOrders() {
  return Array.from(orders.values());
}

export function getOrdersFor(customerId) {
  return Array.from(orders.values()).filter(
    (order) => order.customerId === customerId
  );
}

export function updateOrder(orderId, updates) {
  const key = String(orderId);
  const order = orders.get(key);

  if (!order) {
    return null;
  }

  const updatedOrder = {
    ...order,
    ...updates,
  };

  orders.set(key, updatedOrder);

  return updatedOrder;
}