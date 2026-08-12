import type { HomeCatalog } from '@/shared/i18n/types'

export const home: HomeCatalog = {
  hero: {
    eyebrow: 'AJ Electronic Design Platform',
    title: 'From electronic ideas to real products',
    description:
      'AJ Electronic Design is an electronic design house specialized in hardware, firmware, software, industrial design and manufacture.',
    primaryCta: {
      label: 'Request a quotation',
      href: '#contact',
    },
    secondaryCta: {
      label: 'Explore services',
      href: '#services',
    },
  },
  clientsSection: {
    title: "Companies we've worked with",
    description:
      'We collaborate with leading companies across medical devices, consumer electronics, industrial IoT and connected products.',
  },
  servicesSection: {
    eyebrow: 'Services',
    title: 'Capabilities across the product lifecycle',
    description:
      'From concept to manufacture, we support the full electronic product journey.',
  },
  teamSection: {
    title: 'Engineering is a collaborative process',
    description:
      'Our multidisciplinary team brings together hardware, firmware, software, industrial design and manufacturing expertise to take products from concept to production.',
    imageAlt:
      'AJ Electronic Design engineers inspecting electronic assemblies and PCBs',
  },
  processSection: {
    eyebrow: 'Process',
    title: 'A clear path from idea to delivery',
    description:
      'A focused engineering path that keeps every project predictable — from definition to production-ready delivery.',
  },
  process: {
    discovery: {
      label: 'Discovery',
      description: 'Define goals, constraints and product requirements.',
    },
    engineering: {
      label: 'Engineering',
      description: 'Design electronics, firmware, software and mechanics.',
    },
    prototype: {
      label: 'Prototype',
      description: 'Build early units to validate form and function.',
    },
    validation: {
      label: 'Validation',
      description: 'Test, iterate and refine for reliability.',
    },
    manufacture: {
      label: 'Manufacture',
      description:
        'Assemble, inspect and hand off production-ready units and documentation.',
    },
  },
  technologiesSection: {
    eyebrow: 'Technologies',
    title: 'From PCB to cloud, engineered as one system',
    description:
      'We combine electronics, embedded systems, applications, cloud infrastructure and manufacturing expertise to build complete connected products.',
    pipeline: [
      'Electronics',
      'Firmware',
      'Applications',
      'Cloud',
      'Production',
    ],
  },
  technologies: {
    'hardware-electronics': {
      title: 'Hardware & Electronics',
      description: 'Electronic design and PCB development for reliable systems.',
    },
    'firmware-connectivity': {
      title: 'Firmware & Connectivity',
      description: 'Embedded software and communication between devices.',
    },
    'applications-platforms': {
      title: 'Applications & Platforms',
      description: 'Mobile, web and backend services for connected products.',
    },
    'cloud-data': {
      title: 'Cloud & Data',
      description: 'Infrastructure, APIs, storage and cloud connectivity.',
    },
    'product-manufacturing': {
      title: 'Product & Manufacturing',
      description: 'Design for manufacture, prototypes, assembly and testing.',
    },
  },
  technologyNames: {
    'pcb-design': 'PCB Design',
    'component-selection': 'Component selection',
    'electronic-design': 'Electronic design',
    'manufacturing-files': 'Manufacturing files',
    'embedded-linux': 'Embedded Linux',
    ble: 'BLE',
    iot: 'IoT',
    rtos: 'RTOS',
    drivers: 'Drivers',
    flutter: 'Flutter',
    react: 'React',
    nodejs: 'Node.js',
    'web-platforms': 'Web platforms',
    'mobile-apps': 'Mobile apps',
    aws: 'AWS',
    databases: 'Databases',
    apis: 'APIs',
    'cloud-services': 'Cloud services',
    '3d-modeling': '3D modeling',
    'mechanical-design': 'Mechanical design',
    prototyping: 'Prototyping',
    smt: 'SMT',
    th: 'TH',
    testing: 'Testing',
    packaging: 'Packaging',
  },
  services: {
    hardware: {
      title: 'Hardware',
      description:
        'Electronic design, PCB development, component selection and manufacturing files.',
      benefit: 'Reliable electronic design from concept.',
      details: {
        introduction:
          'We design reliable electronic systems tailored to the technical and manufacturing requirements of each product.',
        capabilities: [
          'Schematic and PCB design',
          'Component selection',
          'Electronic system development',
          'Prototype development',
          'Manufacturing files preparation',
        ],
        deliverables: [
          'Schematics',
          'PCB design files',
          'Bill of materials',
          'Manufacturing files',
          'Functional prototypes',
        ],
      },
    },
    firmware: {
      title: 'Firmware',
      description:
        'Embedded systems, connectivity, drivers, RTOS and product-level firmware.',
      benefit: 'Intelligence and connectivity for hardware.',
      details: {
        introduction:
          'We develop product-level firmware that brings intelligence, control and connectivity to electronic hardware.',
        capabilities: [
          'Embedded systems development',
          'Connectivity implementation',
          'Driver development',
          'RTOS integration',
          'Product-level firmware',
        ],
        deliverables: [
          'Embedded firmware',
          'Connectivity implementation',
          'Device drivers',
          'RTOS-based firmware',
          'Validated product firmware',
        ],
      },
    },
    software: {
      title: 'Software',
      description:
        'Web platforms, mobile apps, cloud services, databases and user interfaces.',
      benefit: 'Modern digital experiences for products.',
      details: {
        introduction:
          'We build the software layer that connects products with users, data and cloud services.',
        capabilities: [
          'Web platform development',
          'Mobile application development',
          'Cloud services',
          'Database design',
          'User interface development',
        ],
        deliverables: [
          'Web platforms',
          'Mobile applications',
          'Backend services',
          'Databases',
          'User interfaces',
        ],
      },
    },
    'industrial-design': {
      title: 'Industrial Design',
      description:
        'Mechanical design, product concept, 3D modeling and manufacturability.',
      benefit: 'Professional, manufacturable product form.',
      details: {
        introduction:
          'We shape products with mechanical design and modeling focused on form, function and manufacturability.',
        capabilities: [
          'Product concept development',
          'Mechanical design',
          '3D modeling',
          'Materials guidance',
          'Design for manufacturability',
        ],
        deliverables: [
          'Product concepts',
          'Mechanical designs',
          '3D models',
          'Manufacturability recommendations',
        ],
      },
    },
    manufacture: {
      title: 'Manufacture',
      description:
        'Prototype and low-volume assembly, SMT, TH, testing and packaging.',
      benefit: 'Physical units ready to deliver.',
      details: {
        introduction:
          'We move designs into physical units through prototype and low-volume assembly, testing and packaging.',
        capabilities: [
          'Prototype assembly',
          'Low-volume production',
          'SMT assembly',
          'Through-hole assembly',
          'Testing, inspection and packaging',
        ],
        deliverables: [
          'Assembled prototypes',
          'Low-volume production units',
          'Tested assemblies',
          'Inspected and packaged products',
        ],
      },
    },
  },
  clientLogoAlt: '{name} logo',
  video: {
    title: 'Inside AJ Electronic Design',
    description: 'See how we turn ideas into production-ready products',
    placeholderLabel: 'Play institutional video',
    note: 'AJ Electronic Design institutional presentation.',
  },
  contactSection: {
    eyebrow: 'Contact',
    title: 'Request a quotation',
    description:
      'Tell us about your product idea and we will help you define the next engineering step.',
  },
  contactForm: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@company.com',
    phone: 'Phone',
    phonePlaceholder: '+52 (33) 0000 0000',
    message: 'Message',
    messagePlaceholder: 'Tell us about your project, timeline and goals',
    sending: 'Sending...',
    sentTo: `Your request will be sent to`,
    validationError:
      'Please complete name, email and message before sending.',
    success: 'Thanks! Your message was sent successfully.',
    sendError:
      'We could not send your message right now. Please try again or email us directly.',
  },
}
