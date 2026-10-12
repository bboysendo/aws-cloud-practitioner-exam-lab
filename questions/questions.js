// Original CLF-C02-style practice questions — written from scratch for this
// repository. None of these are copied from, or claim to reproduce, any real
// or leaked AWS exam question. They test the same publicly-documented
// concepts the exam guide covers, in original scenarios.
//
// Domain tags follow the official CLF-C02 exam guide's four domains:
//   cloud-concepts | security-compliance | technology-services | billing-pricing
//
// Schema per question:
//   id              unique string
//   domain          one of the four domain tags above
//   question        scenario text
//   options         exactly 4 strings
//   correctIndex    0-3
//   explanation     why the correct answer is correct
//   commonTrap      why a specific wrong answer is tempting, and why it's wrong

const QUESTIONS = [
  {
    id: "cc-01",
    domain: "cloud-concepts",
    question: "A startup wants to avoid large upfront hardware purchases and pay only for the compute it actually consumes each month. Which AWS Cloud value proposition BEST describes this benefit?",
    options: [
      "Trade capital expense for variable expense",
      "Increase speed and agility",
      "Stop guessing capacity",
      "Go global in minutes"
    ],
    correctIndex: 0,
    explanation: "Paying for compute as you use it, instead of buying servers upfront, is the textbook definition of trading capital expense (CapEx) for variable operating expense (OpEx).",
    commonTrap: "'Stop guessing capacity' is tempting because it also relates to not over-provisioning — but that benefit is about *elasticity* (scaling to match demand), not about the *expense model* the question is actually asking about."
  },
  {
    id: "cc-02",
    domain: "cloud-concepts",
    question: "Which AWS Well-Architected Framework pillar focuses on running workloads effectively, gaining insight into operations, and continuously improving supporting processes?",
    options: [
      "Reliability",
      "Operational Excellence",
      "Performance Efficiency",
      "Security"
    ],
    correctIndex: 1,
    explanation: "Operational Excellence covers running and monitoring systems to deliver business value, and continually improving processes and procedures.",
    commonTrap: "Reliability is about a workload recovering from failures and meeting demand — a different concern from the operational *processes* this question describes."
  },
  {
    id: "cc-03",
    domain: "cloud-concepts",
    question: "Which statement about AWS Availability Zones (AZs) is correct?",
    options: [
      "A Region contains exactly one AZ",
      "AZs in the same Region are usually located in different countries",
      "An AZ consists of one or more discrete data centers with redundant power and networking, isolated from failures in other AZs",
      "AZs and Regions are the same unit of isolation"
    ],
    correctIndex: 2,
    explanation: "An AZ is one or more physically separate data centers within a Region, engineered so that a failure in one AZ doesn't affect the others — the basis for multi-AZ high availability.",
    commonTrap: "Confusing a Region (a geographic area containing multiple AZs) with an AZ itself is extremely common — a Region always contains multiple AZs, never just one, and AZs within a Region stay in the same country/metro area for low-latency replication."
  },
  {
    id: "cc-04",
    domain: "cloud-concepts",
    question: "A company keeps some workloads on-premises and runs others in AWS, connected via AWS Direct Connect. Which deployment model does this describe?",
    options: [
      "Multi-cloud",
      "Private cloud",
      "Public cloud",
      "Hybrid cloud"
    ],
    correctIndex: 3,
    explanation: "Hybrid cloud describes a mix of on-premises infrastructure and a public cloud provider, connected together.",
    commonTrap: "Multi-cloud means using more than one *cloud provider* (e.g. AWS and Azure) — it doesn't describe mixing on-premises infrastructure with a single cloud provider."
  },
  {
    id: "cc-05",
    domain: "cloud-concepts",
    question: "Under the AWS Shared Responsibility Model, for an application running on plain EC2 instances, who is responsible for patching the guest operating system?",
    options: [
      "AWS",
      "The customer",
      "Both equally, automatically",
      "Neither — EC2 patches itself with no action needed"
    ],
    correctIndex: 1,
    explanation: "For EC2 (infrastructure-level service), AWS secures the physical hardware and hypervisor ('security OF the cloud'); the customer is responsible for the guest OS, application, and data ('security IN the cloud'), including OS patching.",
    commonTrap: "This flips for a fully managed service like RDS, where AWS DOES patch the underlying database engine OS — the exam expects you to know which responsibility applies to which service category, not a single blanket rule."
  },
  {
    id: "cc-06",
    domain: "cloud-concepts",
    question: "Which Well-Architected Framework pillar is primarily about using the right amount and type of computing resources to meet requirements, and maintaining that efficiency as demand and technology change?",
    options: [
      "Cost Optimization",
      "Sustainability",
      "Performance Efficiency",
      "Reliability"
    ],
    correctIndex: 2,
    explanation: "Performance Efficiency is about selecting and using the right resource types/sizes for a workload, and adapting as needs evolve — it's about efficient use of resources, not primarily about minimizing spend.",
    commonTrap: "Cost Optimization also touches 'efficiency,' but it specifically concerns avoiding unnecessary spend — Performance Efficiency is about matching resources to the technical workload, which are related but distinct pillars."
  },
  {
    id: "cc-07",
    domain: "cloud-concepts",
    question: "A workload sees predictable traffic spikes every Monday morning and is quiet the rest of the week. Which cloud characteristic BEST addresses handling this without paying for peak capacity all week?",
    options: [
      "Elasticity",
      "Economies of scale",
      "Go global in minutes",
      "High durability"
    ],
    correctIndex: 0,
    explanation: "Elasticity — the ability to scale resources up and down automatically to match demand — directly solves the 'provision for the spike, scale back down afterward' problem.",
    commonTrap: "Economies of scale is about AWS's aggregate purchasing power lowering unit prices over time — it doesn't describe adapting capacity to a short-term traffic pattern."
  },

  {
    id: "sc-01",
    domain: "security-compliance",
    question: "Which action is an AWS best practice regarding the AWS account root user?",
    options: [
      "Use the root user for daily administrative tasks for convenience",
      "Enable MFA on the root user and avoid using it for everyday tasks",
      "Share the root user's credentials with the whole ops team via chat",
      "Disable MFA on the root user to simplify automation"
    ],
    correctIndex: 1,
    explanation: "AWS recommends enabling MFA on the root user, locking away its credentials, and using IAM users/roles with least-privilege permissions for everyday work instead.",
    commonTrap: "None of the other options are ever correct — this question exists to confirm you know the root user is for account-level tasks only (like closing the account or changing support plans), not daily operations."
  },
  {
    id: "sc-02",
    domain: "security-compliance",
    question: "A user has an IAM identity policy that allows s3:GetObject on a bucket. The user is also a member of a group whose policy explicitly DENIES s3:GetObject on that same bucket. What is the user's effective permission?",
    options: [
      "Allowed, because the user's own policy is evaluated first",
      "Allowed, because explicit allows always override group-level denies",
      "Denied — an explicit Deny in any applicable policy always wins",
      "Undefined — IAM requires you to remove the conflicting policy before any request succeeds"
    ],
    correctIndex: 2,
    explanation: "IAM policy evaluation logic: if any applicable policy contains an explicit Deny, the request is denied, regardless of any Allow statements elsewhere (identity policy, group policy, or resource policy).",
    commonTrap: "It's tempting to think a more specific or 'closer' policy wins, like in some other permission systems — but IAM has no such precedence; explicit Deny is simply always final."
  },
  {
    id: "sc-03",
    domain: "security-compliance",
    question: "Which AWS capability lets an organization centrally apply and enforce consistent security guardrails (like 'never allow leaving a specific region') across many AWS accounts at once?",
    options: [
      "IAM policies attached to individual users",
      "AWS Organizations with Service Control Policies (SCPs)",
      "Amazon GuardDuty",
      "AWS Config rules in a single account"
    ],
    correctIndex: 1,
    explanation: "AWS Organizations lets you group multiple accounts and apply Service Control Policies that set permission guardrails across all of them centrally.",
    commonTrap: "IAM manages identities and permissions *within* a single account — it has no native concept of 'all accounts in my company,' which is exactly the gap Organizations/SCPs fill."
  },
  {
    id: "sc-04",
    domain: "security-compliance",
    question: "Which of these is an example of encryption 'in transit' rather than encryption 'at rest'?",
    options: [
      "TLS encrypting traffic between a client and an API Gateway endpoint",
      "S3 server-side encryption (SSE-S3) applied to stored objects",
      "An encrypted EBS volume attached to a running EC2 instance",
      "RDS storage encryption enabled on a database instance"
    ],
    correctIndex: 0,
    explanation: "'In transit' means protecting data while it moves across a network — TLS between a client and an endpoint is the classic example. The other three options all protect data while it's stored ('at rest').",
    commonTrap: "All four involve the word 'encryption,' which is why it's easy to pick any of them without checking whether the data is moving (in transit) or stored (at rest) at the moment of protection."
  },
  {
    id: "sc-05",
    domain: "security-compliance",
    question: "A compliance team needs a complete, immutable record of every API call made in the account — who called it, when, and from where — for later audit. Which service should they enable?",
    options: [
      "Amazon CloudWatch",
      "AWS CloudTrail",
      "AWS Trusted Advisor",
      "AWS Config"
    ],
    correctIndex: 1,
    explanation: "CloudTrail is purpose-built to record every API call (management and, optionally, data events) as an audit trail, including the identity, time, and source of the call.",
    commonTrap: "CloudWatch handles metrics, logs, and alarms for operational monitoring — it can *store* log data, but it isn't the service specifically designed to record 'who called which API, when' across your account."
  },
  {
    id: "sc-06",
    domain: "security-compliance",
    question: "A third-party SaaS vendor needs temporary, limited access to specific resources in your AWS account — without you creating a long-lived IAM user and access key for them. What should you use?",
    options: [
      "Share your root account credentials with the vendor",
      "Create an IAM role with a trust policy the vendor's account can assume",
      "Create an IAM user with an access key and rotate it manually",
      "Give the vendor a shared password to the AWS Console"
    ],
    correctIndex: 1,
    explanation: "An IAM role with a trust policy lets an external account (or service) assume temporary credentials scoped to exactly the permissions you grant — no long-lived secret changes hands.",
    commonTrap: "Creating an IAM user with an access key technically 'works,' but it's a long-lived credential you'd then have to rotate and protect — exactly the operational and security burden a role avoids."
  },
  {
    id: "sc-07",
    domain: "security-compliance",
    question: "What is the PRIMARY purpose of AWS Key Management Service (KMS)?",
    options: [
      "Centrally create, manage, and control cryptographic keys used to encrypt data",
      "Store and rotate IAM user console passwords",
      "Run automated compliance scans against resource configurations",
      "Detect anomalous network traffic and potential intrusions"
    ],
    correctIndex: 0,
    explanation: "KMS is a managed service for creating and controlling the encryption keys used across AWS services (S3, EBS, RDS, and more).",
    commonTrap: "KMS is about *keys*, not passwords — IAM handles user credentials, and KMS handles the cryptographic keys used to encrypt data, a distinction the exam tests directly."
  },
  {
    id: "sc-08",
    domain: "security-compliance",
    question: "A security team wants automated, continuous checks that resources comply with internal rules — for example, flagging any S3 bucket that becomes publicly readable. Which service is BEST suited for this?",
    options: [
      "AWS Config",
      "Amazon GuardDuty",
      "AWS Shield",
      "AWS CloudTrail"
    ],
    correctIndex: 0,
    explanation: "AWS Config continuously evaluates resource configurations against rules you define (or managed rules) and flags non-compliant resources — exactly this 'is this bucket still configured correctly?' use case.",
    commonTrap: "GuardDuty is about detecting *threats and suspicious behavior* (an ML/threat-intel problem), not continuously checking whether a resource's *configuration* still matches your policy — a common mix-up on the exam."
  },

  {
    id: "ts-01",
    domain: "technology-services",
    question: "Which statement correctly contrasts AWS Lambda with Amazon EC2?",
    options: [
      "Lambda bills per request/execution duration with no idle cost; EC2 bills per instance-hour whether the instance is idle or busy",
      "EC2 has no maximum execution time per request, while Lambda also runs indefinitely",
      "Lambda requires you to choose an instance type and patch the guest OS",
      "EC2 automatically scales its own compute capacity down to zero when idle, at no cost"
    ],
    correctIndex: 0,
    explanation: "Lambda is billed per invocation and execution time with nothing to pay when it's not running; an EC2 instance accrues instance-hour charges as long as it's running, regardless of whether it's actively serving traffic.",
    commonTrap: "It's tempting to think a 'stopped' EC2 instance costs nothing at all — compute charges stop, but attached EBS storage keeps billing, unlike Lambda's true zero-when-idle model."
  },
  {
    id: "ts-02",
    domain: "technology-services",
    question: "Which AWS database service is BEST suited for a traditional application requiring ACID transactions, joins, and SQL queries across related tables?",
    options: [
      "Amazon RDS",
      "Amazon S3",
      "Amazon DynamoDB",
      "Amazon S3 Glacier"
    ],
    correctIndex: 0,
    explanation: "RDS is a managed relational database service supporting SQL, joins, and ACID transactions across tables — the right fit for structured, relational data.",
    commonTrap: "DynamoDB is a very capable, massively scalable database, but it's a key-value/document store without native cross-table joins — the wrong fit when the workload specifically needs relational features."
  },
  {
    id: "ts-03",
    domain: "technology-services",
    question: "An application needs a traditional file system (NFS) that many EC2 instances can mount and read/write to concurrently. Which storage service fits?",
    options: [
      "Amazon EBS",
      "Amazon EFS",
      "Amazon S3",
      "EC2 Instance Store"
    ],
    correctIndex: 1,
    explanation: "EFS is a managed, elastic NFS file system designed to be mounted by many instances concurrently.",
    commonTrap: "EBS is block storage that (outside of Multi-Attach for specific use cases) attaches to a single instance at a time — the classic trap for anyone who hasn't learned the EBS-vs-EFS distinction yet."
  },
  {
    id: "ts-04",
    domain: "technology-services",
    question: "Which AWS service provides a managed control plane for running Kubernetes?",
    options: [
      "Amazon ECS",
      "AWS Fargate",
      "Amazon EKS",
      "AWS Lambda"
    ],
    correctIndex: 2,
    explanation: "EKS is AWS's managed Kubernetes service — it runs the standard, open-source Kubernetes control plane.",
    commonTrap: "ECS is also a container orchestrator, but it's AWS's own proprietary scheduler, not Kubernetes — a very common EKS-vs-ECS mix-up on the exam."
  },
  {
    id: "ts-05",
    domain: "technology-services",
    question: "A company needs a database offering single-digit-millisecond read/write performance at virtually unlimited scale, with a flexible (non-relational) schema. Which service fits best?",
    options: [
      "Amazon Redshift",
      "Amazon RDS",
      "Amazon DynamoDB",
      "Amazon EFS"
    ],
    correctIndex: 2,
    explanation: "DynamoDB is AWS's fully managed, serverless NoSQL database built specifically for consistent single-digit-millisecond performance at any scale.",
    commonTrap: "Redshift is a data warehouse optimized for large analytical queries over historical data, not low-latency single-item lookups — a different workload shape entirely."
  },
  {
    id: "ts-06",
    domain: "technology-services",
    question: "Which networking component allows instances in a private subnet to make outbound internet connections (e.g. to download OS patches) while remaining unreachable from the internet?",
    options: [
      "Internet Gateway",
      "NAT Gateway",
      "VPC Peering connection",
      "An Elastic IP attached directly to the private instance"
    ],
    correctIndex: 1,
    explanation: "A NAT Gateway, placed in a public subnet, lets private-subnet instances initiate outbound traffic while blocking unsolicited inbound connections from the internet.",
    commonTrap: "An Internet Gateway enables two-way internet routing for a subnet — attaching one to a private subnet would defeat the purpose of keeping it private, which is exactly why NAT (not an IGW) is the right tool here."
  },
  {
    id: "ts-07",
    domain: "technology-services",
    question: "Which AWS service is purpose-built for running complex analytical queries and business intelligence reporting across large volumes of historical data?",
    options: [
      "Amazon Redshift",
      "Amazon RDS",
      "Amazon DynamoDB",
      "Amazon ElastiCache"
    ],
    correctIndex: 0,
    explanation: "Redshift is AWS's managed data warehouse, built specifically for fast analytical (OLAP) queries over large datasets.",
    commonTrap: "RDS can technically run analytical queries too, but it's optimized for transactional (OLTP) workloads — Redshift's columnar storage is specifically what makes large analytical scans fast."
  },
  {
    id: "ts-08",
    domain: "technology-services",
    question: "What is the main benefit of using an Amazon Machine Image (AMI) when launching EC2 instances?",
    options: [
      "It's a template packaging the OS, configuration, and software so instances launch pre-configured and consistently",
      "It automatically encrypts every EBS volume ever attached to the instance",
      "It reduces the On-Demand hourly price of the instance",
      "It removes the need to attach a security group to the instance"
    ],
    correctIndex: 0,
    explanation: "An AMI is a template (OS + configuration + optionally pre-installed software) used to launch EC2 instances consistently and repeatably.",
    commonTrap: "AMIs *can* be built from encrypted snapshots, but encryption isn't automatic or inherent to the concept of an AMI itself — that's a configuration choice, not the AMI's main purpose."
  },
  {
    id: "ts-09",
    domain: "technology-services",
    question: "Which service is BEST for decoupling two application components so one can send messages for the other to pull and process independently, with built-in retry and at-least-once delivery?",
    options: [
      "Amazon SNS",
      "Amazon SQS",
      "AWS Step Functions",
      "Amazon EventBridge"
    ],
    correctIndex: 1,
    explanation: "SQS is a message queue: producers send messages, consumers pull and process them at their own pace, with built-in redelivery for unacknowledged messages — the standard decoupling/buffering pattern.",
    commonTrap: "SNS is a pub/sub *notification* service that pushes a message to every subscriber immediately (fan-out) — it doesn't hold messages for a consumer to pull on its own schedule the way SQS does, a very common SNS-vs-SQS exam trap."
  },

  {
    id: "bp-01",
    domain: "billing-pricing",
    question: "Which AWS tool lets you estimate the monthly cost of a proposed architecture BEFORE you build anything?",
    options: [
      "AWS Cost Explorer",
      "AWS Pricing Calculator",
      "AWS Budgets",
      "AWS Trusted Advisor"
    ],
    correctIndex: 1,
    explanation: "The AWS Pricing Calculator is designed specifically for pre-spend cost estimation of a planned architecture.",
    commonTrap: "Cost Explorer analyzes costs you've *already* incurred — it's a look-back tool, not a planning tool, despite both involving 'cost' in the name."
  },
  {
    id: "bp-02",
    domain: "billing-pricing",
    question: "A company runs a steady-state EC2 workload 24/7 for the foreseeable future and wants the lowest possible compute cost in exchange for a 1- or 3-year commitment. Which purchasing option fits BEST?",
    options: [
      "Spot Instances",
      "On-Demand Instances",
      "Reserved Instances or Savings Plans",
      "Dedicated Hosts, specifically for the discount"
    ],
    correctIndex: 2,
    explanation: "Reserved Instances / Savings Plans trade a time commitment for a significant discount over On-Demand — the right fit for predictable, steady-state usage.",
    commonTrap: "Spot Instances offer the deepest discount of all, but can be reclaimed by AWS with a two-minute warning — wrong for a workload that must run continuously without interruption."
  },
  {
    id: "bp-03",
    domain: "billing-pricing",
    question: "Which EC2 pricing model offers the steepest possible discount, in exchange for AWS being able to reclaim the instance with a two-minute warning?",
    options: [
      "On-Demand Instances",
      "Reserved Instances",
      "Savings Plans",
      "Spot Instances"
    ],
    correctIndex: 3,
    explanation: "Spot Instances use spare EC2 capacity at up to ~90% off On-Demand pricing, but AWS can reclaim them with a two-minute interruption notice.",
    commonTrap: "Reserved Instances and Savings Plans also discount EC2 significantly, but neither comes with the risk of AWS reclaiming the instance mid-use — that trade-off is unique to Spot."
  },
  {
    id: "bp-04",
    domain: "billing-pricing",
    question: "Which of the following AWS Free Tier offers is 'Always Free' (does not expire after 12 months)?",
    options: [
      "750 hours/month of a t2.micro EC2 instance",
      "750 hours/month of an RDS db.t2.micro instance",
      "1 million AWS Lambda requests per month",
      "5 GB of S3 Standard storage"
    ],
    correctIndex: 2,
    explanation: "Lambda's 1 million free requests per month (plus a monthly compute-time allowance) is part of the 'Always Free' tier, available indefinitely, not just for a new account's first 12 months.",
    commonTrap: "EC2, RDS, and S3's listed allowances are part of the '12 Months Free' tier for new accounts — it's easy to assume all Free Tier offers work the same way, but AWS actually has three different Free Tier categories (Always Free, 12 Months Free, and Trials)."
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONS };
}
