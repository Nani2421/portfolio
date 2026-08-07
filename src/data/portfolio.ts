/**
 * Single source of truth for the whole site.
 *
 * A note on honesty: every number below is one that actually appears on the
 * résumé or is directly derivable from it. Where a case study *wants* a number
 * that was never measured, the field is left in `needsMeasurement` rather than
 * invented. Fill those in and delete the entry — the UI renders the prompt only
 * in development.
 */

export const profile = {
  name: "Sri Neeraj Reddy Palakolanu",
  shortName: "Neeraj",
  // The hero headline. A greeting, not a claim — the work below makes the claim.
  greeting: "Hi, I’m Neeraj.",
  subline:
    "Computer Science Engineer specializing in AI, Machine Learning, and Deep Learning. I design end-to-end intelligent systems—ranging from automated visual models to data-driven pipelines—that transform complex multi-modal inputs into practical solutions. Passionate about bringing production-ready artificial intelligence to real-world applications.",
  // Never rendered. Search results and link previews need a plain statement of
  // what this is, which a greeting doesn't give them.
  positioning:
    "Computer-vision and machine-learning engineering — real-time detection pipelines, transfer-learned classifiers, and the systems around them.",
  location: "Amaravati, India",
  email: "srineerajreddyp@gmail.com",
  phone: "+91 8341677532",
  github: "https://github.com/nani2421",
  linkedin: "https://www.linkedin.com/in/p-sri-neeraj-reddy-943591277/",
  resumeUrl: "/NeerajResume.pdf",
  availability: "Available now",
};

/**
 * Capability statements — the replacement for a skills grid. Each one is a
 * thing done, linked to the project that proves it. No tool appears here
 * without work behind it.
 */
export const capabilities = [
  {
    claim: "Chained two detectors into one video pipeline",
    detail:
      "Vehicle detection feeds plate detection feeds OCR, with tracking in between so the expensive stage runs once per object instead of once per frame.",
    proof: "anpr",
  },
  {
    claim: "Trained two detectors on 22,000+ images",
    detail:
      "Two YOLOv8n models on Indian road data — 20,800 IDD scenes and 1,618 plate images. The plate model reached 98.3% mAP@50.",
    proof: "anpr",
  },
  {
    claim: "Transfer-learned a CNN to 87% on a classification task",
    detail:
      "VGG16 backbone, frozen features, retrained head — chosen so training fit in a Colab session.",
    proof: "plant-disease",
  },
  {
    claim: "Shipped a full-stack app against a paid generative API",
    detail:
      "Django backend holding the Stability.ai key server-side, parsing the response and returning the image in one flow.",
    proof: "prompt-to-image",
  },
  {
    claim: "Wrote a wire protocol across two native platforms",
    detail:
      "Swift on macOS and Kotlin on Android sharing one AES-256-GCM encrypted transport, with automatic handover between Bluetooth LE and Wi-Fi.",
    proof: "pingdrop",
  },
];

/**
 * Tokens the snake eats on the landing page.
 *
 * `learning: true` marks the ones that are study tracks rather than shipped
 * work — they render as outlined tokens with a legend, so the game can show
 * RAG and NLP without implying a project exists behind them.
 */
export type SkillToken = {
  label: string;
  short: string;
  learning?: boolean;
};

/**
 * Core technologies only — no per-project libraries. The specific ones
 * (DeepSORT, PaddleOCR, VGG16, Ultralytics …) live on the case studies that
 * used them, where they're evidence rather than a logo wall.
 */
export const skillTokens: SkillToken[] = [
  { label: "Python", short: "Py" },
  { label: "Java", short: "Java" },
  { label: "Swift", short: "Swi" },
  { label: "Kotlin", short: "Kt" },
  { label: "MySQL", short: "SQL" },
  { label: "Django", short: "Dj" },
  { label: "TensorFlow", short: "TF" },
  { label: "AWS", short: "AWS" },
  { label: "Git", short: "Git" },
  { label: "AI", short: "AI" },
  { label: "Machine Learning", short: "ML" },
  { label: "Deep Learning", short: "DL" },
  { label: "Computer Vision", short: "CV" },
  { label: "NLP", short: "NLP", learning: true },
  { label: "RAG", short: "RAG", learning: true },
  { label: "LLMs", short: "LLM", learning: true },
];

export type Decision = {
  decision: string;
  alternatives: string;
  why: string;
};

