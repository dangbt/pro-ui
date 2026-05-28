import { z } from 'zod'
import { ProForm, ProFormInput, ProFormCheckbox, Card, toast } from '@dangbt/pro-ui'
import { useNavigate } from 'react-router-dom'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">MyApp</h1>
          <p className="text-fg-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <Card>
          <ProForm<LoginValues>
            schema={loginSchema}
            onSubmit={async ({ email }) => {
              await new Promise((r) => setTimeout(r, 800))
              toast.success(`Welcome back, ${email}!`)
              navigate('/dashboard')
            }}
            submitText="Sign In"
          >
            <ProFormInput name="email" label="Email" type="email" placeholder="you@example.com" />
            <ProFormInput name="password" label="Password" type="password" placeholder="••••••••" />
            <ProFormCheckbox name="rememberMe" label="Remember me for 30 days" />
          </ProForm>
        </Card>

        <p className="text-center text-sm text-fg-muted">
          Don't have an account?{' '}
          <a href="#" className="text-primary hover:underline font-medium">
            Sign up free
          </a>
        </p>
      </div>
    </div>
  )
}
