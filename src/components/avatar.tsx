import { User } from 'lucide-react'
import { cn } from '../lib/cn'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  shape?: 'circle' | 'square'
  className?: string
}

interface AvatarGroupProps {
  avatars: AvatarProps[]
  max?: number
  size?: AvatarSize
  className?: string
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500',
  'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500',
]

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]!
}

export function Avatar({ src, name, size = 'md', shape = 'circle', className }: AvatarProps) {
  const radiusCls = shape === 'circle' ? 'rounded-full' : 'rounded-[var(--base-radius)]'

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'avatar'}
        className={cn('object-cover shrink-0', sizeMap[size], radiusCls, className)}
      />
    )
  }

  if (name) {
    return (
      <div
        aria-label={name}
        className={cn(
          'flex items-center justify-center text-white font-semibold shrink-0',
          sizeMap[size],
          radiusCls,
          colorForName(name),
          className,
        )}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-200 text-gray-400 shrink-0',
        sizeMap[size],
        radiusCls,
        className,
      )}
    >
      <User className="w-1/2 h-1/2" />
    </div>
  )
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const shown = avatars.slice(0, max)
  const rest = avatars.length - max

  return (
    <div className={cn('flex -space-x-2', className)}>
      {shown.map((av, i) => (
        <Avatar
          key={i}
          {...av}
          size={size}
          className={cn('ring-2 ring-white', av.className)}
        />
      ))}
      {rest > 0 && (
        <div
          className={cn(
            'flex items-center justify-center text-xs font-semibold',
            'bg-gray-100 text-gray-600 ring-2 ring-white rounded-full',
            sizeMap[size],
          )}
        >
          +{rest}
        </div>
      )}
    </div>
  )
}
