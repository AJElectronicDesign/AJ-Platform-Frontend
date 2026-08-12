import type { LandingContent } from '@/features/landing/domain/entities/landing-content'

export const landingContent: LandingContent = {
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
    highlights: [
      { label: 'Capability', value: 'End-to-end product development' },
      { label: 'Focus', value: 'Hardware · Firmware · Software' },
      { label: 'Delivery', value: 'Prototype to manufacture' },
    ],
  },
  clientsSection: {
    eyebrow: 'Clients',
    title: "Companies we've worked with",
    description:
      'We collaborate with leading companies across medical devices, consumer electronics, industrial IoT and connected products.',
  },
  clients: [
    {
      id: 'intel',
      name: 'Intel',
      logoKey: 'intel',
      alt: 'Intel logo',
    },
    {
      id: 'bosch',
      name: 'Bosch',
      logoKey: 'bosch',
      alt: 'Bosch logo',
    },
    {
      id: 'mabe',
      name: 'Mabe',
      logoKey: 'mabe',
      alt: 'Mabe logo',
    },
    {
      id: 'nxp',
      name: 'NXP',
      logoKey: 'nxp',
      alt: 'NXP logo',
    },
    {
      id: 'biosense',
      name: 'Biosense',
      logoKey: 'biosense',
      alt: 'Biosense logo',
    },
  ],
  servicesSection: {
    eyebrow: 'Services',
    title: 'Capabilities across the product lifecycle',
    description:
      'From concept to manufacture, we support the full electronic product journey.',
  },
  services: [
    {
      id: 'hardware',
      title: 'Hardware',
      description:
        'Electronic design, PCB development, component selection and manufacturing files.',
      benefit: 'Reliable electronic design from concept.',
      icon: 'hardware',
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
        technologies: ['PCB Design'],
      },
    },
    {
      id: 'firmware',
      title: 'Firmware',
      description:
        'Embedded systems, connectivity, drivers, RTOS and product-level firmware.',
      benefit: 'Intelligence and connectivity for hardware.',
      icon: 'firmware',
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
        technologies: ['Embedded Linux', 'BLE', 'IoT'],
      },
    },
    {
      id: 'software',
      title: 'Software',
      description:
        'Web platforms, mobile apps, cloud services, databases and user interfaces.',
      benefit: 'Modern digital experiences for products.',
      icon: 'software',
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
        technologies: ['Flutter', 'React', 'Node.js', 'AWS', 'Databases', 'APIs'],
      },
    },
    {
      id: 'industrial-design',
      title: 'Industrial Design',
      description:
        'Mechanical design, product concept, 3D modeling and manufacturability.',
      benefit: 'Professional, manufacturable product form.',
      icon: 'industrial-design',
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
        technologies: ['3D modeling', 'Mechanical design'],
      },
    },
    {
      id: 'manufacture',
      title: 'Manufacture',
      description:
        'Prototype and low-volume assembly, SMT, TH, testing and packaging.',
      benefit: 'Physical units ready to deliver.',
      icon: 'manufacture',
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
        technologies: ['SMT', 'TH', 'Testing', 'Inspection', 'Packaging'],
      },
    },
  ],
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
  process: [
    {
      id: 'discovery',
      label: 'Discovery',
      description: 'Define goals, constraints and product requirements.',
    },
    {
      id: 'engineering',
      label: 'Engineering',
      description: 'Design electronics, firmware, software and mechanics.',
    },
    {
      id: 'prototype',
      label: 'Prototype',
      description: 'Build early units to validate form and function.',
    },
    {
      id: 'validation',
      label: 'Validation',
      description: 'Test, iterate and refine for reliability.',
    },
    {
      id: 'manufacture',
      label: 'Manufacture',
      description:
        'Assemble, inspect and hand off production-ready units and documentation.',
    },
  ],
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
  technologies: [
    {
      id: 'hardware-electronics',
      title: 'Hardware & Electronics',
      description: 'Electronic design and PCB development for reliable systems.',
      icon: 'hardware',
      technologies: [
        { id: 'pcb-design', name: 'PCB Design', icon: 'pcb' },
        { id: 'component-selection', name: 'Component selection', icon: 'hardware' },
        { id: 'electronic-design', name: 'Electronic design', icon: 'pcb' },
        { id: 'manufacturing-files', name: 'Manufacturing files', icon: 'api' },
      ],
    },
    {
      id: 'firmware-connectivity',
      title: 'Firmware & Connectivity',
      description: 'Embedded software and communication between devices.',
      icon: 'firmware',
      technologies: [
        { id: 'embedded-linux', name: 'Embedded Linux', icon: 'linux' },
        { id: 'ble', name: 'BLE', icon: 'ble' },
        { id: 'iot', name: 'IoT', icon: 'iot' },
        { id: 'rtos', name: 'RTOS', icon: 'firmware' },
        { id: 'drivers', name: 'Drivers', icon: 'connectivity' },
      ],
    },
    {
      id: 'applications-platforms',
      title: 'Applications & Platforms',
      description: 'Mobile, web and backend services for connected products.',
      icon: 'applications',
      technologies: [
        { id: 'flutter', name: 'Flutter', icon: 'flutter' },
        { id: 'react', name: 'React', icon: 'react' },
        { id: 'nodejs', name: 'Node.js', icon: 'nodejs' },
        { id: 'web-platforms', name: 'Web platforms', icon: 'applications' },
        { id: 'mobile-apps', name: 'Mobile apps', icon: 'software' },
      ],
    },
    {
      id: 'cloud-data',
      title: 'Cloud & Data',
      description: 'Infrastructure, APIs, storage and cloud connectivity.',
      icon: 'cloud',
      technologies: [
        { id: 'aws', name: 'AWS', icon: 'aws' },
        { id: 'databases', name: 'Databases', icon: 'database' },
        { id: 'apis', name: 'APIs', icon: 'api' },
        { id: 'cloud-services', name: 'Cloud services', icon: 'cloud' },
      ],
    },
    {
      id: 'product-manufacturing',
      title: 'Product & Manufacturing',
      description: 'Design for manufacture, prototypes, assembly and testing.',
      icon: 'manufacture',
      technologies: [
        { id: '3d-modeling', name: '3D modeling', icon: 'industrial-design' },
        {
          id: 'mechanical-design',
          name: 'Mechanical design',
          icon: 'industrial-design',
        },
        { id: 'prototyping', name: 'Prototyping', icon: 'pcb' },
        { id: 'smt', name: 'SMT', icon: 'manufacture' },
        { id: 'th', name: 'TH', icon: 'manufacture' },
        { id: 'testing', name: 'Testing', icon: 'firmware' },
        { id: 'packaging', name: 'Packaging', icon: 'manufacture' },
      ],
    },
  ],
  video: {
    title: 'Inside AJ Electronic Design',
    description: 'See how we turn ideas into production-ready products',
    placeholderLabel: 'Play institutional video',
    note: 'AJ Electronic Design institutional presentation.',
    embedUrl:
      'https://drive.google.com/file/d/1qBM0QYz4RKMi6G3zfvVt6LjYpHfVQ4v5/preview',
  },
  contactSection: {
    eyebrow: 'Contact',
    title: 'Request a quotation',
    description:
      'Tell us about your product idea and we will help you define the next engineering step.',
  },
  contact: {
    email: 'contact@aj-electronic-design.com',
    phone: '+52 (33) 2733 0962',
    location: 'Zapopan, Jalisco, Mexico',
  },
  footer: {
    copyright: '© AJ Electronic Design. All rights reserved.',
  },
}
