export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  role: string;
  year: string;
  category: string;
  tags: string[];
  description: string;
  challenge: string;
  approach: string[];
  technicalHighlights: string[];
  deliverables: string[];
  image: string;
  images: string[];
  featured: boolean;
  order: number;
}

export const categories = [
  "All",
  "PCB",
  "Power Electronics",
  "Aerospace",
  "Drones",
  "IoT",
  "Energy",
  "Embedded",
  "Robotics",
] as const;

export type Category = (typeof categories)[number];

export const projects: Project[] = [
  {
    id: "1",
    slug: "cubesat-solar-array-222w",
    title: "CubeSat Solar Array — 222.8 W Deployable Panel System",
    client: "SOLLAB Co., Ltd.",
    role: "Hardware Design Engineer",
    year: "2025",
    category: "Aerospace",
    tags: ["Space Power Systems", "Solar Arrays", "GaAs", "GSFC-STD-7000"],
    description:
      "A five-panel, 184-cell spacecraft solar array built on AZUR SPACE 3G30A triple-junction GaAs cells — sized, strung and routed for a 2-week LEO direct-solar-feed mission, delivered with a full design and specification report.",
    challenge:
      "Design a 222.8 W deployable solar array for a LEO CubeSat mission using triple-junction GaAs cells, compliant with GSFC-STD-7000 standards, across five panels with mixed string configurations.",
    approach: [
      "String architecture design across 5 panels (6S6P, 4S8P, 6S8P)",
      "Cell-level sizing and voltage budgeting for MPPT compatibility",
      "GSFC-STD-7000 grounding, bonding and ESD compliance",
      "CSS-10 sun sensor integration for attitude reference",
      "Deployable hinge mechanics with routed harness paths",
    ],
    technicalHighlights: [
      "184 cells across five panels delivering 222.8 W BOL @ 28°C",
      "AZUR SPACE 3G30A triple-junction GaAs (29.3% efficiency)",
      "GSFC-STD-7000 compliant grounding, bonding and ESD",
      "+4.8% margin over 212.6 W mission budget",
    ],
    deliverables: [
      "Design & Specification Report (v4)",
      "Complete string design documentation",
      "Routing rules, grounding, bonding and ESD strategy",
      "Panel layout drawings",
    ],
    image: "/projects/sol_depA.jpg",
    images: ["/projects/sol_depA.jpg", "/projects/sol_depB.jpg", "/projects/sol_fixed.jpg"],
    featured: true,
    order: 1,
  },
  {
    id: "2",
    slug: "5ch-umppt-pcdu-28v",
    title: "5-Channel UMPPT PCDU — 28 V Unified Bus, 212.6 W",
    client: "SOLLAB Co., Ltd.",
    role: "Hardware Design Engineer",
    year: "2025",
    category: "Aerospace",
    tags: ["PCDU", "MPPT", "Power Distribution", "Space"],
    description:
      "A Power Conditioning and Distribution Unit for a 2-week LEO CubeSat mission — five independent MPPT channels combined onto a regulated 28 V bus, with supercapacitor transient buffering and full protection.",
    challenge:
      "Design a 5-channel UMPPT PCDU delivering 212.6 W on a 28 V unified bus with supercapacitor buffering, per-channel EMI filtering, and full OBC telemetry — all COTS parts derated per NASA GSFC-STD-7000.",
    approach: [
      "5-channel UMPPT topology with LT8490 per panel",
      "Supercapacitor buffer (2x BCAP0350, 175F/5V) for pulsed loads",
      "Two-stage EMI filtering with TVS clamping per channel",
      "INA181A1 high-side sensing into ADS7953 ADC array",
      "Layered protection: circuit breakers, opto isolation, fuel gauge",
    ],
    technicalHighlights: [
      "5-channel UMPPT with independent MPPT per solar panel",
      "28 V unified bus distributing 3.3V, 5V and 28V rails",
      "Supercapacitor transient buffering — no battery, direct solar feed",
      "All COTS ICs derated per NASA GSFC-STD-7000",
    ],
    deliverables: [
      "Full design and analysis report",
      "Annotated board documentation",
      "Fabrication-ready layout",
      "Component derating analysis",
    ],
    image: "/projects/pcdu_anno.jpg",
    images: ["/projects/pcdu_anno.jpg", "/projects/pcdu_3d.jpg"],
    featured: true,
    order: 2,
  },
  {
    id: "3",
    slug: "1u-cubesat-eps-n1-redundant",
    title: "1U CubeSat EPS — N-1 Redundant Power System",
    client: "Aviation & Aerospace University Bangladesh",
    role: "Architect, Schematic & PCB Designer",
    year: "2025",
    category: "Aerospace",
    tags: ["EPS", "Redundancy", "CubeSat", "Power Systems"],
    description:
      "A flight-ready Electrical Power System for a 1U CubeSat — distributed N-1 redundant architecture taken from reliability modelling through schematic, 96×96mm PC-104 layout, assembly and live telemetry.",
    challenge:
      "Design a CubeSat EPS with N-1 redundancy raising reliability from R=0.797 to R=0.991, including MPPT solar charging, multi-rail regulation, 16-channel telemetry, and live Python dashboard integration.",
    approach: [
      "Distributed N-1 redundant architecture modelling",
      "BQ24650 MPPT solar charging with CC-CV control",
      "Power path with LTC3130/TPS63020 regulators and ideal diodes",
      "ADS8688 16-bit SPI ADC telemetry with fuel gauge",
      "MATLAB/Simulink simulation (500km orbit, 35-min eclipse)",
    ],
    technicalHighlights: [
      "N-1 redundancy: R = 0.991 (vs 0.797 conventional)",
      "BQ24650 MPPT with SOC above 90% across LEO orbits",
      "Converter efficiency sustained above 85% at typical loads",
      "16-channel telemetry with live Python dashboard",
    ],
    deliverables: [
      "EPS schematic and PCB layout",
      "Reliability modelling report",
      "MATLAB/Simulink simulation",
      "Live Python telemetry dashboard",
    ],
    image: "/projects/eps_photo.jpg",
    images: ["/projects/eps_photo.jpg", "/projects/eps_3d.jpg", "/projects/eps_dash.jpg"],
    featured: true,
    order: 3,
  },
  {
    id: "4",
    slug: "1u-cubesat-obc-radio",
    title: "1U CubeSat OBC & Radio — Full-Stack Flight Avionics",
    client: "Aviation & Aerospace University Bangladesh",
    role: "Architect, Schematic & PCB Designer",
    year: "2025",
    category: "Aerospace",
    tags: ["OBC", "Radio", "ATmega2560", "UHF"],
    description:
      "A flight-ready On-Board Computer and UHF radio for a 1U CubeSat — full schematic design, component selection, multi-layer layout and EPS integration, taken through fabrication, assembly and live bench bring-up.",
    challenge:
      "Design a complete CubeSat OBC with ATmega2560, dual redundant F-RAM, UHF transceiver with PA, closed-loop EPS integration, IMU, RTC — all within PC-104 form factor.",
    approach: [
      "ATmega2560 flight computer with full housekeeping firmware",
      "Dual redundant CY15B104Q F-RAM for mission-critical data",
      "Si4463 UHF transceiver + RFFM6406 PA with SAW filters",
      "Closed-loop EPS integration over PC-104 header",
      "BMX160 IMU, DS3231 RTC, CP2102 USB-UART chain",
    ],
    technicalHighlights: [
      "ATmega2560 (100-pin TQFP) running all satellite housekeeping",
      "Dual redundant 4 Mbit SPI F-RAM for fault tolerance",
      "Si4463 UHF with PA bypass for low-power eclipse beacons",
      "Full PC-104 compatible stack integration",
    ],
    deliverables: [
      "OBC schematic and PCB layout",
      "3D model and assembly drawings",
      "Bench bring-up and validation report",
      "Firmware specification",
    ],
    image: "/projects/obc_photo.jpg",
    images: ["/projects/obc_photo.jpg", "/projects/obc_3d.jpg", "/projects/obc_layout.jpg", "/projects/obc_bench.jpg"],
    featured: false,
    order: 4,
  },
  {
    id: "5",
    slug: "indigenous-1u-cubesat",
    title: "Indigenous 1U CubeSat — Full-Stack Hardware",
    client: "AAUB — Undergraduate Thesis",
    role: "System Architect — All Five Subsystems",
    year: "2025",
    category: "Aerospace",
    tags: ["CubeSat", "Full Stack", "Best Thesis", "IEEE"],
    description:
      "A complete flight-ready 1U CubeSat — EPS, OBC, Radio, Antenna and Science Payload, every subsystem architected, designed, fabricated and validated as one integrated PC-104 stack.",
    challenge:
      "Design, fabricate and validate all five subsystems of a 1U CubeSat end-to-end — from power architecture to antenna matching to science payload — as an integrated PC-104 stack.",
    approach: [
      "EPS with N-1 redundant architecture and live telemetry",
      "OBC with ATmega2560, Si4463 UHF, dual F-RAM",
      "437 MHz dipole antenna with impedance matching",
      "Science payload: GPS, camera, LoRa, gas sensors",
      "Full LEO simulation and bench integration",
    ],
    technicalHighlights: [
      "Complete 5-subsystem PC-104 stack — all designed in-house",
      "N-1 redundant EPS with R = 0.991 reliability",
      "Dual communication: UHF + LoRa",
      "Awarded Best Thesis Award",
    ],
    deliverables: [
      "All five subsystem boards",
      "Integrated PC-104 stack",
      "LEO simulation results",
      "Thesis documentation",
    ],
    image: "/projects/sat_hand.jpg",
    images: ["/projects/sat_hand.jpg", "/projects/sat_stack.jpg", "/projects/sat_flat.jpg", "/projects/sat_bench.jpg"],
    featured: true,
    order: 5,
  },
  {
    id: "6",
    slug: "mppt-solar-charge-controller-300w",
    title: "MPPT Solar Charge Controller — 300 W Class",
    client: "International Client",
    role: "Electrical & PCB Design Engineer",
    year: "2026",
    category: "Energy",
    tags: ["MPPT", "Solar", "LiFePO4", "Power Electronics"],
    description:
      "A microcontroller-driven boost converter charging a 45-cell LiFePO4 pack directly from a solar array, delivered with a 33-page design report traceable to manufacturer datasheets.",
    challenge:
      "Design a 300W MPPT solar charge controller with 50V solar input charging a 45S LiFePO4 pack, with multi-rail auxiliary power, isolated current sensing, and full first-principles derivation of every passive value.",
    approach: [
      "Boost topology with paralleled MOSFETs and IR2110 gate drive",
      "Isolated Hall-effect sensing (ACS711/ACS712) with analogue front end",
      "Three auxiliary rails (12V, 3.3V main, 3.3V USB) with power-path isolation",
      "ESP32 control with MPPT algorithm and charge state machine",
      "All passive values derived from first principles",
    ],
    technicalHighlights: [
      "50V VOC / 8A ISC solar input → 164V LiFePO4 output",
      "~300–330 W charge power with multi-rail architecture",
      "Isolated Hall-effect current sensing on input and output",
      "Every passive value derived from first principles",
    ],
    deliverables: [
      "Fabrication-ready 2-layer PCB",
      "Gerbers, drill and pick-and-place files",
      "Fully LCSC-sourced BOM",
      "33-page hardware design report",
      "Firmware specification",
    ],
    image: "/projects/mppt_layout.jpg",
    images: ["/projects/mppt_layout.jpg", "/projects/mppt_3d.jpg"],
    featured: true,
    order: 6,
  },
  {
    id: "7",
    slug: "drone-power-module-150a",
    title: "4S→6S Series-Injection Drone Power Module — 150 A Burst",
    client: "International Client (NDA)",
    role: "Electrical & PCB Design Engineer",
    year: "2026",
    category: "Drones",
    tags: ["Drone", "Power Module", "FET", "Protection"],
    description:
      "A bidirectional battery power-boost module that series-injects a 2S booster pack onto a 4S main pack for burst propulsion — sixteen paralleled power FETs, hardware-latched protection and full analytical verification.",
    challenge:
      "Design a 150A burst bidirectional power module with 16 paralleled FETs, hardware over-current latching, floating-pack cell sensing, and precharge circuit — all verified analytically before layout.",
    approach: [
      "8+8 NCE60P50K FET banks: bypass + inject topology",
      "ACS758 current sensing into LM393 hardware SR-latch OCP",
      "INA149 difference amplifiers with ADS1115 ADC for floating cells",
      "Precharge circuit for ESC bulk-capacitor inrush limiting",
      "Design Verification Report gating schematic capture",
    ],
    technicalHighlights: [
      "16 paralleled TO-252 FETs on 2 oz thermal planes",
      "Firmware-independent hardware OCP with SR-latch",
      "Floating-pack instrumentation riding 16.8–25.2V above ground",
      "DVR-gated design flow — verification before layout",
    ],
    deliverables: [
      "Design Verification Report",
      "LCSC-sourced BOM",
      "KiCad schematic and layout",
      "Proof-board test plan",
    ],
    image: "/projects/drone_3dtop.jpg",
    images: ["/projects/drone_3dtop.jpg", "/projects/drone_3dbot.jpg", "/projects/drone_top2d.jpg", "/projects/drone_bot2d.jpg"],
    featured: true,
    order: 7,
  },
  {
    id: "8",
    slug: "uwb-flight-controller-stm32g473",
    title: "UWB Direction-Finding Flight Controller — STM32G473",
    client: "UAV Client",
    role: "PCB Design Engineer",
    year: "2026",
    category: "Drones",
    tags: ["UWB", "Flight Controller", "STM32", "4-Layer"],
    description:
      "A compact flight-controller-class board that measures aircraft bearing with a UWB radio array, sits inline on the pilot's control and video links to overlay warnings — with hardware fail-safe bypass.",
    challenge:
      "Design a 36×36mm 4-layer flight controller with STM32G473, 3-receiver UWB array for PDoA direction finding, CRSF inline pass-through with hardware fail-safe, and OSD warning overlay.",
    approach: [
      "STM32G473 (Cortex-M4, 170MHz) with DW3220 UWB array",
      "CRSF inline pass-through with hardware fail-safe bypass",
      "OSD warning overlay onto pilot video feed",
      "4S LiPo input with reverse-polarity and TVS protection",
      "30.5mm M3 mounting pattern, 4-layer 1oz copper",
    ],
    technicalHighlights: [
      "36×36mm, 4-layer, 1oz copper on standard M3 pattern",
      "3-receiver + anchor DW3220 UWB for PDoA sensing",
      "Hardware fail-safe: pilot RC survives total board power loss",
      "90Ω length-matched USB pair",
    ],
    deliverables: [
      "Fabrication-ready EasyEDA Pro source",
      "Netlist and BOM",
      "Client design review documentation",
      "All review findings closed and verified",
    ],
    image: "/projects/fc_3dtop.jpg",
    images: ["/projects/fc_3dtop.jpg", "/projects/fc_3dbot.jpg", "/projects/fc_top2d.jpg", "/projects/fc_bot2d.jpg"],
    featured: false,
    order: 8,
  },
  {
    id: "9",
    slug: "team-ababil-cansat",
    title: "Team Ababil CanSat — 16th Worldwide, AAS Competition 2025",
    client: "AAS International Competition",
    role: "Electrical & Mechanical Lead",
    year: "2025",
    category: "Aerospace",
    tags: ["CanSat", "Competition", "Avionics", "6 Boards"],
    description:
      "A complete flight-ready CanSat avionics suite — six circular boards designed from scratch under strict size, mass and reliability constraints, flown in international competition against a global field.",
    challenge:
      "Design six circular flight boards for CanSat competition — EPS, OBC, data storage, camera, beacon — all constrained to CanSat envelope with mass budget and launch vibration survival.",
    approach: [
      "All six flight boards designed in EasyEDA Pro",
      "Dual 18650 Li-ion with TP4056 charging and power switching",
      "ESP32 flight computer with XBee PRO S3B telemetry",
      "Deployable camera board with umbilical port",
      "Audio beacon board with buzzer and LED ring",
    ],
    technicalHighlights: [
      "6 custom circular flight boards — EPS, OBC, storage, camera, beacon",
      "FRR phase score: 100% — perfect flight readiness review",
      "Overall: 16th worldwide (89.72%) among global field",
      "Published as first-author IEEE paper",
    ],
    deliverables: [
      "6 designed and fabricated PCBs",
      "Integration and test documentation",
      "Competition design review packages",
      "IEEE publication",
    ],
    image: "/projects/sat_hand.jpg",
    images: ["/projects/sat_hand.jpg", "/projects/sat_stack.jpg"],
    featured: false,
    order: 9,
  },
  {
    id: "10",
    slug: "rover-71-electrical-architecture",
    title: "Rover-71 — Four-Board Electrical Architecture",
    client: "Anatolian Rover Challenge (ARC'25)",
    role: "Electrical Lead",
    year: "2025",
    category: "Robotics",
    tags: ["Rover", "Jetson", "Motor Control", "Science"],
    description:
      "The complete electrical architecture for an indigenous Mars rover — four custom boards carrying autonomous compute, manipulator control, science instrumentation and high-current drive.",
    challenge:
      "Design four custom boards for a Mars rover: main compute (Jetson Orin NX), robotic arm controller (TB6600), science module, and wheel-gear motor driver (BTS7960) — all field-survivable.",
    approach: [
      "Main control board: NVIDIA Jetson Orin NX + RPi4 + Arduino Mega",
      "TB6600 stepper drive for robotic arm manipulator",
      "Dedicated science module board for experiments",
      "BTS7960 DC drive with opto-isolated inputs for mobility",
      "Independent power, protection and modularity per subsystem",
    ],
    technicalHighlights: [
      "NVIDIA Jetson Orin NX (16GB) for autonomous navigation",
      "4 custom boards — modular and field-replaceable",
      "8th globally of 27 teams at ARC'25 Turkey",
      "83.83% overall score in University Rover Challenge",
    ],
    deliverables: [
      "4 custom PCB designs",
      "System integration documentation",
      "Field test results",
      "IEEE TENSYMP 2024 publication",
    ],
    image: "/projects/eps_3d.jpg",
    images: ["/projects/eps_3d.jpg", "/projects/eps_photo.jpg"],
    featured: false,
    order: 10,
  },
  {
    id: "11",
    slug: "cc2651r3-wireless-sensor-node",
    title: "CC2651R3 Wireless Sensor Node — 0.8 µA Sleep",
    client: "International Client",
    role: "PCB & Embedded Hardware Engineer",
    year: "2026",
    category: "IoT",
    tags: ["IoT", "Zigbee", "BLE", "Ultra-Low Power"],
    description:
      "An ultra-low-power dual-protocol wireless sensor node running for years from a single AA cell — printed 2.4 GHz antenna, matched balun and a boost front end that runs down to 0.7V.",
    challenge:
      "Design a dual-protocol (Zigbee + BLE 5.0) wireless sensor node with 0.8µA sleep current from a single AA cell, printed PCB antenna, and matched RF chain.",
    approach: [
      "TI CC2651R3 SoC with Zigbee + BLE 5.0 dual protocol",
      "TPS610994 boost from 0.7V for single AA operation",
      "Johanson 2450BM15A0015E balun into printed PCB antenna",
      "48MHz main + 32.768kHz sleep crystals",
      "Reed switch input for door/window/tamper sensing",
    ],
    technicalHighlights: [
      "0.8µA sleep current — years from single AA cell",
      "Dual Zigbee + BLE 5.0 at 2.4GHz, +5dBm output",
      "Printed PCB trace antenna — no external antenna cost",
      "2-layer, single-side SMD for low-cost fabrication",
    ],
    deliverables: [
      "Fabrication-ready PCB design",
      "RF layout rules documentation",
      "Power budget analysis",
      "Assembly notes",
    ],
    image: "/projects/obc_3d.jpg",
    images: ["/projects/obc_3d.jpg", "/projects/obc_bench.jpg"],
    featured: false,
    order: 11,
  },
  {
    id: "12",
    slug: "solar-energy-harvesting-97pct",
    title: "Solar Energy Harvesting PCB — 97% Boost Efficiency",
    client: "International Client",
    role: "PCB & Embedded Hardware Engineer",
    year: "2026",
    category: "Energy",
    tags: ["Energy Harvesting", "AEM15820", "Sodium-Ion", "MPPT"],
    description:
      "A microwatt-class solar harvesting front end with MPPT, sodium-ion charging and an ESP32 power interface — the same photovoltaic conversion discipline as spacecraft arrays, at the opposite end of the power scale.",
    challenge:
      "Design a microwatt-class energy harvesting board with 97% boost efficiency, MPPT for solar panel, sodium-ion battery charging, chemistry-flexible firmware, and 15nA shipping mode.",
    approach: [
      "e-peas AEM15820 energy-harvesting PMIC with 97% boost",
      "MPPT tuned to Voltaic 2.5W ETFE panel at 85% ratio",
      "Sodium-ion 18650 storage configured over I2C",
      "USB-C 5V fallback charging at 100mA CC/CV",
      "15nA shipping mode for inventory storage",
    ],
    technicalHighlights: [
      "97% boost efficiency with e-peas AEM15820",
      "Chemistry-flexible: LiFePO4, Li-ion, LiPo swappable by firmware",
      "15nA shipping mode for zero-drain inventory",
      "I2C telemetry and ESP32 driver library",
    ],
    deliverables: [
      "Fabrication-ready PCB",
      "Register configuration maps",
      "ESP32 driver library and application sketch",
      "Troubleshooting guide and BOM",
    ],
    image: "/projects/mppt_3d.jpg",
    images: ["/projects/mppt_3d.jpg", "/projects/mppt_layout.jpg"],
    featured: false,
    order: 12,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: Category): Project[] {
  if (category === "All") return projects;
  return projects.filter(
    (p) =>
      p.category === category || p.tags.some((t) => t.includes(category))
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
