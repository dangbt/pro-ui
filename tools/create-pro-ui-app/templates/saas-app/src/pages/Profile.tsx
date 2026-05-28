import { z } from 'zod'
import { ProForm, ProFormInput, ProFormTextarea, Card, Avatar, toast } from '@dangbt/pro-ui'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(200, 'Bio max 200 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfilePage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Profile</h1>
        <p className="text-fg-muted text-sm mt-1">Update your personal information</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <Avatar name="Admin User" size="xl" />
          <div>
            <p className="font-medium text-fg">Admin User</p>
            <p className="text-fg-muted text-sm">admin@example.com</p>
          </div>
        </div>

        <ProForm<ProfileValues>
          schema={profileSchema}
          defaultValues={{ name: 'Admin User', email: 'admin@example.com' }}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 600))
            console.log('profile updated:', values)
            toast.success('Profile updated successfully!')
          }}
          submitText="Update Profile"
        >
          <ProFormInput name="name" label="Full Name" placeholder="John Doe" />
          <ProFormInput name="email" label="Email" type="email" />
          <ProFormTextarea name="bio" label="Bio" placeholder="Tell us about yourself..." />
          <ProFormInput name="website" label="Website" placeholder="https://yoursite.com" />
        </ProForm>
      </Card>
    </div>
  )
}
