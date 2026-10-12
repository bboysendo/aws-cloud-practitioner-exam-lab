# AWS Service Comparisons — CLF-C02 Quick Reference

The exam rarely asks "what does service X do" in isolation — it asks you to pick the *right* service for a scenario, which means knowing how similar-sounding services differ. This is a condensed reference built alongside the question bank in this repo; several of these comparisons are demonstrated hands-on elsewhere in the [aws-cloud-practitioner-portfolio](https://github.com/bboysendo/aws-cloud-practitioner-portfolio).

## Compute

| | **EC2** | **Lambda** | **ECS / Fargate** | **EKS** |
|---|---|---|---|---|
| Unit of compute | Virtual machine (instance) | Function invocation | Container task | Kubernetes pod |
| You manage | OS, patching, scaling, capacity | Nothing but your code | Container image; Fargate removes server management | Kubernetes control plane is managed; you still manage worker node capacity unless using Fargate launch type |
| Billing | Per instance-hour, running or idle | Per invocation + duration, $0 when idle | Per task-second (Fargate) or per underlying EC2 instance | Control plane hourly fee + compute (EC2 or Fargate) |
| Best for | Full control, long-running processes, custom runtimes | Short, event-driven tasks, unpredictable/bursty traffic | Containerized apps without wanting AWS's own orchestrator opinions forced on you | Teams already standardized on Kubernetes |
| See it live | [`aws-high-availability-web-app`](https://github.com/bboysendo/aws-high-availability-web-app) (EC2 + ASG) | [`aws-serverless-image-processor`](https://github.com/bboysendo/aws-serverless-image-processor) | — | — |

## Storage

| | **S3** | **EBS** | **EFS** | **Instance Store** |
|---|---|---|---|---|
| Type | Object storage | Block storage | Managed NFS file system | Ephemeral block storage |
| Attach model | Accessed via API/HTTP, not "mounted" | Attaches to one EC2 instance at a time (standard) | Mounted concurrently by many instances | Physically tied to the host, lost on stop/terminate |
| Durability | 11 nines, regional | Replicated within its AZ | Replicated across AZs in a Region | None — lost if the instance stops |
| Best for | Static assets, backups, data lakes, website hosting | A single instance's boot volume / database files | Shared config, shared uploads across a fleet | Temp/cache data you can afford to lose |
| See it live | [`aws-s3-storage-lifecycle`](https://github.com/bboysendo/aws-s3-storage-lifecycle), [`aws-cloudfront-cdn-demo`](https://github.com/bboysendo/aws-cloudfront-cdn-demo) | — | — | — |

### S3 storage classes, from hottest to coldest

| Class | Access pattern | Retrieval |
|---|---|---|
| S3 Standard | Frequent | Milliseconds |
| S3 Standard-IA | Infrequent, but need millisecond access when requested | Milliseconds (+ per-GB retrieval fee) |
| S3 One Zone-IA | Infrequent, recreatable if the AZ is lost | Milliseconds (+ fee), single-AZ durability |
| S3 Glacier Instant Retrieval | Archive, but still needs millisecond access | Milliseconds |
| S3 Glacier Flexible Retrieval | Archive, rarely accessed | Minutes–hours |
| S3 Glacier Deep Archive | Long-term archive, almost never accessed | Hours (cheapest storage tier) |

Full worked lifecycle + cost example: [`aws-s3-storage-lifecycle`](https://github.com/bboysendo/aws-s3-storage-lifecycle).

## Databases

| | **RDS** | **DynamoDB** | **Redshift** |
|---|---|---|---|
| Model | Relational (SQL, joins, ACID across tables) | Key-value / document, NoSQL | Relational, but columnar — built for analytics |
| Scaling | Vertical + read replicas; you pick instance size | Virtually unlimited, automatic | Cluster-based, scales by adding nodes |
| Best for | Transactional apps with relational data | High-throughput key lookups at any scale | Business intelligence / data warehouse queries over large historical datasets |
| See it live | [`aws-rds-database-lab`](https://github.com/bboysendo/aws-rds-database-lab) (includes a full RDS-vs-DynamoDB writeup) | — | — |

## Networking

| | **Internet Gateway** | **NAT Gateway** | **VPC Peering** |
|---|---|---|---|
| Purpose | Two-way internet routing for a **public** subnet | One-way **outbound-only** internet access for a **private** subnet | Private connectivity between two VPCs |
| Who can initiate | Internet ↔ subnet, both directions | Only the private subnet → internet (not the reverse) | Either VPC, depending on route table config |
| Billed? | Free | Hourly + per-GB (not Free-Tier eligible) | Free for the peering connection itself; data transfer is billed |
| See it live | [`aws-vpc-networking-fundamentals`](https://github.com/bboysendo/aws-vpc-networking-fundamentals) | [`aws-vpc-networking-fundamentals`](https://github.com/bboysendo/aws-vpc-networking-fundamentals) | — |

## Messaging & Decoupling

| | **SQS** | **SNS** | **EventBridge** |
|---|---|---|---|
| Pattern | Queue — consumers pull messages | Pub/sub — pushes to every subscriber (fan-out) | Event bus — routes events to targets based on rules, from AWS services or custom apps |
| Delivery | At-least-once, consumer-paced | Immediate push to all subscribers | Rule-matched routing, supports scheduling too |
| Best for | Decoupling a producer from a slower/independent consumer, buffering spikes | Broadcasting one event to many independent subscribers at once | Complex event routing across many services/sources, including third-party SaaS |

## Security & Governance

| | **IAM** | **AWS Organizations (SCPs)** | **CloudTrail** | **GuardDuty** | **AWS Config** | **WAF** | **Shield** |
|---|---|---|---|---|---|---|---|
| Scope | Single account identities/permissions | Guardrails across multiple accounts | API call audit log | Threat detection (ML + threat intel) | Continuous configuration compliance | Layer-7 HTTP request filtering | Layer-3/4 DDoS protection |
| Answers | "What can this identity do?" | "What should no account in my org ever be allowed to do?" | "Who did what, when?" | "Is something suspicious happening?" | "Is this resource still configured the way it should be?" | "Should this HTTP request even reach my app?" | "Is my app being flooded?" |
| See it live | [`aws-iam-least-privilege-lab`](https://github.com/bboysendo/aws-iam-least-privilege-lab) | — | [`aws-security-threat-detection`](https://github.com/bboysendo/aws-security-threat-detection) | [`aws-security-threat-detection`](https://github.com/bboysendo/aws-security-threat-detection) | — | [`aws-security-threat-detection`](https://github.com/bboysendo/aws-security-threat-detection) | explained, not deployed — see that repo |

## EC2 Purchasing Options

| | **On-Demand** | **Reserved Instances / Savings Plans** | **Spot** | **Dedicated Hosts** |
|---|---|---|---|---|
| Commitment | None | 1 or 3 years | None | Usually with a reservation |
| Discount vs. On-Demand | — (baseline) | Up to ~72% | Up to ~90% | Varies, often for licensing reasons, not primarily cost |
| Risk | None, pay as you go | None (you're committing to pay regardless of usage) | Can be reclaimed with a 2-minute warning | None |
| Best for | Unpredictable, short-term, or new workloads | Steady-state, predictable workloads | Fault-tolerant, interruptible batch/async work | Compliance/licensing requiring dedicated physical hardware |
| See it live | [`aws-cost-monitoring-alerts`](https://github.com/bboysendo/aws-cost-monitoring-alerts) (cost tooling, not purchasing options directly) | — | — | — |

---
Part of the [aws-cloud-practitioner-exam-lab](..) repository, in the [aws-cloud-practitioner-portfolio](https://github.com/bboysendo/aws-cloud-practitioner-portfolio).
