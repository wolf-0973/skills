# When to Mock

只在**系统边界** mock：

- 外部 API（支付、邮件等）
- 数据库（优先测试库；仅当共享库不可控时才 mock）
- 时间 / 随机性
- 文件系统（仅当 I/O 不可控时）

## Designing for Mockability

**1. Dependency injection** — 外部依赖传入，不在内部 `new`：

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Prefer SDK-style over generic fetchers** — 每个外部操作用独立函数：

```typescript
// GOOD: each function independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch("/orders", { method: "POST", body: data }),
};

// BAD: mock needs conditional logic
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```
