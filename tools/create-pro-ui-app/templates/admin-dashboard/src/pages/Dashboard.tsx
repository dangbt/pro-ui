import { Statistic, Card, Badge, ProTable } from '@dangbt/pro-ui'
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import type { ProColumnType } from '@dangbt/pro-ui'

interface Order {
  id: string
  customer: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  date: string
}

const MOCK_ORDERS: Order[] = [
  { id: '1', customer: 'Alice Johnson', amount: 299, status: 'paid', date: '2026-05-28' },
  { id: '2', customer: 'Bob Smith', amount: 149, status: 'pending', date: '2026-05-27' },
  { id: '3', customer: 'Charlie Brown', amount: 599, status: 'paid', date: '2026-05-27' },
  { id: '4', customer: 'Diana Prince', amount: 89, status: 'failed', date: '2026-05-26' },
]

const orderColumns: ProColumnType<Order>[] = [
  { title: 'Customer', dataIndex: 'customer' },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (v) => `$${v}`,
    align: 'right',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      paid: { text: 'Paid', color: 'success' },
      pending: { text: 'Pending', color: 'warning' },
      failed: { text: 'Failed', color: 'danger' },
    },
  },
  { title: 'Date', dataIndex: 'date', valueType: 'date' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Dashboard</h1>
        <p className="text-fg-muted text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Statistic
            title="Revenue"
            value={48230}
            prefix={<DollarSign size={14} />}
            trend="up"
            trendValue="+12.5%"
            formatter={(v) => Number(v).toLocaleString()}
          />
        </Card>
        <Card>
          <Statistic
            title="Users"
            value={2847}
            prefix={<Users size={14} />}
            trend="up"
            trendValue="+8%"
          />
        </Card>
        <Card>
          <Statistic
            title="Orders"
            value={431}
            prefix={<ShoppingCart size={14} />}
            trend="neutral"
            trendValue="—"
          />
        </Card>
        <Card>
          <Statistic
            title="Growth"
            value="18.2%"
            prefix={<TrendingUp size={14} />}
            trend="up"
            trendValue="+3.1%"
          />
        </Card>
      </div>

      {/* Recent Orders Table */}
      <div>
        <ProTable<Order>
          headerTitle="Recent Orders"
          columns={orderColumns}
          rowKey="id"
          dataSource={MOCK_ORDERS}
          search={false}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    </div>
  )
}
