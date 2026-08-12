import type { HomeCatalog } from '@/shared/i18n/types'

export const home: HomeCatalog = {
  hero: {
    eyebrow: 'AJ Electronic Design Platform',
    title: 'De ideas electrónicas a productos reales',
    description:
      'AJ Electronic Design es una casa de diseño electrónico especializada en hardware, firmware, software, diseño industrial y manufactura.',
    primaryCta: {
      label: 'Solicitar una cotización',
      href: '#contact',
    },
    secondaryCta: {
      label: 'Explorar servicios',
      href: '#services',
    },
  },
  clientsSection: {
    title: 'Empresas con las que hemos trabajado',
    description:
      'Colaboramos con empresas líderes en dispositivos médicos, electrónica de consumo, IoT industrial y productos conectados.',
  },
  servicesSection: {
    eyebrow: 'Servicios',
    title: 'Capacidades a lo largo del ciclo de vida del producto',
    description:
      'Del concepto a la manufactura, acompañamos el recorrido completo del producto electrónico.',
  },
  teamSection: {
    title: 'La ingeniería es un proceso colaborativo',
    description:
      'Nuestro equipo multidisciplinario reúne experiencia en hardware, firmware, software, diseño industrial y manufactura para llevar productos del concepto a la producción.',
    imageAlt:
      'Ingenieros de AJ Electronic Design inspeccionando ensambles electrónicos y PCBs',
  },
  processSection: {
    eyebrow: 'Proceso',
    title: 'Un camino claro de la idea a la entrega',
    description:
      'Una ruta de ingeniería enfocada que mantiene cada proyecto predecible, desde la definición hasta la entrega lista para producción.',
  },
  process: {
    discovery: {
      label: 'Descubrimiento',
      description: 'Definir objetivos, restricciones y requisitos del producto.',
    },
    engineering: {
      label: 'Ingeniería',
      description: 'Diseñar electrónica, firmware, software y mecánica.',
    },
    prototype: {
      label: 'Prototipo',
      description: 'Construir unidades tempranas para validar forma y función.',
    },
    validation: {
      label: 'Validación',
      description: 'Probar, iterar y refinar para lograr confiabilidad.',
    },
    manufacture: {
      label: 'Manufactura',
      description:
        'Ensamblar, inspeccionar y entregar unidades y documentación listas para producción.',
    },
  },
  technologiesSection: {
    eyebrow: 'Tecnologías',
    title: 'Del PCB a la nube, ingenierizado como un solo sistema',
    description:
      'Combinamos electrónica, sistemas embebidos, aplicaciones, infraestructura en la nube y manufactura para construir productos conectados completos.',
    pipeline: [
      'Electrónica',
      'Firmware',
      'Aplicaciones',
      'Nube',
      'Producción',
    ],
  },
  technologies: {
    'hardware-electronics': {
      title: 'Hardware y electrónica',
      description: 'Diseño electrónico y desarrollo de PCB para sistemas confiables.',
    },
    'firmware-connectivity': {
      title: 'Firmware y conectividad',
      description: 'Software embebido y comunicación entre dispositivos.',
    },
    'applications-platforms': {
      title: 'Aplicaciones y plataformas',
      description: 'Servicios móviles, web y backend para productos conectados.',
    },
    'cloud-data': {
      title: 'Nube y datos',
      description: 'Infraestructura, APIs, almacenamiento y conectividad en la nube.',
    },
    'product-manufacturing': {
      title: 'Producto y manufactura',
      description: 'Diseño para manufactura, prototipos, ensamble y pruebas.',
    },
  },
  technologyNames: {
    'pcb-design': 'Diseño de PCB',
    'component-selection': 'Selección de componentes',
    'electronic-design': 'Diseño electrónico',
    'manufacturing-files': 'Archivos de manufactura',
    'embedded-linux': 'Embedded Linux',
    ble: 'BLE',
    iot: 'IoT',
    rtos: 'RTOS',
    drivers: 'Drivers',
    flutter: 'Flutter',
    react: 'React',
    nodejs: 'Node.js',
    'web-platforms': 'Plataformas web',
    'mobile-apps': 'Apps móviles',
    aws: 'AWS',
    databases: 'Bases de datos',
    apis: 'APIs',
    'cloud-services': 'Servicios en la nube',
    '3d-modeling': 'Modelado 3D',
    'mechanical-design': 'Diseño mecánico',
    prototyping: 'Prototipado',
    smt: 'SMT',
    th: 'TH',
    testing: 'Pruebas',
    packaging: 'Empaque',
  },
  services: {
    hardware: {
      title: 'Hardware',
      description:
        'Diseño electrónico, desarrollo de PCB, selección de componentes y archivos de manufactura.',
      benefit: 'Diseño electrónico confiable desde el concepto.',
      details: {
        introduction:
          'Diseñamos sistemas electrónicos confiables, adaptados a los requisitos técnicos y de manufactura de cada producto.',
        capabilities: [
          'Diseño de esquemático y PCB',
          'Selección de componentes',
          'Desarrollo de sistemas electrónicos',
          'Desarrollo de prototipos',
          'Preparación de archivos de manufactura',
        ],
        deliverables: [
          'Esquemáticos',
          'Archivos de diseño de PCB',
          'Lista de materiales',
          'Archivos de manufactura',
          'Prototipos funcionales',
        ],
      },
    },
    firmware: {
      title: 'Firmware',
      description:
        'Sistemas embebidos, conectividad, drivers, RTOS y firmware a nivel de producto.',
      benefit: 'Inteligencia y conectividad para el hardware.',
      details: {
        introduction:
          'Desarrollamos firmware a nivel de producto que aporta inteligencia, control y conectividad al hardware electrónico.',
        capabilities: [
          'Desarrollo de sistemas embebidos',
          'Implementación de conectividad',
          'Desarrollo de drivers',
          'Integración de RTOS',
          'Firmware a nivel de producto',
        ],
        deliverables: [
          'Firmware embebido',
          'Implementación de conectividad',
          'Drivers de dispositivo',
          'Firmware basado en RTOS',
          'Firmware de producto validado',
        ],
      },
    },
    software: {
      title: 'Software',
      description:
        'Plataformas web, apps móviles, servicios en la nube, bases de datos e interfaces de usuario.',
      benefit: 'Experiencias digitales modernas para productos.',
      details: {
        introduction:
          'Construimos la capa de software que conecta productos con usuarios, datos y servicios en la nube.',
        capabilities: [
          'Desarrollo de plataformas web',
          'Desarrollo de aplicaciones móviles',
          'Servicios en la nube',
          'Diseño de bases de datos',
          'Desarrollo de interfaces de usuario',
        ],
        deliverables: [
          'Plataformas web',
          'Aplicaciones móviles',
          'Servicios backend',
          'Bases de datos',
          'Interfaces de usuario',
        ],
      },
    },
    'industrial-design': {
      title: 'Diseño industrial',
      description:
        'Diseño mecánico, concepto de producto, modelado 3D y manufacturabilidad.',
      benefit: 'Forma de producto profesional y manufacturable.',
      details: {
        introduction:
          'Damos forma a los productos con diseño mecánico y modelado enfocados en forma, función y manufacturabilidad.',
        capabilities: [
          'Desarrollo de concepto de producto',
          'Diseño mecánico',
          'Modelado 3D',
          'Orientación de materiales',
          'Diseño para manufacturabilidad',
        ],
        deliverables: [
          'Conceptos de producto',
          'Diseños mecánicos',
          'Modelos 3D',
          'Recomendaciones de manufacturabilidad',
        ],
      },
    },
    manufacture: {
      title: 'Manufactura',
      description:
        'Ensamble de prototipo y bajo volumen, SMT, TH, pruebas y empaque.',
      benefit: 'Unidades físicas listas para entregar.',
      details: {
        introduction:
          'Llevamos los diseños a unidades físicas mediante ensamble de prototipo y bajo volumen, pruebas y empaque.',
        capabilities: [
          'Ensamble de prototipos',
          'Producción de bajo volumen',
          'Ensamble SMT',
          'Ensamble through-hole',
          'Pruebas, inspección y empaque',
        ],
        deliverables: [
          'Prototipos ensamblados',
          'Unidades de producción de bajo volumen',
          'Ensambles probados',
          'Productos inspeccionados y empacados',
        ],
      },
    },
  },
  clientLogoAlt: 'Logo de {name}',
  video: {
    title: 'Dentro de AJ Electronic Design',
    description: 'Así convertimos ideas en productos listos para producción',
    placeholderLabel: 'Reproducir video institucional',
    note: 'Presentación institucional de AJ Electronic Design.',
  },
  contactSection: {
    eyebrow: 'Contacto',
    title: 'Solicitar una cotización',
    description:
      'Cuéntanos tu idea de producto y te ayudaremos a definir el siguiente paso de ingeniería.',
  },
  contactForm: {
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Correo',
    emailPlaceholder: 'tu@empresa.com',
    phone: 'Teléfono',
    phonePlaceholder: '+52 (33) 0000 0000',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos sobre tu proyecto, tiempos y objetivos',
    sending: 'Enviando...',
    sentTo: 'Tu solicitud se enviará a',
    validationError:
      'Completa nombre, correo y mensaje antes de enviar.',
    success: 'Gracias. Tu mensaje se envió correctamente.',
    sendError:
      'No pudimos enviar tu mensaje ahora. Inténtalo de nuevo o escríbenos por correo.',
  },
}
