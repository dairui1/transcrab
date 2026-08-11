---
title: How to Build a Shared AI Harness for Your Team
date: '2026-08-11T12:30:14.543Z'
sourceUrl: 'https://x.com/VibeMarketer_/status/2086808854898323774'
lang: source
---
I am going to show you how to turn the models, agents, skills, and automations living across your team's tools and workflows into one coordinated system.

What most teams have today looks very different. Their models, skills, and automations sit in separate tools, private conversations, and individual setups.

Each person has to teach their AI what they know and how they work. The context, corrections, and workflows they create rarely reach anyone else.

One person briefs Claude with the latest strategy. Another asks Codex to search an old folder. A third rebuilds a useful workflow from memory. Every chat contains a slightly different version of the business.

We built that shared layer with [HQ](https://hqforwork.com/). It sits underneath Claude Code, Codex, Cursor, or whichever open-source models your team chooses, carrying company context and capabilities between them.

Let's build one.

We'll start with a weekly intelligence worker that arrives on Monday already knowing what changed: which decisions were made, which projects moved, which risks grew, and what the team committed to next.

By the end, your team will have:

- one place every agent can retrieve current company context;
- operating rules that survive new chats and model changes;
- a weekly intelligence worker anyone on the team can run;
- shared skills and automations that improve as the team uses them;
- a review and sync loop that turns one person's improvement into the team's new starting point.
Do not begin by mapping the entire company. Prove the harness on one repeatable workflow, then expand it each time the team finds another process worth sharing.

## 1. Build the environment around the model

A model can reason, write, and call tools. It still needs an environment that explains how work happens inside your company.

A useful harness answers five questions:

1. What does the AI know?
2. How does it find the relevant context?
3. Which rules must it follow?
4. What repeatable work can it perform?
5. How does each run improve the next one?
A long system prompt can answer some of these questions for one session. A company harness makes the answers structured, persistent, and available to everyone.

The knowledge is searchable. The rules survive the chat. Tools have boundaries. Work leaves artifacts. Accepted workflows become reusable instead of disappearing when the conversation closes.

This is why the same model can feel completely different across two companies. The model may be identical. The working environment is not.

The model supplies intelligence. The harness supplies the company.

![](https://pbs.twimg.com/media/HPXVlKraQAAz22C.jpg)

## 2. Prove the harness on one real workflow

Trying to model the entire company first can leave you with weeks of organized context and no proof that the harness improves a single piece of work.

Start with a workflow that has four properties:

- it happens often;
- the boundaries are clear;
- it depends on company context;
- a human can judge the result quickly.
A weekly company-intelligence brief fits.

The inputs already exist, but they are scattered across meeting notes, project files, decisions, and people's heads. The output is useful across the team, and a founder can quickly tell whether the brief is accurate.

Define the contract before building the worker.

Inputs

- meetings from the last 7 days
- current project state
- decisions, commitments, and open questions
- risks and blocked work
Process

- retrieve the relevant sources
- verify every factual claim
- surface contradictions and missing information
- synthesize the company-level changes
Output

- decisions made
- progress by project
- risks and blockers
- commitments for next week
- source list
Boundary

- draft only
- stop for human review before distribution
If the workflow still changes every time a person runs it, keep it manual. A process should become repeatable before it becomes shared infrastructure.

## 3. Give the AI durable company memory

Start with the current [HQ guided setup](https://hqforwork.com/getting-started). Install HQ, create the company workspace, and open HQ as the active working directory in the AI tool your team already uses.

The [open-source quick start](https://github.com/indigoai-us/hq-core) is one command:

npx create-hq

Now add only the context required for the weekly brief.

Start with this structure:

- HQ
- companies
- your-company
- company-brief.md
- knowledge: decisions and playbooks
- sources: meetings
- signals
- people
- projects
- policies: weekly-intelligence.md
- workers: weekly-intelligence
Start here and add deeper knowledge, skills, automations, and company-specific workers only when a real workflow requires them.

The company brief explains what the business does, how it makes money, and what matters now. Projects hold current state. Decisions preserve why the team chose one path. People files make ownership visible.

Meeting intelligence captures the commitments, risks, questions, and decisions that never made it into a polished document.

Do not inject the entire company into every prompt. HQ's charter gives the agent a map of where knowledge, policies, projects, and workers live. The agent follows that map and retrieves the deeper source required for the task.

Give the agent a small, stable entry point and deeper context on demand.

This keeps company memory available without spending the context window before the work begins.

## 4. Turn company judgment into policy

Knowledge tells the worker what happened. Policy tells it how your company expects the work to be handled.

Create companies/your-company/policies/weekly-intelligence.md:

Weekly intelligence policy

1. Support every factual claim with a source.
2. Surface contradictory evidence. Never resolve it silently.
3. Report risks using the source's original level of urgency.
4. Label missing, stale, or uncertain information.
5. Never include secrets or cross-company context.
6. Stop for human approval before distribution.
Keep the first policy short enough that people will maintain it.

There are three levels of control:

1. An instruction asks the agent to follow a preference.
2. A policy makes the rule durable across sessions and people.
3. A hook or mechanical check blocks the action when failure would be costly.
"Cite your sources" can begin as policy. "Never send without approval" deserves enforcement at the action boundary.

Do not try to describe every possible behavior. Encode the few invariants that should survive every model, teammate, and project.

## 5. Package the workflow as a shared worker

Now turn the accepted procedure into a reusable HQ worker.

Run /newworker and give it one narrow job. A general company analyst sounds useful, but it is difficult to test and easy to misuse. A weekly-intelligence worker has clear inputs, output, and stopping conditions.

Worker specification:

Name: weekly-intelligence

Purpose: Produce a sourced weekly company brief for human review.

Allowed sources

- company brief
- meetings from the last 7 days
- current projects
- decisions and commitments
Procedure

1. Confirm the reporting window.
2. Retrieve the allowed sources.
3. Extract decisions, progress, risks, and commitments.
4. Verify claims against the source material.
5. Flag contradictions, gaps, and stale information.
6. Write the brief in the required format.
Required output

- executive summary
- decisions made
- project movement
- risks and blockers
- next-week commitments
- unresolved questions
- source list
Never

- invent missing facts
- read another company's context
- expose secrets
- send or publish the brief
Done when: Every claim is supported or labeled uncertain, and the draft is ready for human review.

The company knowledge supplies the facts. The policy supplies the judgment. The worker supplies the repeatable sequence.

One prompt can produce one useful brief. A worker makes the method available to another teammate next Friday.

![](https://pbs.twimg.com/media/HPXVlUnasAAWNYR.jpg)

## 6. Make every correction improve the harness

Do not treat the first successful run as finished infrastructure.

Run the worker, review the brief, and diagnose each correction at the right layer.

- Missing fact → Improve the company knowledge.
- Wrong context → Improve routing and resource descriptions.
- Repeated mistake → Improve the worker skill.
- Unsafe behavior → Improve the policy or hook.
- Weak deliverable → Improve the output contract.
- Stale information → Improve knowledge gardening.
![](https://pbs.twimg.com/media/HPXVlefaUAA76S5.jpg)

If the worker misses a decision because the meeting was never captured, rewriting the prompt will not fix the system. Improve the knowledge path.

If it keeps burying risks below minor updates, sharpen the output contract.

If someone asks it to distribute the brief without approval, strengthen the policy and the action gate.

The useful question is: which part of the environment allowed this mistake?

Fix that layer, then run the same example again. The correction should outlive the output that exposed it.

This is how human judgment compounds. You teach the system once, then make the improved behavior available to later runs instead of repeating the correction in private chats.

## 7. Make the harness smarter every time the team uses it

Once the brief, policy, and worker survive review, run /hq-sync.

This is where HQ becomes AI multiplayer.

Sales can turn objection handling into a skill. Support can encode escalation rules. Operations can improve a report. Engineering can add a review gate.

When each contribution survives review, it syncs into Main and becomes part of the shared company harness.

The next teammate inherits the context, rules, skills, workers, and automations the company has already proven. They do not need the original chat or prompt.

They open HQ in their preferred AI tool and continue from the improved version.

This is HQ's compounding loop: use the harness, improve one layer, review it, sync it, and raise everyone's starting point.

![](https://pbs.twimg.com/media/HPXVlrGbUAAqpNS.jpg)

The model can be Claude, Codex, ChatGPT, or an open-source model. The company layer keeps getting smarter underneath it.

Company isolation still applies. Sync should not flatten tenants, bypass permissions, or put secrets into shared files. A shared harness only works when the boundary around "shared" remains explicit.

Shared learning also raises the stakes. A weak instruction can now affect everyone, so treat Main like production.

Review every contribution before sync. Keep policies narrow. Test workers against real examples. Use /harness-audit to inspect context efficiency, quality gates, persistence, search, and security as the setup grows.

Once a change survives review, sync it. Then choose the next repeatable workflow and make the shared baseline better again.

The complete progression is:

Memory → context → policy → worker → review → team default

Start with one recurring job this week. Define its inputs, output, and approval boundary. Run it manually, correct it, then turn the accepted method into a worker your team can share.

The model will keep changing. Your company's memory, rules, and best ways of working should not reset with it.

If you want to build a shared harness for your own team, you can try [HQ](https://hqforwork.com/).

Follow me at @VibeMarketer_ for more. Thanks for reading :)
