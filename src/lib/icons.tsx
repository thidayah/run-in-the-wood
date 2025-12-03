import { Icon } from '@iconify/react'

interface IconProps {
  icon: string
  className?: string
  width?: number | string
  height?: number | string
}

export function Iconify({ icon, className = '', width = 24, height = 24 }: IconProps) {
  return (
    <Icon 
      icon={icon} 
      className={className}
      width={width}
      height={height}
    />
  )
}

// Icon constants for easy reference
export const ICONS = {
  menu: 'heroicons:bars-3',
  close: 'heroicons:x-mark',
  tree: 'ph:tree-evergreen-fill',
  mountain: 'fa6-solid:mountain',
  compass: 'fa6-solid:compass',
  arrowRight: 'heroicons:arrow-right',
  users: 'heroicons:users',
  zap: 'heroicons:bolt',
  trees: 'ph:tree-fill',
  calendar: 'heroicons:calendar',
  location: 'heroicons:map-pin',
  distance: 'heroicons:arrows-pointing-out',
  elevation: 'material-symbols:elevation-outline',
  runner: 'fa6-solid:person-running',
  check: 'heroicons:check-circle',
  whatsapp: 'fa6-brands:whatsapp',
  qrcode: 'heroicons:qrcode',
  clock: 'heroicons:clock',
  chevronRight: 'heroicons:chevron-right',
  phone: 'heroicons:phone',
  mail: 'heroicons:envelope',
  instagram: 'fa6-brands:instagram',
  facebook: 'fa6-brands:facebook',
  twitter: 'fa6-brands:x-twitter',
  health: 'healthicons:health',
  info: 'heroicons:information-circle',
  warning: 'heroicons:exclamation-triangle',
  checkCircle: 'heroicons:check-circle',
}