# AWS Cloud Practitioner Exam Lab

28 **original** CLF-C02-style practice questions (none copied from, or claiming to reproduce, any real or leaked AWS exam question), a service-comparison quick reference, and a dependency-free **interactive quiz** you can open straight in a browser. Built as the final study tool while preparing for the **AWS Certified Cloud Practitioner (CLF-C02)** exam.

> ✅ **Status**: this is the one repo in this portfolio with no AWS infrastructure to deploy — everything here was actually run and checked locally. The question bank's structural integrity (unique IDs, exactly 4 options each, valid domain tags, non-empty explanations) was verified with `node scripts/validate_questions.js` — **28/28 questions pass, 0 problems found**. The quiz page was opened and exercised in a browser (served locally) to confirm shuffling, answer selection, explanations, and scoring all work.

## Table of contents
- [Learning objectives](#learning-objectives)
- [What's in here](#whats-in-here)
- [Originality note](#originality-note)
- [Repository structure](#repository-structure)
- [Setup](#setup)
- [Testing](#testing)
- [Cost considerations](#cost-considerations)
- [Limitations & future improvements](#limitations--future-improvements)
- [References](#references)

## Learning objectives

After working through this lab you should be able to:
- Self-assess your readiness across all 4 CLF-C02 exam domains, weighted roughly the way the real exam weights them.
- Recognize the "trap" pattern the real exam uses — two plausible-sounding answers where only one is precisely correct — by reading the `commonTrap` explanation on every question, right or wrong.
- Use the [service-comparisons.md](comparisons/service-comparisons.md) quick reference to resolve the specific services the question bank (and the exam) most often confuses.

## What's in here

- **28 original practice questions** (`questions/questions.js`), tagged by exam domain, each with 4 options, the correct answer, a plain-language explanation, and a note on the specific wrong answer most people are tempted to pick and why it's wrong.
- **Domain distribution**, chosen to roughly track the [official CLF-C02 exam guide](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf)'s weighting:

  | Domain | Questions | Official weight |
  |---|---|---|
  | Cloud Concepts | 7 (25%) | 24% |
  | Security and Compliance | 8 (29%) | 30% |
  | Cloud Technology and Services | 9 (32%) | 34% |
  | Billing, Pricing, and Support | 4 (14%) | 12% |

- **A zero-dependency interactive quiz** (`web/index.html`) — vanilla HTML/CSS/JS, no build step, no framework, no network calls. Pick a domain (or "all"), answer questions one at a time, see the explanation and common trap immediately after each answer, and get a per-domain score breakdown at the end.
- **A service-comparison quick reference** (`comparisons/service-comparisons.md`) covering the specific services the exam (and this question bank) most often pits against each other — EC2 vs. Lambda vs. ECS/Fargate vs. EKS, S3 storage classes, RDS vs. DynamoDB vs. Redshift, IGW vs. NAT, SQS vs. SNS vs. EventBridge, and the full security/governance lineup (IAM, Organizations, CloudTrail, GuardDuty, Config, WAF, Shield) — cross-linked to the hands-on labs elsewhere in this portfolio where each one is actually deployed.

## Originality note

Every question in this repository was written from scratch for this project. None are copied, paraphrased from, or claim to reproduce any real AWS certification exam question, leaked question bank, or third-party exam dump — doing so would violate the AWS Certification Agreement and provide no genuine learning value. These questions test the same **publicly documented** AWS concepts (service purposes, the Shared Responsibility Model, pricing models, the Well-Architected Framework) that the official exam guide lists as in-scope, in original scenarios.

## Repository structure

```
aws-cloud-practitioner-exam-lab/
├── README.md
├── LICENSE
├── .gitignore
├── questions/
│   └── questions.js                 # 28 questions: id, domain, question, options, correctIndex, explanation, commonTrap
├── web/
│   └── index.html                   # Self-contained interactive quiz (loads questions.js via <script>, no server required)
├── comparisons/
│   └── service-comparisons.md       # Cross-service quick-reference tables
└── scripts/
    └── validate_questions.js        # Structural integrity check for the question bank — actually run, 0 problems
```

## Setup

No installation needed to take the quiz:

```bash
# Just open it directly — questions.js is loaded via a <script> tag, not fetch(),
# so there's no CORS issue opening the file straight from disk.
open web/index.html        # macOS
start web/index.html       # Windows
xdg-open web/index.html    # Linux
```

Or serve it locally (also works great with GitHub Pages, if you want a hosted link to put on a resume/LinkedIn):
```bash
python3 -m http.server 8000
# then open http://localhost:8000/web/index.html
```

To validate the question bank after editing it (requires Node.js, no npm install needed — the script only uses built-ins):
```bash
node scripts/validate_questions.js
```

## Testing

**What was actually run, in this environment, right now:**
```bash
node scripts/validate_questions.js
```
Result: **28 questions checked, 0 problems found** — every question has a unique ID, a valid domain tag, exactly 4 distinct non-empty options, a `correctIndex` between 0–3, and non-empty explanation/commonTrap text. Domain counts: `cloud-concepts: 7, security-compliance: 8, technology-services: 9, billing-pricing: 4`.

The quiz page itself was served locally and exercised in a browser: starting a quiz, selecting an answer, confirming the correct option highlights green and the explanation/common-trap text appears, and the "Next"/"See results" flow advances correctly through shuffled questions and options.

**What you should check yourself**: the quiz has no backend and nothing to break per-browser, but if you fork this and add questions, re-run `node scripts/validate_questions.js` before publishing — it catches structural mistakes (wrong option count, duplicate IDs, out-of-range `correctIndex`) that would otherwise only surface as a silently broken question in the UI.

## Cost considerations

**$0.** This repository is pure static content (JS data + an HTML/CSS/JS page) and a Node.js validation script — there is no AWS infrastructure to provision, and nothing in this repo touches a real AWS account.

## Limitations & future improvements

- The question bank doesn't claim to be exhaustive — 28 questions is enough to sample all 4 domains meaningfully, not to replace full-length practice exams from AWS's own Skill Builder or a paid exam-prep provider.
- No persistence of quiz history/scores across sessions — each run is stateless, by design, to keep the page dependency-free (no `localStorage` complexity for a study tool this small).
- `validate_questions.js` checks structure, not AWS-accuracy — a question could pass validation and still be factually wrong if edited carelessly; treat AWS-accuracy review as a human responsibility when contributing new questions (and cross-check against the [official exam guide](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf) and current AWS documentation, since service details do change over time).
- Could be extended with a timed mode (matching the real exam's ~90-minute / ~65-question format) for more realistic practice conditions.

## References

- [AWS Certified Cloud Practitioner (CLF-C02) exam guide](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf)
- [AWS Skill Builder — official free training](https://skillbuilder.aws/)
- [AWS Certification Agreement](https://aws.amazon.com/certification/certification-agreement/) (covers exam content confidentiality — why this repo writes only original questions)

---
Part of the [aws-cloud-practitioner-portfolio](https://github.com/bboysendo/aws-cloud-practitioner-portfolio) — a set of independent, hands-on AWS labs built while studying for CLF-C02.
