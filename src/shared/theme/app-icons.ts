import { createElement, type ReactElement, type SVGProps } from 'react'

export type AppIconProps = SVGProps<SVGSVGElement> & {
  title?: string
}

function createIcon(
  children: ReactElement | ReactElement[],
): (props: AppIconProps) => ReactElement {
  return function AppIcon({
    className = 'h-5 w-5',
    title,
    ...props
  }: AppIconProps) {
    return createElement(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        className,
        'aria-hidden': title ? undefined : true,
        role: title ? 'img' : undefined,
        ...props,
      },
      title ? createElement('title', null, title) : null,
      ...(Array.isArray(children) ? children : [children]),
    )
  }
}

const HardwareIcon = createIcon([
  createElement('rect', {
    key: 'board',
    x: 4,
    y: 6,
    width: 16,
    height: 12,
    rx: 2,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('circle', {
    key: 'pad',
    cx: 9,
    cy: 12,
    r: 1.4,
    fill: 'currentColor',
  }),
  createElement('path', {
    key: 'traces',
    d: 'M13 10h4M13 14h3',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
])

const FirmwareIcon = createIcon([
  createElement('path', {
    key: 'chip',
    d: 'M8 7h8v10H8z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
  createElement('path', {
    key: 'lines',
    d: 'M10 10h4M10 13h3',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
  createElement('path', {
    key: 'pins',
    d: 'M6 10H4M6 14H4M20 10h-2M20 14h-2',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
])

const SoftwareIcon = createIcon(
  createElement('path', {
    d: 'M8 8 5.5 12 8 16M16 8l2.5 4L16 16M13 7l-2 10',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
)

const IndustrialDesignIcon = createIcon([
  createElement('path', {
    key: 'house',
    d: 'M5 18h14M7 18V9l5-4 5 4v9',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
  createElement('path', {
    key: 'door',
    d: 'M10 18v-4h4v4',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
])

const ManufactureIcon = createIcon(
  createElement('path', {
    d: 'M4 17V8l5 3V8l5 3V8l6 4v5H4Z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
)

const CircleIcon = createIcon([
  createElement('circle', {
    key: 'outer',
    cx: 12,
    cy: 12,
    r: 7,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('circle', {
    key: 'inner',
    cx: 12,
    cy: 12,
    r: 2,
    fill: 'currentColor',
  }),
])

const MenuIcon = createIcon(
  createElement('path', {
    d: 'M4 7h16M4 12h16M4 17h16',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
)

const CloseIcon = createIcon(
  createElement('path', {
    d: 'M6 6l12 12M18 6 6 18',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
)

const PlayIcon = createIcon(
  createElement('path', {
    d: 'M8 6.5v11l9-5.5-9-5.5Z',
    fill: 'currentColor',
  }),
)

const ArrowRightIcon = createIcon(
  createElement('path', {
    d: 'M5 12h14M13 6l6 6-6 6',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
)

/**
 * Centralized icon catalog — similar to Flutter `AppIcons`.
 */
export const AppIcons = {
  hardware: HardwareIcon,
  firmware: FirmwareIcon,
  software: SoftwareIcon,
  industrialDesign: IndustrialDesignIcon,
  manufacture: ManufactureIcon,
  circle: CircleIcon,
  menu: MenuIcon,
  close: CloseIcon,
  play: PlayIcon,
  arrowRight: ArrowRightIcon,
} as const

export const AppIconNames = {
  hardware: 'hardware',
  firmware: 'firmware',
  software: 'software',
  industrialDesign: 'industrial-design',
  manufacture: 'manufacture',
  circle: 'circle',
  menu: 'menu',
  close: 'close',
  play: 'play',
  arrowRight: 'arrow-right',
} as const

export type AppIconKey = keyof typeof AppIcons

const iconByServiceId: Record<string, AppIconKey> = {
  hardware: 'hardware',
  firmware: 'firmware',
  software: 'software',
  'industrial-design': 'industrialDesign',
  manufacture: 'manufacture',
}

export function resolveAppIcon(name?: string): AppIconKey {
  if (!name) {
    return 'circle'
  }

  if (name in AppIcons) {
    return name as AppIconKey
  }

  return iconByServiceId[name] ?? 'circle'
}
