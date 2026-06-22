export interface FeaturedProject {
  id: string;
  name: string;
  stack: string[];
  dates: string;
  blurb: string;
  bullets: string[];
  repo?: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "lumisense",
    name: "LumiSense AI",
    stack: ["PyTorch", "ONNX", "OpenCV", "Raspberry Pi"],
    dates: "Jan. 2026 - Apr. 2026",
    blurb:
      "A stakeholder-facing edge AI solution for the UofT Sustainability Office to estimate floor-plane illuminance and support campus building lighting performance analysis.",
    bullets: [
      "Implemented an edge AI solution for the UofT Sustainability Office to estimate floor-plane illuminance and support campus lighting performance analysis.",
      "Developed a multitask vision model to estimate floor-plane illuminance by predicting a dense lux map, summary statistics (avg lux, p5, p95), and point-wise lux queries under/between fixtures.",
      "Implemented an encoder-decoder architecture with a ResNet-style backbone, U-Net-style upsampling, and task-specific heads for segmentation, lux regression, and uncertainty/quality estimation.",
      "Exported models to ONNX and deployed an edge inference loop on a Raspberry Pi using onnxruntime and OpenCV camera capture, enforcing preprocessing parity between training and inference.",
      "Added deployment reliability features including luminance-based frame-quality gating, debug logging, and snapshots while generating outputs for UofT Sustainability Office lighting performance reporting.",
    ],
  },
  {
    id: "truthlens",
    name: "TruthLens",
    stack: ["Python", "NLP", "TF-IDF", "Embeddings"],
    dates: "Jan. 2026 - Mar. 2026",
    blurb:
      "An end-to-end NLP pipeline that classifies articles as fake vs real, comparing classical ML baselines against transformer-based embeddings.",
    bullets: [
      "Implemented an end-to-end NLP pipeline that classifies articles as fake (0) vs real (1), structuring the notebook for reproducibility and extension to production workflows.",
      "Applied regex cleaning, stopword removal, and lemmatization while engineering TF-IDF features for lightweight baseline models.",
      "Compared classical ML baselines against transformer-based contextual embeddings, analyzing trade-offs in accuracy, compute cost, and generalization.",
      "Evaluated models using accuracy, precision, recall, F1, and confusion matrices; documented upgrade paths for hyperparameter tuning, ensembles, real-time inference, APIs, and dashboards.",
    ],
  },
];
