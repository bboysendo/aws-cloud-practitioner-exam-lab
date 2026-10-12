#!/usr/bin/env node
/**
 * Data-integrity check for questions/questions.js — run before publishing
 * new questions. Checks structure only, not AWS accuracy (that's a human
 * review responsibility, noted in the README).
 *
 * Usage: node scripts/validate_questions.js
 */
const path = require("path");
const { QUESTIONS } = require(path.join(__dirname, "..", "questions", "questions.js"));

const ALLOWED_DOMAINS = new Set([
  "cloud-concepts",
  "security-compliance",
  "technology-services",
  "billing-pricing",
]);

function main() {
  const errors = [];
  const seenIds = new Set();
  const domainCounts = {};

  if (!QUESTIONS || QUESTIONS.length === 0) {
    errors.push("No questions found.");
  }

  for (const [i, q] of (QUESTIONS || []).entries()) {
    const where = `question[${i}] (id=${q.id ?? "?"})`;

    if (!q.id) {
      errors.push(`${where}: missing 'id'`);
    } else if (seenIds.has(q.id)) {
      errors.push(`${where}: duplicate id '${q.id}'`);
    } else {
      seenIds.add(q.id);
    }

    if (!ALLOWED_DOMAINS.has(q.domain)) {
      errors.push(`${where}: invalid domain '${q.domain}'`);
    } else {
      domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1;
    }

    if (!q.question || !q.question.trim()) {
      errors.push(`${where}: empty question text`);
    }

    const options = q.options || [];
    if (options.length !== 4) {
      errors.push(`${where}: expected exactly 4 options, got ${options.length}`);
    } else if (options.some((opt) => !String(opt).trim())) {
      errors.push(`${where}: one or more options are empty`);
    } else if (new Set(options).size !== 4) {
      errors.push(`${where}: options are not all distinct`);
    }

    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) {
      errors.push(`${where}: correctIndex must be an integer 0-3, got ${q.correctIndex}`);
    }

    if (!q.explanation || !q.explanation.trim()) {
      errors.push(`${where}: missing explanation`);
    }

    if (!q.commonTrap || !q.commonTrap.trim()) {
      errors.push(`${where}: missing commonTrap`);
    }
  }

  console.log(`Checked ${(QUESTIONS || []).length} questions.`);
  console.log("Per-domain counts:", domainCounts);

  if (errors.length > 0) {
    console.log(`\n${errors.length} problem(s) found:`);
    for (const err of errors) console.log(`  - ${err}`);
    process.exit(1);
  }

  console.log("All checks passed.");
  process.exit(0);
}

main();
