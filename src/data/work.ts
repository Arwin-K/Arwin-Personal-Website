export interface WorkItem {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  icon: string;
  summary: string;
  bullets: string[];
}

export const work: WorkItem[] = [
  {
    id: "sellstatic",
    role: "Software Engineering Intern",
    company: "SellStatic",
    location: "Toronto, ON",
    dates: "May 2026 - Present",
    icon: "briefcase",
    summary: "Full-stack work on an AI-native video editor, feedback automation, and a support chatbot.",
    bullets: [
      "Implementing feedback automation architecture with AWS SES, scheduled cron jobs, tokenized feedback links, unsubscribe handling, and database-backed email state to collect post-signup customer experience feedback.",
      "Designing and developing an AI-native browser-based video editor by improving React/Next.js editor workflows for media upload/loading, timeline editing, text overlays, animations, preview playback, autosave, and export across a complex interactive UI.",
      "Spearheading end-to-end development of a website chatbot feature by architecting the chat UI, integrating a GPT API plugin, implementing request/response handling, and designing production-ready interaction flows for user support and engagement.",
      "Debugging and improving project persistence by tracing reload-related state loss across frontend state, Prisma/PostgreSQL save/load flows, and persistent media storage - helping restore videos, timeline clips, text layers, and draft metadata after refresh.",
      "Developing QA workflows with Playwright, Playwright MCP, network/console monitoring, cross-browser testing, and upload/playback/export edge cases to validate editor reliability before release.",
    ],
  },
  {
    id: "amazon",
    role: "Artificial Intelligence Intern",
    company: "Amazon Work Experience Program",
    location: "Remote",
    dates: "Jun. 2023 - Aug. 2023",
    icon: "amazon",
    summary: "Built a supervised ML workflow for forest-cover classification on AWS, presented to AWS executives.",
    bullets: [
      "Built a supervised machine learning workflow on environmental datasets for forest-cover classification, structuring experiments for reproducible training, evaluation, and model comparison.",
      "Owned Python-based preprocessing and feature engineering with pandas, NumPy, and scikit-learn to clean inputs, standardize features, and improve training signal quality.",
      "Benchmarked k-NN, logistic regression, and neural network models, reporting trade-offs across accuracy, interpretability, and computational cost to guide model selection.",
      "Used AWS development workflows with Amazon SageMaker, Amazon S3, and Amazon EC2, collaborating on a 4-person team to present metrics-driven results and next steps to AWS executives.",
    ],
  },
];
