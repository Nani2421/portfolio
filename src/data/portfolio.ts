/**
 * Everything the site shows, in one place. It mirrors the résumé — update both
 * together so the two never disagree.
 */

export const profile = {
  name: "Sri Neeraj Reddy Palakolanu",
  shortName: "Neeraj",
  // Used for search results and link previews.
  description:
    "Hi, I’m Neeraj — into AI, ML and building things around them: LLMs, RAG, computer vision, and products like PingDrop. Computer science graduate from VIT-AP.",
  location: "Amaravati, India",
  email: "srineerajreddyp@gmail.com",
  github: "https://github.com/nani2421",
  linkedin: "https://www.linkedin.com/in/sri-neeraj-reddy-8336a8253/",
  resumeUrl: "/NeerajResume.pdf",
};

export type Project = {
  slug: "pingdrop" | "policymind" | "anpr" | "theft";
  title: string;
  /** One line under the title. */
  summary: string;
  /** Small grey line: what kind of thing, when. */
  meta: string;
  /** Poster in public/projects/<slug>.jpg. */
  points: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "pingdrop",
    title: "PingDrop",
    summary: "Your Android phone, on your Mac — with no account and no cloud.",
    meta: "Shipped · Google Play & macOS · Mar 2026 – Present",
    points: [
      "Free Android + macOS app; the devices talk directly and encrypted over Wi-Fi and Bluetooth LE, switching between them on their own.",
      "Notifications with replies, calls (including WhatsApp), file and folder transfer, clipboard sync, the phone as a Mac webcam and a walk-away lock.",
      "Run end to end: Play releases and in-app billing, notarised Mac builds with auto-updates, the website and launch.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "Swift", "SwiftUI", "Bluetooth LE", "AES-256-GCM"],
    links: [
      { label: "Website", href: "https://getpingdrop.vercel.app" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.app.pingdrop" },
      { label: "Download for Mac", href: "https://github.com/Neerajreddyapi/Pingdrop/releases/latest/download/PingDrop.dmg" },
    ],
  },
  {
    slug: "policymind",
    title: "PolicyMind AI",
    summary: "A policy assistant that answers across company PDFs and cites the page.",
    meta: "RAG · Gemini · Aug 2026",
    points: [
      "Multi-document RAG over policy PDFs with semantic and keyword retrieval, and grounded answers from Google Gemini.",
      "Persistent ChromaDB store with page-level citations; hybrid BM25 + dense search, cross-encoder reranking and deduplication.",
      "Streamlit chat with memory and follow-up question rewriting.",
    ],
    stack: ["Python", "RAG", "ChromaDB", "Gemini", "Streamlit", "Sentence Transformers"],
    links: [{ label: "GitHub", href: "https://github.com/Nani2421/PolicyMind-AI" }],
  },
  {
    slug: "anpr",
    title: "Efficient ANPR",
    summary: "Number-plate recognition for Indian traffic video, read once per vehicle.",
    meta: "Computer vision · Jan 2026",
    points: [
      "Two YOLOv8n models trained on Indian traffic data — vehicles (21,000+ images) and number plates (2,000+ images).",
      "Video pipeline: vehicle boxes feed the plate model, and plate crops go to PaddleOCR.",
      "DeepSORT gives every vehicle a persistent ID, so each one is read only once.",
    ],
    stack: ["Python", "YOLOv8n", "DeepSORT", "PaddleOCR", "OpenCV"],
    links: [{ label: "GitHub", href: "https://github.com/Nani2421/Efficient-ANPR" }],
  },
  {
    slug: "theft",
    title: "Real-Time Theft Detection",
    summary: "Spots suspicious behaviour on CCTV video, live or recorded.",
    meta: "Computer vision · 2025",
    points: [
      "Four YOLOv10 models (nano, small, medium, large) trained to tell people from suspicious activity.",
      "Large reaches 84.9% mAP@50 on 1,325 held-out images; nano is within 2.3 points at 2.2 ms per image.",
      "Pick the size per camera — fast for edge devices, accurate for a central server.",
    ],
    stack: ["Python", "YOLOv10", "Ultralytics", "Google Colab"],
    links: [{ label: "GitHub", href: "https://github.com/Nani2421/REAL-TIME-THEFT-DETECTION" }],
  },
];

/** Newest first. Short and factual. */
export const updates: { date: string; text: string; tag?: string }[] = [
  { date: "Nov 2026", text: "PingDrop launches on Product Hunt on 3 November.", tag: "Upcoming" },
  { date: "Oct 2026", text: "Released PingDrop 1.5 on Google Play and for Mac — walk-away lock, calls with any phone app, a desktop widget and Siri." },
  { date: "Aug 2026", text: "Built PolicyMind AI, a RAG assistant that cites the exact page it answers from." },
  { date: "Jun 2026", text: "Finished my B.Tech in Computer Science and Engineering at VIT-AP with a CGPA of 8.8." },
  { date: "Mar 2026", text: "Started building PingDrop." },
  { date: "Jan 2026", text: "Built Efficient ANPR, a number-plate recognition pipeline for Indian traffic video." },
  { date: "2025", text: "Became an AWS Certified Cloud Practitioner." },
];

export const skills = [
  { group: "Languages", items: ["Python", "Java", "SQL", "Kotlin", "Swift"] },
  { group: "ML / AI", items: ["Deep Learning", "LLMs", "RAG", "YOLO", "OpenCV"] },
  { group: "Databases", items: ["MySQL", "ChromaDB"] },
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Jupyter", "Google Colab"] },
];

export const education = [
  {
    institution: "Vellore Institute of Technology, AP",
    credential: "B.Tech, Computer Science and Engineering · CGPA 8.8",
    period: "Aug 2022 – Jun 2026",
  },
  {
    institution: "Narayana Junior College",
    credential: "Intermediate, MPC · 92%",
    period: "Aug 2020 – May 2022",
  },
];

export const leadership = [
  { role: "Documentation Team Lead", org: "LEO Club, VIT-AP", period: "Nov 2024 – May 2025" },
  { role: "Event Management Team Member", org: "NGC Club, VIT-AP", period: "Jan 2024 – May 2024" },
  { role: "Core Team Member", org: "Machine Learning Club, VIT-AP", period: "Aug 2023 – Dec 2023" },
];

/** `url` points at the credential itself. */
export const certifications = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2025",
    url: "https://drive.google.com/file/d/1CNwuLhuJDpopDPdMKZ17T7vBt26AkZ9c/view?usp=sharing",
  },
  {
    name: "PCAP — Programming Essentials in Python",
    issuer: "Python Institute",
    year: "2024",
    url: "https://drive.google.com/file/d/1-ATIje_Fo_vMQTtuA_ufKEPDEP7wI0eU/view?usp=sharing",
  },
];

/** `href` is where the link goes; `section` is the home-page section it lights up for. */
export const navLinks = [
  { href: "/#home", section: "#home", label: "Home" },
  { href: "/projects", section: "#projects", label: "Projects" },
  { href: "/#updates", section: "#updates", label: "Updates" },
  { href: "/#skills", section: "#skills", label: "Skills" },
  { href: "/#about", section: "#about", label: "About" },
];