export type Breakage = {
  what: string;
  fix: string;
};

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One line: what it is. Shown under the title everywhere. */
  what: string;
  period: string;
  status: "Shipped" | "Coursework" | "Prototype" | "In development";
  domain: string;
  role: string;
  stack: string[];
  repo?: string;
  demo?: string;
  featured: boolean;
  /** Result-first opener. Leads the case study. */
  outcome: string;
  tldr: string[];
  problem: string;
  constraints: string[];
  architecture: {
    nodes: DiagramNode[];
    /** Caption that makes a claim, never a label. */
    caption: string;
  };
  decisions: Decision[];
  broke: Breakage[];
  results?: { label: string; value: string; note?: string }[];
  /** Honest gaps — rendered as a dev-only prompt, never shown in production. */
  needsMeasurement?: string[];
  next: string;
};

export const projects: Project[] = [
  {
    slug: "anpr",
    title: "Efficient ANPR",
    what: "Automatic number-plate recognition for Indian traffic video.",
    period: "Jan 2026",
    status: "Prototype",
    domain: "Computer Vision",
    role: "Sole author — data, training, pipeline",
    stack: [
      "Python",
      "YOLOv8n",
      "DeepSORT",
      "PaddleOCR",
      "OpenCV",
      "Ultralytics",
      "Kaggle",
    ],
    repo: "https://github.com/Nani2421/Efficient-ANPR",
    featured: true,
    outcome:
      "Reads plates off traffic video by running OCR exactly once per vehicle instead of once per frame — the tracker, not the detector, is what makes the pipeline affordable. The plate detector reaches 98.3% mAP@50; the tracker is what decides how often it has to matter.",
    tldr: [
      "Two YOLOv8n models trained separately: 20,800 IDD images for the road-object detector, 1,618 for plates.",
      "Vehicle boxes feed the plate model, plate crops feed PaddleOCR — a cascade, not one big model.",
      "DeepSORT assigns a persistent ID per vehicle, so a plate is read once and reused across every later frame it appears in.",
    ],
    problem:
      "The obvious build — run a plate detector and OCR on every frame — is wasteful and wrong at the same time. A car is visible for dozens of frames, so you pay for dozens of OCR calls to answer one question. Worse, OCR is the noisiest stage in the pipeline: motion blur, plate skew, and glare mean consecutive frames of the same plate disagree with each other, and you have no principled way to pick a winner. The interesting problem isn't detection accuracy. It's deciding how often the expensive, unreliable stage needs to run at all.",
    constraints: [
      "Free-tier compute only — Colab and Kaggle sessions, no persistent GPU.",
      "Indian plates: varied fonts, spacing, and state formats, with no clean off-the-shelf dataset.",
      "Video-rate inference on consumer hardware, not a server rack.",
      "Two detection problems with wildly different dataset sizes — 20,800 road-scene images against 1,618 plate images.",
      "Colab kept dropping the session mid-run, so training had to be resumable — the road detector was restarted from `last.pt` eight times.",
    ],
    architecture: {
      nodes: [
        { id: "frame", label: "Video frame", sub: "1280×720 @ 29fps" },
        { id: "vehicle", label: "YOLOv8n · road objects", sub: "conf 0.40" },
        { id: "track", label: "DeepSORT", sub: "persistent track ID" },
        { id: "gate", label: "Seen before?", sub: "skip if ID resolved" },
        { id: "plate", label: "YOLOv8n · plates", sub: "conf 0.50, inside vehicle box" },
        { id: "ocr", label: "PaddleOCR", sub: "accept above 0.75" },
        { id: "out", label: "Plate + timestamp per ID", sub: "CSV" },
      ],
      caption:
        "The gate is the whole design. Everything downstream of it runs once per vehicle; everything upstream runs once per frame.",
    },
    decisions: [
      {
        decision: "Two cascaded detectors instead of one model with two classes.",
        alternatives:
          "A single YOLO model trained to detect vehicles and plates as separate classes.",
        why: "A plate is a small object inside a large one. Searching for it across the full frame wastes capacity on regions that cannot contain a plate. Cropping to the vehicle box first means the plate model sees a much larger effective object at a much better scale — and it let me train the two models on datasets of very different sizes independently.",
      },
      {
        decision: "YOLOv8n — the nano variant — for both stages.",
        alternatives: "YOLOv8s or YOLOv8m for higher mAP.",
        why: "Two models run per frame, so model cost is paid twice. Nano keeps the cascade inside a real-time budget on free-tier hardware. The tracker also absorbs some of the accuracy loss: a vehicle missed in one frame is usually caught in the next and re-associated to the same track.",
      },
      {
        decision: "DeepSORT tracking, used as a cache key rather than for analytics.",
        alternatives:
          "Frame-by-frame OCR with deduplication on the output strings; or IOU-only tracking.",
        why: "Deduplicating strings afterwards means you have already paid for the OCR. Tracking moves the deduplication upstream of the cost. DeepSORT's appearance embedding — rather than pure IOU — is what survives the brief occlusions that are constant in traffic footage.",
      },
      {
        decision: "PaddleOCR over Tesseract.",
        alternatives: "Tesseract, EasyOCR, or a custom CRNN trained on plate crops.",
        why: "Tesseract is built for documents and degrades badly on short, skewed, high-contrast strings. PaddleOCR's detection-plus-recognition pipeline handles the crop-level case without needing me to build and label a character-level dataset I did not have.",
      },
    ],
    broke: [
      {
        what: "Track IDs churn. A vehicle passing behind another comes out the far side as a new ID, and because the OCR cache is keyed on that ID, the same car gets read again.",
        fix: "Not fixed yet, and worth being straight about it: max_age is still at deep-sort-realtime's default of 30 frames. The real fix is either a longer max_age or keying the cache on the recognised string as well as the track ID, so a re-issued ID collapses back onto the plate it already read.",
      },
      {
        what: "The plate model, trained on tight crops, misfired when handed a full frame during early integration testing.",
        fix: "Made the vehicle crop a hard precondition rather than an optimization — the plate model is never called on anything but a vehicle box, which is what its training distribution actually looks like.",
      },
      {
        what: "Small and distant plates produce nonsense strings, and a track that resolves to one is stuck with it — the cache never revisits an ID it has already answered.",
        fix: "A 0.75 confidence floor on the PaddleOCR result. Below it nothing is written to the cache, so the track stays unresolved and waits for a closer frame — which tracking guarantees will arrive, because the vehicle is moving toward the camera.",
      },
    ],
    results: [
      {
        label: "Plate detector mAP@50",
        value: "98.3%",
        note: "403-image val split · mAP@50-95 87.6%",
      },
      {
        label: "Road detector mAP@50",
        value: "42.4%",
        note: "2,563 images, 38,628 instances · 7 of 100 epochs",
      },
      { label: "Plate detector recall", value: "98.2%", note: "precision 95.7%" },
      {
        label: "Detector inference",
        value: "1.5 / 1.7 ms",
        note: "plate / road, per image, Tesla T4",
      },
      { label: "Training images", value: "1,618 / 20,800", note: "plates / road scenes" },
      { label: "Plate training run", value: "100 epochs", note: "53 min on a T4" },
    ],
    needsMeasurement: [
      "End-to-end plate string accuracy — no labelled ground truth for the test video yet, so the pipeline's actual output has never been scored",
      "Wall-clock FPS for the full cascade. The per-model figures above are detector-only; PaddleOCR and DeepSORT dominate and are unmeasured",
      "How much the once-per-track gate actually saves, measured as OCR calls against frames processed",
    ],
    next: "Two things, in order. First, filter the road detector's output by class before it reaches the tracker — it was trained on all 15 IDD classes and the pipeline currently feeds every detection through, so pedestrians and traffic signs get tracked and searched for number plates they cannot have. That is free compute back for a one-line change. Second, finish training the road detector: 42.4% mAP@50 is seven epochs of a hundred-epoch schedule, cut short by Colab disconnects, and the gap between it and the plate model at 98.3% is entirely a budget artefact rather than anything about the problem. After both, the per-track majority vote — OCR on the best few frames of a track, confidence-weighted — is what I would add before claiming an end-to-end accuracy number at all.",
  },
  {
    slug: "plant-disease",
    title: "Plant Disease Detection",
    what: "Leaf-image disease classifier with a fertilizer recommendation on top.",
    period: "May 2024",
    status: "Coursework",
    domain: "Deep Learning",
    role: "Sole author",
    stack: ["Python", "TensorFlow", "VGG16", "CNN", "Roboflow", "Google Colab"],
    featured: true,
    outcome:
      "87% accuracy classifying plant disease from a leaf image, using a frozen VGG16 backbone so the whole thing trained inside a single free Colab session.",
    tldr: [
      "Transfer learning on VGG16 — frozen convolutional base, retrained classifier head.",
      "87% classification accuracy across the disease classes.",
      "Diagnosis maps to a fertilizer and soil-type recommendation, so the output is an action rather than a label.",
    ],
    problem:
      "Training a convolutional classifier from scratch needs more labelled images and more GPU-hours than a student project has. The real constraint was never the architecture — it was that any approach requiring days of training was simply not available to me. Transfer learning is the answer to that constraint specifically: reuse features somebody else paid to learn, and spend your budget only on the last layer.",
    constraints: [
      "Free Colab sessions — training had to survive a runtime disconnect, so it had to be short.",
      "A modest labelled dataset, curated through Roboflow.",
      "Output needed to be actionable for a non-technical user, not just a class index.",
    ],
    architecture: {
      nodes: [
        { id: "img", label: "Leaf image", sub: "field photo" },
        { id: "pre", label: "Resize + normalize", sub: "VGG16 input spec" },
        { id: "vgg", label: "VGG16 conv base", sub: "frozen, ImageNet weights" },
        { id: "head", label: "Classifier head", sub: "trained from scratch" },
        { id: "cls", label: "Disease class", sub: "87% accuracy" },
        { id: "rec", label: "Fertilizer + soil lookup" },
      ],
      caption:
        "Only the head is trained. Freezing the base is what turned a multi-day job into a single-session one.",
    },
    decisions: [
      {
        decision: "VGG16 as the frozen backbone.",
        alternatives: "ResNet50, EfficientNet, MobileNet, or training from scratch.",
        why: "VGG16's uniform architecture makes the freeze boundary obvious and its ImageNet features transfer well to leaf texture and lesion patterns, which are exactly the kind of local texture cues ImageNet teaches. Newer backbones score better on ImageNet but the difference did not survive to this task at this dataset size — and VGG16's simplicity mattered more than a point of accuracy when debugging on a free runtime.",
      },
      {
        decision: "Freeze the convolutional base entirely rather than fine-tuning the top blocks.",
        alternatives:
          "Unfreeze the last convolutional block and fine-tune at a low learning rate.",
        why: "With a dataset this size, unfreezing invites overfitting and costs training time I did not have. Fine-tuning is the correct next move once there is more data — but only then.",
      },
      {
        decision: "Ship a recommendation layer, not just a classifier.",
        alternatives: "Return the disease class and stop.",
        why: "A farmer cannot act on 'Tomato — Septoria leaf spot'. Mapping the diagnosis to a fertilizer and soil type is a deterministic lookup, not ML, and it is what makes the model's output useful. It also forced me to be honest about which classes the model confuses, since a confident wrong diagnosis produces a confidently wrong recommendation.",
      },
    ],
    broke: [
      {
        what: "The gap between benchmark accuracy and a photo taken on a phone. Curated dataset images are well-lit, centred, and shot against clean backgrounds. Real field photos are none of those.",
        fix: "Partly mitigated with augmentation — rotation, brightness, and crop jitter — to push the training distribution toward field conditions. This is a real, unresolved limitation, not a solved problem, and it is the honest caveat on the 87%.",
      },
      {
        what: "Visually similar diseases across different crops were the bulk of the error, rather than errors being spread evenly.",
        fix: "Treated it as a data problem rather than an architecture one — the confusable pairs need more examples, not a bigger model.",
      },
    ],
    results: [
      { label: "Classification accuracy", value: "87%", note: "held-out split" },
      { label: "Backbone", value: "VGG16", note: "ImageNet, frozen" },
      { label: "Trainable layers", value: "Head only" },
    ],
    needsMeasurement: [
      "Per-class precision and recall — the confusable pairs are the interesting part",
      "Accuracy on phone photos vs. the curated split, which is the claim worth making",
    ],
    next: "The benchmark-versus-reality gap is the whole story of this project and I would lead with it next time. Collecting even a small set of genuine phone photos and reporting accuracy on both distributions would say more about the model than another point on the curated split ever could.",
  },
  {
    slug: "pingdrop",
    title: "PingDrop",
    what: "A cloud-free bridge between Android and macOS.",
    period: "Mar 2026",
    status: "In development",
    domain: "Systems",
    role: "Sole author — both platforms",
    stack: [
      "Swift",
      "Kotlin",
      "Bluetooth LE",
      "Wi-Fi TCP",
      "AES-256-GCM",
    ],
    featured: true,
    outcome:
      "Notifications, clipboard, and files move between an Android phone and a Mac with no server in the middle — over Bluetooth LE when that is all there is, over Wi-Fi when speed matters, switching between them without dropping the session.",
    tldr: [
      "Two transports, one session: Bluetooth LE for presence and small messages, Wi-Fi TCP for throughput, with automatic handover.",
      "AES-256-GCM on the wire; nothing leaves the local network and there is no account to sign into.",
      "macOS notification mirroring with per-app filtering, bi-directional clipboard sync, file transfer, and Android battery in the menu bar.",
    ],
    problem:
      "Every existing answer to this routes your notifications through somebody's server. That is a real privacy cost and a real dependency — the feature stops working when the company does. Building it peer-to-peer removes both, but replaces them with a harder engineering problem: without a server there is no stable rendezvous point, so the two devices have to find each other, agree on a transport, and survive that transport disappearing mid-session.",
    constraints: [
      "No cloud, no account, no relay — the two devices must find each other on their own.",
      "Bluetooth LE has tiny MTUs and low throughput; Wi-Fi is fast but not always the same network.",
      "Two entirely different platform APIs, and neither can be a thin port of the other.",
      "A phone in a pocket sleeps aggressively — the connection must be assumed dead and recoverable, not persistent.",
    ],
    architecture: {
      nodes: [
        { id: "and", label: "Android", sub: "Kotlin service" },
        { id: "ble", label: "Bluetooth LE", sub: "discovery + control" },
        { id: "pick", label: "Transport selection", sub: "same network?" },
        { id: "tcp", label: "Wi-Fi TCP", sub: "bulk payloads" },
        { id: "crypt", label: "AES-256-GCM", sub: "shared session key" },
        { id: "mac", label: "macOS", sub: "Swift menu-bar app" },
      ],
      caption:
        "BLE never stops running — it is the control channel that decides whether the Wi-Fi channel is worth opening.",
    },
    decisions: [
      {
        decision: "Keep both transports live rather than picking one at connect time.",
        alternatives:
          "Negotiate a single transport on connect and reconnect from scratch on failure.",
        why: "BLE is reliable and cheap but slow; Wi-Fi is fast but disappears when either device changes network. Treating BLE as a permanent control channel means the session survives Wi-Fi vanishing — the devices stay aware of each other and re-open the fast path when it returns, instead of dropping to a cold reconnect.",
      },
      {
        decision: "AES-256-GCM rather than encrypting only the payload body.",
        alternatives: "TLS over the TCP channel, or trusting BLE's own pairing.",
        why: "GCM is authenticated encryption, so it gives integrity as well as secrecy in one construction — a tampered packet fails to authenticate rather than decrypting to garbage. Relying on BLE pairing alone would have left the Wi-Fi path unprotected, and the two transports need the same guarantee for handover to be safe.",
      },
      {
        decision: "A native app on each platform rather than a cross-platform framework.",
        alternatives: "Flutter, React Native, or Kotlin Multiplatform.",
        why: "The features are precisely the ones that cross-platform frameworks hide: macOS menu-bar residency and notification-centre access, Android's notification listener and foreground-service rules. There is very little shared UI here — the shared part is the wire protocol, and that is a specification, not a library.",
      },
    ],
    broke: [
      {
        what: "Reconnection was the hard part, not connection. A phone that sleeps, moves out of range, or switches Wi-Fi leaves the Mac holding a socket that looks alive and is not.",
        fix: "Persistent reconnection driven by the BLE channel rather than by TCP timeouts — BLE presence is the source of truth for whether the peer exists, and the TCP session is treated as disposable.",
      },
      {
        what: "Notification mirroring without filtering is unusable. Every Android notification arriving on the Mac is noise, not a feature.",
        fix: "Per-app filtering, with the filter enforced on the Android side so filtered notifications are never transmitted at all — cheaper on the wire and better for privacy than filtering on receipt.",
      },
    ],
    needsMeasurement: [
      "File transfer throughput on each transport",
      "Handover latency when Wi-Fi drops mid-transfer",
      "Battery cost of the persistent BLE channel over a day",
    ],
    next: "Handover mid-file-transfer is the open problem — right now the fast path disappearing means the transfer restarts rather than resuming over BLE. Chunked transfers with per-chunk acknowledgement would let a transfer survive the switch, which is the behaviour the whole two-transport design is supposed to buy.",
  },
  {
    slug: "prompt-to-image",
    title: "Prompt-to-Image Generator",
    what: "A Django app that turns a text prompt into an image via Stability.ai.",
    period: "Aug 2024",
    status: "Coursework",
    domain: "Generative AI",
    role: "Sole author",
    stack: ["Python", "Django", "Stability.ai API", "REST"],
    repo: "https://github.com/Nani2421/image_generation",
    featured: false,
    outcome:
      "A prompt goes in, an image comes back, and the API key never touches the browser — the backend owns the credential, the request, and the response parsing.",
    tldr: [
      "Django backend integrating the Stability.ai generation API.",
      "API key held server-side; the client never sees it and cannot call the provider directly.",
      "JSON response parsed and the encoded image returned to the page in one flow.",
    ],
    problem:
      "The naive version of this app calls the generation API from JavaScript, which means shipping a paid API key to every visitor. Anyone can read it, and anyone can spend your credits. Putting a backend in the middle is not architecture for its own sake — it is the only place a secret can live.",
    constraints: [
      "A paid, rate-limited third-party API — every request costs real money.",
      "Generation takes seconds, not milliseconds, so the request cannot feel broken while waiting.",
      "The credential must never reach the client.",
    ],
    architecture: {
      nodes: [
        { id: "ui", label: "Prompt form", sub: "browser" },
        { id: "view", label: "Django view", sub: "holds the API key" },
        { id: "api", label: "Stability.ai", sub: "generation endpoint" },
        { id: "parse", label: "Parse JSON", sub: "extract encoded image" },
        { id: "render", label: "Rendered image" },
      ],
      caption:
        "The only reason this has a backend at all: the key lives at the Django view and nowhere else.",
    },
    decisions: [
      {
        decision: "Proxy the API through Django rather than calling it from the client.",
        alternatives: "Direct browser-to-provider calls with a restricted key.",
        why: "There is no such thing as a client-side secret. Proxying also puts the one place that spends money under my control, which is where any future rate-limiting or caching would have to go anyway.",
      },
      {
        decision: "Server-side response parsing rather than handing raw JSON to the page.",
        alternatives: "Return the provider's response verbatim and parse it in JavaScript.",
        why: "It keeps the provider's response shape an implementation detail. If the API changes its envelope, one Django view changes and the frontend does not — and the frontend never learns anything about the provider it does not need to know.",
      },
    ],
    broke: [
      {
        what: "A multi-second generation with no feedback reads as a broken page, and users retry — which costs money on a paid API.",
        fix: "Made the pending state explicit in the interface so the wait is legible as work rather than as failure.",
      },
    ],
    needsMeasurement: [
      "Median generation latency and cost per image",
      "Whether a deployed URL exists — a live link would make this the one genuinely shipped project",
    ],
    next: "The interesting version of this project is the one I did not build: a job queue so generation is asynchronous, a cache so identical prompts do not pay twice, and per-user rate limiting. All three are the same realization — the expensive external call is the thing the architecture should be organized around.",
  },
];

