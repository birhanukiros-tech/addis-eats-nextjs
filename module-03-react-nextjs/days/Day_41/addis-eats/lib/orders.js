const orders = new Map();

export function saveOrder(order) {
  orders.set(order.id, order);

  return order;
}

export function getOrder(orderId) {
  return orders.get(orderId);
}

export function updateOrder(orderId, updates) {
  const order = orders.get(orderId);

  if (!order) {
    return null;
  }

  const updatedOrder = {
    ...order,
    ...updates,
  };

  orders.set(orderId, updatedOrder);

  return updatedOrder;
}