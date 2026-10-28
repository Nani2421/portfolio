/**
 * The long-form case studies behind /projects/[slug] — the problem, how it
 * works, the decisions and what broke. Every number here is real; anything that
 * was never measured is simply not claimed.
 */

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

export type CaseStudy = {
  slug: string;
  title: string;
  /** One line: what it is. Shown under the title everywhere. */
  what: string;
  period: string;
  status: "Shipped" | "Coursework" | "Prototype" | "In development";
  domain: string;
  role: string;
  stack: string[];
  /** Shown as buttons at the top of the page. */
  links: { label: string; href: string }[];
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
  /** Left out where nothing is on record, rather than invented. */
  broke?: Breakage[];
  results?: { label: string; value: string; note?: string }[];
  next: string;
};

export const caseStudies: CaseStudy[] = [
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
    links: [{ label: "GitHub repo", href: "https://github.com/Nani2421/Efficient-ANPR" }],
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
    next: "Two things, in order. First, filter the road detector's output by class before it reaches the tracker — it was trained on all 15 IDD classes and the pipeline currently feeds every detection through, so pedestrians and traffic signs get tracked and searched for number plates they cannot have. That is free compute back for a one-line change. Second, finish training the road detector: 42.4% mAP@50 is seven epochs of a hundred-epoch schedule, cut short by Colab disconnects, and the gap between it and the plate model at 98.3% is entirely a budget artefact rather than anything about the problem. After both, the per-track majority vote — OCR on the best few frames of a track, confidence-weighted — is what I would add before claiming an end-to-end accuracy number at all.",
  },
  {
    slug: "policymind",
    title: "PolicyMind AI",
    what: "A policy assistant that answers across a corpus of PDFs and cites the page.",
    period: "Aug 2026",
    status: "Prototype",
    domain: "Retrieval-Augmented Generation",
    role: "Sole author",
    stack: [
      "Python",
      "ChromaDB",
      "Gemini 2.5 Flash",
      "sentence-transformers",
      "BM25",
      "Streamlit",
    ],
    links: [{ label: "GitHub repo", href: "https://github.com/Nani2421/PolicyMind-AI" }],
    outcome:
      "Answers questions across eight company policy PDFs — 80 pages — and cites the document and page behind every claim. The part worth pointing at is not that it answers: it is that a relevance floor lets it return nothing, so “the documents don’t specify that” is a real output rather than a failure mode.",
    tldr: [
      "Hybrid retrieval — dense vectors in ChromaDB and BM25 keyword search over the same chunks, fused by Reciprocal Rank Fusion rather than a weighted score blend.",
      "A cross-encoder reranks the fused top 10 down to 5; anything scoring under the floor is dropped before the model ever sees it.",
      "Follow-ups are rewritten into standalone questions first, so “what about contractors?” retrieves something instead of nothing.",
      "Citations come from chunk metadata, not from asking the LLM where it read something.",
    ],
    problem:
      "A policy assistant that always produces an answer is worse than one that sometimes declines, because the person asking cannot tell the two cases apart. Everything hard about this project is on the retrieval side: pure embedding search is strong on paraphrase and weak on the exact tokens policy documents turn on — a clause number, an acronym, a defined term — and by the time weak context reaches the model, the model will use it. So the design question was never “which LLM” but “what is allowed to reach it”.",
    constraints: [
      "Eight policy PDFs, 80 pages. Small enough that I can tell a wrong answer from a right one by hand, which is what makes it a workable corpus to build against.",
      "Free Gemini tier — cost is per request, so the filtering has to happen in retrieval rather than by stuffing a large context and hoping.",
      "Runs locally on CPU. Embeddings, BM25 and the cross-encoder all have to be small enough to be interactive without a GPU.",
    ],
    architecture: {
      nodes: [
        { id: "pdfs", label: "8 policy PDFs", sub: "80 pages" },
        { id: "chunk", label: "Chunk per page", sub: "50 words, 10 overlap" },
        { id: "embed", label: "Embed", sub: "all-MiniLM-L6-v2" },
        { id: "chroma", label: "ChromaDB", sub: "persistent, page metadata" },
        { id: "hybrid", label: "Dense + BM25 → RRF", sub: "top 10" },
        { id: "rerank", label: "Cross-encoder rerank", sub: "top 5, score floor" },
        { id: "gemini", label: "Gemini 2.5 Flash", sub: "grounded prompt" },
        { id: "ans", label: "Answer + citations", sub: "document and page" },
      ],
      caption:
        "The first five stages optimise recall. Only the reranker and the floor optimise precision — they are the whole difference between a cited answer and a confident wrong one.",
    },
    decisions: [
      {
        decision:
          "Hybrid dense + BM25 retrieval, fused with Reciprocal Rank Fusion.",
        alternatives:
          "Dense vectors alone, or a weighted blend of cosine similarity and BM25 score.",
        why: "Embeddings are good at paraphrase and bad at exact tokens — a clause number or a defined term is semantically uninformative but lexically decisive, which is precisely what BM25 is good at. The two are complementary rather than redundant. RRF fuses by rank instead of score on purpose: cosine similarity and BM25 scores live on different, unbounded scales, so any weighted blend needs its weights retuned whenever the corpus changes. Rank has no units, so it needs no tuning.",
      },
      {
        decision: "Rerank with a cross-encoder instead of trusting the retriever's order.",
        alternatives:
          "Raise top-k and let the model sort out what is relevant from a larger context.",
        why: "A bi-encoder embeds the question and the chunk separately, so it can only ask whether they are about the same topic. A cross-encoder reads both together and can ask whether this chunk answers this question, which is a different and harder question — and the one that matters. It is far too expensive to run over the whole corpus, which is exactly why it belongs after retrieval rather than instead of it: 10 pairs is affordable, 10,000 would not be.",
      },
      {
        decision:
          "A hard relevance floor that is allowed to return zero chunks.",
        alternatives: "Always pass the top 5 through, whatever they scored.",
        why: "The failure mode of a policy assistant is not a missing answer, it is a fluent wrong one — someone acts on it. If the best chunk available is weak, passing it anyway hands the model material it will dutifully use. Dropping it means the honest answer survives to the user. This is the one decision in the project I would defend hardest, because it makes the demo look worse and the system behave better.",
      },
      {
        decision: "Rewrite follow-up questions into standalone ones before retrieval.",
        alternatives:
          "Embed the raw follow-up, or concatenate the whole conversation into the query.",
        why: "“What about contractors?” carries almost no retrievable signal by itself — the noun it depends on is three turns back. Concatenating the history instead drags every earlier topic into the query vector and blurs it. One extra call that resolves the pronouns turns an unretrievable question into a retrievable one, and it only runs when there is history to resolve.",
      },
    ],
    broke: [
      {
        what: "Chunks are 50 words with a 10-word overlap, cut inside each page. That is precise for retrieval and wrong for policy prose: a rule and its exception routinely land in different chunks, and retrieving only the first gives an answer that is correctly cited and still wrong.",
        fix: "Partly covered by returning up to five chunks and instructing the model to combine them rather than answer from one. That reduces the failure, it does not remove it — the real fix is structure-aware chunking that splits on clause boundaries instead of a word count, and I have not built it.",
      },
      {
        what: "Reranked results were repeatedly several chunks off the same page, which crowded the other seven documents out of the context entirely.",
        fix: "Deduplicate on (source, page) after reranking and before truncating to five, so the context spans pages rather than restating one.",
      },
      {
        what: "The relevance floor is a magic number. It sits on the cross-encoder's raw logit scale, which has no calibrated meaning, and I picked it by watching scores on questions I already knew the answers to.",
        fix: "Unresolved, and named here rather than hidden: it is tuned to this corpus and this reranker, and changing either invalidates it. Calibrating it properly needs a labelled question set, which is the same thing missing from the measurements below.",
      },
    ],
    results: [
      { label: "Corpus", value: "8 PDFs", note: "80 pages, indexed page-wise" },
      { label: "Retrieval", value: "Hybrid", note: "dense + BM25, fused by RRF" },
      { label: "Reranker", value: "Cross-encoder", note: "top 10 → top 5" },
      { label: "Context sent", value: "≤ 5 chunks", note: "deduplicated by page" },
    ],
    next: "The evaluation set, before anything else. Thirty questions with known answers and known source pages would convert most of this page from reasoning into evidence, and would let the relevance floor be chosen rather than guessed. After that, chunking on clause boundaries instead of a fixed word count — it is the largest remaining source of confidently-cited wrong answers, and no amount of reranking fixes a chunk that was split in the wrong place.",
  },
  {
    slug: "pingdrop",
    title: "PingDrop",
    what: "Your Android phone, on your Mac — no account, no cloud.",
    period: "Mar 2026 – Present",
    status: "Shipped",
    domain: "Systems",
    role: "Sole author — both platforms",
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Swift",
      "SwiftUI",
      "Bluetooth LE",
      "Wi-Fi TCP",
      "AES-256-GCM",
    ],
    links: [
      { label: "Website", href: "https://getpingdrop.vercel.app" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.app.pingdrop" },
      { label: "Download for Mac", href: "https://github.com/Neerajreddyapi/Pingdrop/releases/latest/download/PingDrop.dmg" },
    ],
    outcome:
      "Live on Google Play and as a notarised Mac app. Notifications, calls, clipboard and files move between an Android phone and a Mac with no server in the middle — over Bluetooth LE when that is all there is, over Wi-Fi when speed matters, switching between them without dropping the session.",
    tldr: [
      "Two transports, one session: Bluetooth LE for presence and small messages, Wi-Fi TCP for throughput, with automatic handover.",
      "AES-256-GCM on the wire; nothing leaves the local network and there is no account to sign into.",
      "Notification mirroring with replies, calls (including WhatsApp), clipboard sync, file and folder transfer, the phone as a Mac webcam, a walk-away lock, a desktop widget and Siri Shortcuts.",
      "Shipped and run end to end: Play releases and in-app billing, notarised Mac builds with in-app auto-updates, the website and the launch.",
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
    next: "Next on the list: the phone's screen on the Mac (reusing the webcam pipeline), camera filters for the webcam, and a wired USB mode for very large files — and the Product Hunt launch on 3 November 2026.",
  },
  {
    slug: "theft",
    title: "Real-Time Theft Detection",
    what: "Spots suspicious behaviour on CCTV video, live or recorded, with four YOLOv10 models.",
    period: "2025",
    status: "Prototype",
    domain: "Computer vision",
    role: "Sole author",
    stack: ["Python", "YOLOv10", "Ultralytics", "Google Colab", "Tesla T4"],
    links: [{ label: "GitHub repo", href: "https://github.com/Nani2421/REAL-TIME-THEFT-DETECTION" }],
    outcome:
      "Four YOLOv10 detectors — nano to large — trained to tell people from suspicious activity in CCTV frames. The large model reaches 84.9% mAP@50 on 1,325 held-out images; the nano model gets within 2.3 points of it at 2.2 ms per image on a Tesla T4.",
    tldr: [
      "Two classes — human and suspicion — trained on the Improved Thief Detection dataset from Kaggle.",
      "The same training recipe at four model sizes, all at 640 px, so a camera setup can choose speed or accuracy.",
      "Runs on a live CCTV stream or on recorded footage.",
    ],
    problem:
      "CCTV is recorded far more than it is watched. A detector that flags suspicious behaviour as it happens turns hours of footage into a few moments worth a look — but only if it can run on the hardware behind the cameras, not just on a large GPU.",
    constraints: [
      "Real time: a frame has to be processed before the next one arrives.",
      "Hardware differs per site — a single camera box and a central server cannot run the same model.",
      "Training on free Colab GPUs (a Tesla T4), in sessions that end.",
    ],
    architecture: {
      nodes: [
        { id: "cam", label: "CCTV frame", sub: "live stream or recording" },
        { id: "model", label: "YOLOv10", sub: "n · s · m · l, chosen per site" },
        { id: "det", label: "Detections", sub: "human · suspicion" },
        { id: "flag", label: "Flagged frames", sub: "suspicion above threshold" },
        { id: "out", label: "For review", sub: "the moments worth a look" },
      ],
      caption: "The four sizes share one pipeline — only the model file changes.",
    },
    decisions: [
      {
        decision: "YOLOv10 rather than an older YOLO.",
        alternatives: "YOLOv8, which most tutorials use.",
        why: "YOLOv10 is trained to predict without non-maximum suppression, so there is less post-processing per frame — the part that adds latency on live video.",
      },
      {
        decision: "Train four sizes instead of picking one.",
        alternatives: "A single model, and live with its speed.",
        why: "The right trade-off depends on where it runs. With all four trained and measured on the same validation set, the choice per camera is a lookup, not a guess: nano at 2.2 ms per image, large at 15.1 ms with 2.3 points more mAP@50.",
      },
    ],
    results: [
      { label: "YOLOv10-l mAP@50", value: "84.9%", note: "mAP@50-95 56.9% · 15.1 ms per image on a T4" },
      { label: "YOLOv10-s mAP@50", value: "84.1%", note: "mAP@50-95 55.5%" },
      { label: "YOLOv10-m mAP@50", value: "83.5%", note: "mAP@50-95 53.7% · 9.5 ms per image" },
      { label: "YOLOv10-n mAP@50", value: "82.6%", note: "mAP@50-95 53.3% · 2.2 ms per image" },
    ],
    next: "Turn detections into alerts: track each person across frames so one incident raises one alert, tune the suspicion threshold on real footage, and measure the models on CPUs and edge devices rather than only on a T4.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
