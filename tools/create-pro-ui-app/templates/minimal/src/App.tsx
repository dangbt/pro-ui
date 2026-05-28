import { Button, Card, Badge, toast, useTheme } from '@dangbt/pro-ui'

export default function App() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-fg">Hello, pro-ui! 👋</h1>
            <Badge variant="success">Ready</Badge>
          </div>

          <p className="text-fg-muted text-sm">
            Your React + @dangbt/pro-ui app is set up. Start building!
          </p>

          <div className="flex gap-2 flex-wrap">
            <Button variant="solid" onPress={() => toast.success('It works!')}>
              Test Toast
            </Button>
            <Button
              variant="outline"
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