export const education = [
  {
    institution: "Vellore Institute of Technology, AP",
    credential: "B.Tech, Computer Science and Engineering",
    period: "Aug 2022 – Jun 2026",
    detail: "CGPA 8.8",
    location: "Amaravati",
  },
  {
    institution: "Narayana Junior College",
    credential: "Intermediate, MPC",
    period: "Aug 2020 – May 2022",
    detail: "92%",
    location: "Vijayawada",
  },
];

export const leadership = [
  {
    role: "Documentation Team Lead",
    org: "LEO Club, VIT-AP",
    period: "Nov 2024 – May 2025",
  },
  {
    role: "Core Team Member",
    org: "Machine Learning Club, VIT-AP",
    period: "Aug 2023 – Dec 2023",
  },
  {
    role: "Event Management",
    org: "NGC Club, VIT-AP",
    period: "Jan 2024 – May 2024",
  },
];

/** `url` points at the credential itself, taken from the résumé's own links. */
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

/** Learning tracks. Deliberately not mixed in with delivered work. */
export const focusAreas = [
  {
    title: "Retrieval-augmented generation",
    body: "Chunking and embedding strategy, and the retrieval-quality problem that decides whether a RAG system is useful or merely confident.",
  },
  {
    title: "Natural language processing",
    body: "Transformer internals, tokenization, and fine-tuning small models for narrow tasks instead of reaching for the largest one available.",
  },
  {
    title: "Production ML",
    body: "Serving, versioning, and monitoring — the inference-cost tradeoffs I started running into on the ANPR pipeline.",
  },
];

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Prev/next for case-study footers — a reader who finished one is warm. */
export function getAdjacent(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}
