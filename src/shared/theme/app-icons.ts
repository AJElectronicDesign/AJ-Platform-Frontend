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

const PcbIcon = createIcon([
  createElement('rect', {
    key: 'board',
    x: 4,
    y: 5,
    width: 16,
    height: 14,
    rx: 2,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'traces',
    d: 'M8 9h3v3H8zM13 12h3M8 15h8',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
  createElement('circle', {
    key: 'via',
    cx: 16,
    cy: 9,
    r: 1.2,
    fill: 'currentColor',
  }),
])

const LinuxIcon = createIcon([
  createElement('path', {
    key: 'body',
    d: 'M12 4c-2.4 1.2-3.8 3.4-3.8 6.2 0 2.2.8 3.6 1.6 5.1.5.9.4 1.7-.2 2.3-.4.4-.4 1.1.1 1.4 1.2.8 3 .8 4.6.1.6-.3.7-1 .2-1.5-.6-.6-.7-1.4-.2-2.3.8-1.5 1.6-2.9 1.6-5.1C15.9 7.4 14.4 5.2 12 4Z',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinejoin: 'round',
  }),
  createElement('circle', {
    key: 'eye-l',
    cx: 10.2,
    cy: 9.2,
    r: 0.8,
    fill: 'currentColor',
  }),
  createElement('circle', {
    key: 'eye-r',
    cx: 13.8,
    cy: 9.2,
    r: 0.8,
    fill: 'currentColor',
  }),
])

const BleIcon = createIcon(
  createElement('path', {
    d: 'M12 3v18M12 3l5 4.5L12 12l5 4.5L12 21M12 12 7 7.5M12 12l-5 4.5',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
)

const IotIcon = createIcon([
  createElement('circle', {
    key: 'center',
    cx: 12,
    cy: 12,
    r: 2,
    fill: 'currentColor',
  }),
  createElement('path', {
    key: 'waves',
    d: 'M7.5 7.5a6.4 6.4 0 0 1 9 0M5 5a10 10 0 0 1 14 0M16.5 16.5a6.4 6.4 0 0 1-9 0M19 19a10 10 0 0 1-14 0',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
])

const FlutterIcon = createIcon(
  createElement('path', {
    d: 'M14.5 4 5 13.5h4.2L18.7 4h-4.2Zm0 7.5L9.2 16.8 14.5 22H18.7l-5.3-5.2L18.7 11.5H14.5Z',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinejoin: 'round',
  }),
)

const ReactIcon = createIcon([
  createElement('circle', {
    key: 'core',
    cx: 12,
    cy: 12,
    r: 1.6,
    fill: 'currentColor',
  }),
  createElement('ellipse', {
    key: 'orbit-1',
    cx: 12,
    cy: 12,
    rx: 9,
    ry: 3.6,
    stroke: 'currentColor',
    strokeWidth: 1.4,
  }),
  createElement('ellipse', {
    key: 'orbit-2',
    cx: 12,
    cy: 12,
    rx: 9,
    ry: 3.6,
    stroke: 'currentColor',
    strokeWidth: 1.4,
    transform: 'rotate(60 12 12)',
  }),
  createElement('ellipse', {
    key: 'orbit-3',
    cx: 12,
    cy: 12,
    rx: 9,
    ry: 3.6,
    stroke: 'currentColor',
    strokeWidth: 1.4,
    transform: 'rotate(120 12 12)',
  }),
])

const NodejsIcon = createIcon(
  createElement('path', {
    d: 'M12 3.2 19 7.2v9.6l-7 4-7-4V7.2l7-4Z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
)

const AwsIcon = createIcon([
  createElement('path', {
    key: 'cloud',
    d: 'M8.5 16.5h8.2a3.3 3.3 0 0 0 .3-6.6 4.5 4.5 0 0 0-8.6-1.2A3.2 3.2 0 0 0 8.5 16.5Z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
  createElement('path', {
    key: 'smile',
    d: 'M9.5 18.5c1.4 1 2.8 1.5 4.5 1.5s3.1-.5 4.5-1.5',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
])

const DatabaseIcon = createIcon([
  createElement('ellipse', {
    key: 'top',
    cx: 12,
    cy: 6.5,
    rx: 6.5,
    ry: 2.3,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'body',
    d: 'M5.5 6.5v11c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3v-11',
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'mid',
    d: 'M5.5 12c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3',
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
])

const ApiIcon = createIcon([
  createElement('circle', {
    key: 'a',
    cx: 6.5,
    cy: 12,
    r: 2.2,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }),
  createElement('circle', {
    key: 'b',
    cx: 17.5,
    cy: 7.5,
    r: 2.2,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }),
  createElement('circle', {
    key: 'c',
    cx: 17.5,
    cy: 16.5,
    r: 2.2,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }),
  createElement('path', {
    key: 'links',
    d: 'M8.5 11.2 15.3 8.3M8.5 12.8l6.8 2.9',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
])

const ConnectivityIcon = createIcon([
  createElement('circle', {
    key: 'core',
    cx: 12,
    cy: 14.5,
    r: 1.6,
    fill: 'currentColor',
  }),
  createElement('path', {
    key: 'w1',
    d: 'M8.2 11.2a5.2 5.2 0 0 1 7.6 0',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
  createElement('path', {
    key: 'w2',
    d: 'M6 8.6a8.2 8.2 0 0 1 12 0',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
  createElement('path', {
    key: 'w3',
    d: 'M4 6.2a11 11 0 0 1 16 0',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
])

const ApplicationsIcon = createIcon([
  createElement('rect', {
    key: 'a',
    x: 4,
    y: 4,
    width: 7,
    height: 7,
    rx: 1.5,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }),
  createElement('rect', {
    key: 'b',
    x: 13,
    y: 4,
    width: 7,
    height: 7,
    rx: 1.5,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }),
  createElement('rect', {
    key: 'c',
    x: 4,
    y: 13,
    width: 7,
    height: 7,
    rx: 1.5,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }),
  createElement('path', {
    key: 'link',
    d: 'M14.5 16.5h3.5M16.25 14.75v3.5',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
  }),
])

const CloudIcon = createIcon(
  createElement('path', {
    d: 'M8.5 16.5h8.2a3.3 3.3 0 0 0 .3-6.6 4.5 4.5 0 0 0-8.6-1.2A3.2 3.2 0 0 0 8.5 16.5Z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
)

const GlobeIcon = createIcon([
  createElement('circle', {
    key: 'globe',
    cx: 12,
    cy: 12,
    r: 8,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'meridian',
    d: 'M12 4c2.2 2.2 3.2 4.8 3.2 8s-1 5.8-3.2 8c-2.2-2.2-3.2-4.8-3.2-8s1-5.8 3.2-8Z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'parallels',
    d: 'M4.8 9.5h14.4M4.8 14.5h14.4',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
])

const UserIcon = createIcon([
  createElement('circle', {
    key: 'head',
    cx: 12,
    cy: 9,
    r: 3.2,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'body',
    d: 'M6.2 18.5c.8-2.8 3-4.3 5.8-4.3s5 1.5 5.8 4.3',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
])

const ChevronDownIcon = createIcon(
  createElement('path', {
    d: 'M6.5 9.5 12 15l5.5-5.5',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
)

const PersonIcon = createIcon([
  createElement('circle', {
    key: 'head',
    cx: 12,
    cy: 8,
    r: 3.6,
    fill: 'currentColor',
  }),
  createElement('path', {
    key: 'shoulders',
    d: 'M4 21c.5-4.2 3.6-6.6 8-6.6s7.5 2.4 8 6.6H4Z',
    fill: 'currentColor',
  }),
])

const MailIcon = createIcon(
  createElement('path', {
    d: 'M4.5 7.5h15v9h-15zM4.8 8.2 12 13.2 19.2 8.2',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
)

const PhoneIcon = createIcon(
  createElement('path', {
    d: 'M8 4.8h2.4l1 2.4-1.5 1.5a11 11 0 0 0 5.4 5.4l1.5-1.5 2.4 1V18a1.6 1.6 0 0 1-1.6 1.6A13.6 13.6 0 0 1 4.8 6.4 1.6 1.6 0 0 1 6.4 4.8H8Z',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
  }),
)

const LinkedInIcon = createIcon([
  createElement('rect', {
    key: 'frame',
    x: 4,
    y: 4,
    width: 16,
    height: 16,
    rx: 2,
    stroke: 'currentColor',
    strokeWidth: 1.6,
  }),
  createElement('path', {
    key: 'mark',
    d: 'M8.2 10.2V16M8.2 7.6v.1M11.4 16v-3.4c0-1.2.8-2 1.9-2s1.9.8 1.9 2V16',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
  }),
])

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
  pcb: PcbIcon,
  linux: LinuxIcon,
  ble: BleIcon,
  iot: IotIcon,
  flutter: FlutterIcon,
  react: ReactIcon,
  nodejs: NodejsIcon,
  aws: AwsIcon,
  database: DatabaseIcon,
  api: ApiIcon,
  connectivity: ConnectivityIcon,
  applications: ApplicationsIcon,
  cloud: CloudIcon,
  globe: GlobeIcon,
  user: UserIcon,
  chevronDown: ChevronDownIcon,
  person: PersonIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  linkedin: LinkedInIcon,
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
  pcb: 'pcb',
  linux: 'linux',
  ble: 'ble',
  iot: 'iot',
  flutter: 'flutter',
  react: 'react',
  nodejs: 'nodejs',
  aws: 'aws',
  database: 'database',
  api: 'api',
  connectivity: 'connectivity',
  applications: 'applications',
  cloud: 'cloud',
  globe: 'globe',
  user: 'user',
  chevronDown: 'chevron-down',
  person: 'person',
  mail: 'mail',
  phone: 'phone',
  linkedin: 'linkedin',
} as const

export type AppIconKey = keyof typeof AppIcons

const iconAliases: Record<string, AppIconKey> = {
  hardware: 'hardware',
  firmware: 'firmware',
  software: 'software',
  'industrial-design': 'industrialDesign',
  manufacture: 'manufacture',
  'pcb-design': 'pcb',
  'embedded-linux': 'linux',
  databases: 'database',
  apis: 'api',
  'node.js': 'nodejs',
}

export function resolveAppIcon(name?: string): AppIconKey {
  if (!name) {
    return 'circle'
  }

  if (name in AppIcons) {
    return name as AppIconKey
  }

  return iconAliases[name] ?? 'circle'
}
