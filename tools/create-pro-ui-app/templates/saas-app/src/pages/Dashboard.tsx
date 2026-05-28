import { Statistic, Card, Alert, Steps } from '@dangbt/pro-ui'
import { DollarSign, Users, Zap } from 'lucide-react'
import { useState } from 'react'

export function DashboardPage() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Welcome back! 👋</h1>
        <p className="text-fg-muted text-sm mt-1">Here's your overview for today.</p>
      </div>

      {!dismissed && (
        <Alert variant="info" title="Getting started" onDismiss={() => setDismissed(true)}>
          Complete your setup to unlock all features.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <Statistic title="MRR" value={2480} prefix={<DollarSign size={14} />} trend="up" trendValue="+22%" formatter={(v) => `$${Number(v).toLocaleString()}`} />
        </Card>
        <Card>
          <Statistic title="Active Users" value={128} prefix={<Users size={14} />} trend="up" trendValue="+5%" />
        </Card>
        <Card>
          <Statistic title="Uptime" value="99.9%" prefix={<Zap size={14} />} trend="neutral" />
        </Card>
      </div>

      {/* Onboarding steps */}
      <Card header={<h2 className="font-semibold text-fg">Setup Progress</h2>}>
        <Steps
          current={1}
          items={[
            { title: 'Create account', description: 'Done!' },
            { title: 'Set up profile', description: 'In progress' },
            { title: 'Invite team', description: 'Pending' },
            { title: 'Go live', description: 'Coming soon' },
          ]}
        />
      </Card>
    </div>
  )
}
