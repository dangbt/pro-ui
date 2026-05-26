import { useState, type ComponentType } from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from '../../lib/cn'
import { SectionHeader } from '../shared'

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>

const ICON_GROUPS: { group: string; names: string[] }[] = [
  { group: 'Arrows & Navigation', names: ['ChevronLeft','ChevronRight','ChevronUp','ChevronDown','ChevronsUpDown','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','ArrowUpRight','ArrowDownLeft','MoveHorizontal','CornerDownRight','CornerUpLeft'] },
  { group: 'Actions', names: ['Plus','Minus','X','Check','Trash2','Pencil','Copy','ClipboardCheck','Save','Download','Upload','Share2','ExternalLink','Link','RefreshCw','RotateCcw','Search','Filter','SlidersHorizontal','ZoomIn','ZoomOut'] },
  { group: 'UI & Layout', names: ['Menu','LayoutDashboard','Sidebar','PanelLeft','PanelRight','Columns2','Rows2','Grid2x2','List','MoreHorizontal','MoreVertical','GripVertical','Maximize2','Minimize2','Expand','Shrink'] },
  { group: 'Files & Data', names: ['File','FileText','FileCode','FileSpreadsheet','FilePlus','FileX','Folder','FolderOpen','FolderPlus','Database','Table','Package'] },
  { group: 'Status & Feedback', names: ['Info','AlertTriangle','AlertCircle','CheckCircle2','XCircle','HelpCircle','Shield','ShieldCheck','Lock','Unlock','Eye','EyeOff','Loader','Loader2','RefreshCw','Wifi','WifiOff'] },
  { group: 'Communication', names: ['Bell','BellOff','Mail','MessageSquare','MessageCircle','Phone','Send','Inbox','AtSign','Hash','Reply'] },
  { group: 'Users & People', names: ['User','Users','UserPlus','UserMinus','UserCheck','UserX','Contact','Building','Building2','Globe'] },
  { group: 'Media & Content', names: ['Image','Video','Music','Mic','MicOff','Camera','Play','Pause','Square','Volume2','VolumeX','Bookmark','Star','Heart','Tag'] },
  { group: 'Time & Location', names: ['Clock','Clock3','Calendar','CalendarDays','Map','MapPin','Navigation','Compass','Home','Flag'] },
  { group: 'Dev & Tech', names: ['Code','Code2','Terminal','GitBranch','GitCommit','GitMerge','Github','Cpu','Server','Wifi','Database','Cloud','CloudUpload','Settings','Settings2','Wrench','Zap'] },
]

function IconCard({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null

  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(name).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
      title={`Click to copy: ${name}`}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-[var(--base-radius)] border transition-all text-center group',
        copied ? 'border-primary bg-primary-50 text-primary' : 'border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900',
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className={cn('text-[10px] font-mono leading-tight break-all', copied ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600')}>
        {copied ? '✓ copied' : name}
      </span>
    </button>
  )
}

export function IconsSection() {
  const [search, setSearch] = useState('')

  const filtered = ICON_GROUPS.map(g => ({
    ...g,
    names: g.names.filter(n => n.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.names.length > 0)

  return (
    <div className="space-y-8">
      <SectionHeader title="Icons" description="Powered by lucide-react. Click any icon to copy its name. Import with: import { IconName } from 'lucide-react'" />

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full">
          <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter icons..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-gray-300 rounded-[var(--base-radius)] placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {search && <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No icons match "{search}"</div>
      ) : (
        <div className="space-y-8">
          {filtered.map(group => (
            <div key={group.group}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-700">{group.group}</h3>
                <span className="text-xs text-gray-400">{group.names.length}</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1">
                {group.names.map(name => <IconCard key={name} name={name} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[var(--base-radius)] border border-gray-200 overflow-hidden">
        <div className="px-3.5 py-2 border-b border-gray-100 bg-gray-50/80">
          <span className="text-[11px] font-mono font-medium text-gray-400 tracking-wide">Usage example</span>
        </div>
        <pre className="px-5 py-4 text-xs font-mono text-gray-300 bg-gray-950 overflow-x-auto leading-6">
          <span className="text-gray-500">{'// Install\n'}</span>
          <span className="text-emerald-400">{'npm install lucide-react\n\n'}</span>
          <span className="text-gray-500">{'// Import & use\n'}</span>
          <span className="text-blue-300">{'import'}</span>
          <span className="text-gray-300">{' { Bell, Settings, Search } '}</span>
          <span className="text-blue-300">{'from'}</span>
          <span className="text-yellow-300">{" 'lucide-react'\n\n"}</span>
          <span className="text-gray-300">{'<Bell '}</span>
          <span className="text-blue-300">{'className'}</span>
          <span className="text-gray-300">{'='}</span>
          <span className="text-yellow-300">{'"w-5 h-5"'}</span>
          <span className="text-gray-300">{' '}</span>
          <span className="text-blue-300">{'strokeWidth'}</span>
          <span className="text-gray-300">{'='}</span>
          <span className="text-yellow-300">{'{1.5}'}</span>
          <span className="text-gray-300">{' />'}</span>
        </pre>
      </div>
    </div>
  )
}
