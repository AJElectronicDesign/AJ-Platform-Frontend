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
  valueProposition: {
    title: 'A one-stop solution for electronic product development',
    description:
      'We help companies turn ideas into functional products by combining engineering, design, software and manufacturing capabilities.',
    pillars: [
      {
        id: 'engineering',
        title: 'Engineering expertise',
        description:
          'Cross-disciplinary teams that design reliable electronics with precision and clarity.',
      },
      {
        id: 'product-development',
        title: 'Product development',
        description:
          'From concept and architecture to validated prototypes ready for the next stage.',
      },
      {
        id: 'manufacturing',
        title: 'Manufacturing support',
        description:
          'Practical guidance and production capability to move from design to physical units.',
      },
    ],
  },
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
      benefit: 'Move from concept to reliable electronic design.',
      icon: 'hardware',
    },
    {
      id: 'firmware',
      title: 'Firmware',
      description:
        'Embedded systems, connectivity, drivers, RTOS and product-level firmware.',
      benefit: 'Bring intelligence and connectivity to your hardware.',
      icon: 'firmware',
    },
    {
      id: 'software',
      title: 'Software',
      description:
        'Web platforms, mobile apps, cloud services, databases and user interfaces.',
      benefit: 'Connect your products with modern digital experiences.',
      icon: 'software',
    },
    {
      id: 'industrial-design',
      title: 'Industrial Design',
      description:
        'Mechanical design, product concept, 3D modeling, materials and manufacturability.',
      benefit: 'Give your product a professional and manufacturable form.',
      icon: 'industrial-design',
    },
    {
      id: 'manufacture',
      title: 'Manufacture',
      description:
        'Prototype and low-volume assembly, SMT, TH, testing, inspection and packaging.',
      benefit: 'Move from design to physical units ready to deliver.',
      icon: 'manufacture',
    },
  ],
  processSection: {
    eyebrow: 'Process',
    title: 'A clear path from idea to delivery',
    description:
      'Two engineering phases that keep every project predictable — from definition to production-ready delivery.',
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
      description: 'Assemble, inspect and prepare production units.',
    },
    {
      id: 'delivery',
      label: 'Delivery',
      description: 'Hand off documentation, units and next steps.',
    },
  ],
  technologiesSection: {
    eyebrow: 'Technologies',
    title: 'Technology across the entire product lifecycle',
    description:
      'A modern engineering stack spanning electronics, embedded systems, applications and cloud.',
  },
  technologies: [
    {
      id: 'hardware-embedded',
      title: 'Hardware & Embedded',
      technologies: [
        { id: 'pcb-design', name: 'PCB Design', icon: 'pcb' },
        { id: 'embedded-linux', name: 'Embedded Linux', icon: 'linux' },
        { id: 'ble', name: 'BLE', icon: 'ble' },
        { id: 'iot', name: 'IoT', icon: 'iot' },
      ],
    },
    {
      id: 'software',
      title: 'Software',
      technologies: [
        { id: 'flutter', name: 'Flutter', icon: 'flutter' },
        { id: 'react', name: 'React', icon: 'react' },
        { id: 'nodejs', name: 'Node.js', icon: 'nodejs' },
      ],
    },
    {
      id: 'cloud-data',
      title: 'Cloud & Data',
      technologies: [
        { id: 'aws', name: 'AWS', icon: 'aws' },
        { id: 'databases', name: 'Databases', icon: 'database' },
        { id: 'apis', name: 'APIs', icon: 'api' },
      ],
    },
  ],
  caseStudiesSection: {
    eyebrow: 'Case studies',
    title: 'Selected outcomes',
    description:
      'Examples of how we help teams move from concept to validated products.',
  },
  caseStudies: [
    {
      id: 'iot-gateway',
      title: 'Industrial IoT Gateway',
      summary:
        'End-to-end hardware, firmware and cloud connectivity for industrial monitoring.',
      industry: 'Industrial',
      outcome: 'Production-ready units delivered with validated firmware.',
      imageAlt: 'Industrial IoT gateway hardware and connectivity visual',
      imageKey: 'iotGateway',
    },
    {
      id: 'connected-device',
      title: 'Connected Consumer Device',
      summary:
        'Product development covering industrial design, electronics and mobile experience.',
      industry: 'Consumer',
      outcome: 'Prototype validated and prepared for low-volume manufacture.',
      imageAlt: 'Connected consumer device prototype visual',
      imageKey: 'connectedDevice',
    },
  ],
  video: {
    title: 'Institutional video',
    description:
      'A short look at how AJ Electronic Design turns ideas into real products.',
    placeholderLabel: 'Play presentation',
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
