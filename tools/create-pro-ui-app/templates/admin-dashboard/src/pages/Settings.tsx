import { z } from 'zod'
import { ProForm, ProFormInput, ProFormSelect, ProFormSwitch, Card, Alert, toast } from '@dangbt/pro-ui'
import { useState } from 'react'

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email address'),
  timezone: z.string(),
})

const notifSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
})

type ProfileValues = z.infer<typeof profileSchema>
type NotifValues = z.infer<typeof notifSchema>

export function SettingsPage() {
  const [profileSaved, setProfileSaved] = useState(false)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Settings</h1>
        <p className="text-fg-muted text-sm mt-1">Manage your account preferences</p>
      </div>

      {profileSaved && (
        <Alert variant="success" onDismiss={() => setProfileSaved(false)}>
          Profile saved successfully!
        </Alert>
      )}

      <Card header={<h2 className="font-semibold text-fg">Profile</h2>}>
        <ProForm<ProfileValues>
          schema={profileSchema}
          defaultValues={{ displayName: 'Admin User', email: 'admin@example.com', timezone: 'Asia/Ho_Chi_Minh' }}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500))
            console.log('profile saved:', values)
            setProfileSaved(true)
          }}
          submitText="Save Profile"
        >
          <ProFormInput name="displayName" label="Display Name" />
          <ProFormInput name="email" label="Email Address" type="email" />
          <ProFormSelect
            name="timezone"
            label="Timezone"
            options={[
              { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (UTC+7)' },
              { value: 'UTC', label: 'UTC' },
              { value: 'America/New_York', label: 'America/New York (UTC-5)' },
              { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
            ]}
          />
        </ProForm>
      </Card>

      <Card header={<h2 className="font-semibold text-fg">Notifications</h2>}>
        <ProForm<NotifValues>
          schema={notifSchema}
          defaultValues={{ emailNotifications: true, marketingEmails: false, securityAlerts: true }}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 300))
            console.log('notifications saved:', values)
            toast.success('Notification preferences saved!')
          }}
          submitText="Save Preferences"
        >
          <ProFormSwitch name="emailNotifications" label="Email Notifications" />
          <ProFormSwitch name="marketingEmails" label="Marketing Emails" />
          <ProFormSwitch name="securityAlerts" label="Security Alerts" />
        </ProForm>
      </Card>
    </div>
  )
}
