# TransCrab

TransCrab turns a link into a polished translated reading page. It is built as
a host-neutral [Agent Skill](https://agentskills.io/), so the same workflow can
run in OpenClaw, Hermes, Codex, or another compatible agent.

The repository scripts handle deterministic work: fetch, extract, convert,
validate, and publish files. The active agent handles the translation with its
current conversation model. The scripts never start a nested agent process.

## Supported Agent Hosts

| Host | Discovery or installation |
| --- | --- |
| [Codex](https://developers.openai.com/codex/skills) | Open this repository as the workspace. Codex discovers `.agents/skills/transcrab/SKILL.md`. |
| [OpenClaw](https://docs.openclaw.ai/tools/skills) | Use the repository as a workspace; it discovers `skills/` and `.agents/skills/`. |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md) | Run `hermes skills install onevcat/transcrab/skills/transcrab`, or copy the skill to `~/.hermes/skills/`. |
| Other Agent Skills hosts | Install `skills/transcrab/` using the host's normal Agent Skills mechanism. |

The canonical distributable skill is in `skills/transcrab/`. The copy under
`.agents/skills/` provides repository-level discovery for Codex and other
hosts that scan the shared project convention.

## What It Does

For an explicit `crab <url>` request, the agent:

1. fetches the page;
2. extracts the main content;
3. converts HTML to Markdown;
4. generates a versioned, host-neutral translation task;
5. translates with the active agent;
6. validates and writes the translated Markdown;
7. follows the installation's recorded local-only or publish/deploy policy.

The two-message form, URL followed by `crab`, is also supported within the
same conversation. A URL by itself is not a trigger. Prefer `crab <url>` when
moving between tasks or agent hosts because it does not depend on session
memory.

## Install

### Ask an agent

Give this prompt to OpenClaw, Hermes, Codex, or another coding agent:

```text
Help me install and deploy TransCrab from this repository:
https://github.com/onevcat/transcrab

Use the repository's transcrab Agent Skill and keep the active agent as the
translation runtime. Do not launch a nested agent CLI.
```

### Set up the repository

TransCrab requires Node.js 22 or newer.

```bash
git clone https://github.com/onevcat/transcrab.git
cd transcrab
npm ci
npm test
npm run build
```

Fork the repository first when the agent should commit translated articles to
your account.

### Configure deployment

Most static hosting providers use:

- Build command: `npm run build`
- Publish directory: `dist`

Netlify, Vercel, and Cloudflare Pages usually serve from the domain root. For a
GitHub Pages repository site, configure Astro with the real site origin and a
base path that ends in `/`:

```js
export default defineConfig({
  site: 'https://<user>.github.io',
  base: '/<repo>/',
});
```

The agent must derive the final public site URL, including any `base` path,
from your deployment. It must not assume the demo site's domain.

## Run the Pipeline

Prepare a source article and translation task:

```bash
node scripts/add-url.mjs "https://example.com/article" --lang zh --mode auto
```

On macOS and Linux, the working-directory-independent shell wrapper is
equivalent:

```bash
./scripts/run-crab.sh "https://example.com/article" --lang zh --mode auto
```

The command prints JSON and writes `agent-task.json` inside the new article
directory. Important fields include:

```json
{
  "schema": "transcrab.cli-result",
  "schemaVersion": 1,
  "status": "prepared",
  "slug": "example-article",
  "articlePath": "/a/2026/08/example-article/",
  "articleRelativePath": "a/2026/08/example-article/",
  "promptPath": "/path/to/translate.prompt.txt",
  "agentTaskPath": "/path/to/agent-task.json",
  "translationProfile": {
    "executionMode": "refined"
  },
  "agentTask": {
    "schema": "transcrab.agent-task",
    "schemaVersion": 1,
    "status": "awaiting_translation",
    "hostPolicy": {
      "translateWithCurrentAgent": true,
      "allowNestedAgentCli": false
    }
  }
}
```

`articlePath` is retained for compatibility. When a deployment has an Astro
`base` such as `/transcrab/`, append `articleRelativePath` to the configured
site base URL so a leading slash cannot discard the repository path.

The active agent reads `promptPath`, writes a Markdown translation whose first
line is an H1 title, and follows the structured `applySteps` in the task.
Each step exposes an `argvTemplate`; replace its documented
`{translationFile}` placeholder before execution.

For the default refined flow:

```bash
# First complete translation
node scripts/apply-translation.mjs <slug> \
  --lang zh \
  --in /tmp/translated.zh.draft.md \
  --stage draft

# Reviewed and revised translation
node scripts/apply-translation.mjs <slug> \
  --lang zh \
  --in /tmp/translated.zh.final.md \
  --stage final \
  --review-notes /tmp/translated.zh.review.md
```

`apply-translation.mjs` also accepts the translated Markdown on stdin. It emits
a versioned JSON result with `status: draft_applied` or `status: complete`.

## Agent Boundary

TransCrab deliberately uses a prepare/apply protocol instead of invoking a
specific model SDK or agent CLI:

```text
URL
  -> run-crab / add-url
  -> source.md + translate.prompt.txt + agent-task.json
  -> active agent translates
  -> apply-translation
  -> <lang>.md
  -> optional commit, deploy, verify
```

This avoids recursive agent sessions and keeps the behavior consistent across
different sandboxes, approval policies, and model providers. It also means the
agent and scripts must share the same local checkout. A remote agent without
access to the checkout needs an artifact transport layer, which this template
does not provide.

## Configuration

Defaults live in `transcrab.translate.config.json`:

```json
{
  "mode": "auto",
  "audience": "general",
  "style": "storytelling",
  "glossary": []
}
```

CLI flags override the file. Set `TRANSCRAB_TRANSLATE_CONFIG` to use another
config file and `TRANSCRAB_CONTENT_ROOT` to write article artifacts elsewhere.
Glossary entries are inserted into the translation profile as required term
choices. TransCrab does not currently promise a cross-host chunking protocol;
for a source that exceeds the active host's context or output limit, the agent
must use that host's continuation workflow, verify full source coverage, and
refuse to publish a truncated translation.

When normal extraction is too weak, TransCrab can use optional local helpers:

- `agent-browser` when it is on `PATH`;
- a Jina runner set with `TRANSCRAB_JINA_RUNNER` as an executable path or command name;
- `jina` on `PATH` when no runner is configured.

No helper path is tied to OpenClaw or to a specific user's home directory.

## Output

Preparation writes under `content/articles/<slug>/`:

- `source.md`
- `meta.json`
- `extraction.report.json` when extraction metadata is available
- `translation.profile.json`
- `agent-task.json`
- `01-analysis.md` when analysis is enabled
- `02-prompt.md`
- `03-draft.md`
- `04-critique.md` as a refined-mode scaffold
- `translate.prompt.txt`
- `translate.<lang>.prompt.txt` as a deprecated compatibility copy

The completed refined flow also produces or updates:

- `05-revision.md`
- `<lang>.md`, such as `zh.md`
- `lint.report.json`

The canonical published path is `/a/<yyyy>/<mm>/<slug>/`, with year and month
derived from the article date in UTC.

## Scripts

- `scripts/add-url.mjs`: fetch, extract, convert, and prepare the agent task
- `scripts/run-crab.sh`: working-directory-independent wrapper for `add-url`
- `scripts/apply-translation.mjs`: validate and apply draft/final translations
- `scripts/sync-upstream.sh`: update a fork from the template repository
- `scripts/BOOTSTRAP.md`: detailed setup contract for an installing agent

## Safety

The fetch step accesses the supplied HTTP or HTTPS URL. Article writes are
confined to the configured content root, and language tags and article slugs
are validated before they become file paths. URLs containing user credentials
are rejected; common token/signature query parameters and fragments are
removed from the source URL and extraction metadata before persistence.

Source pages and the Markdown extracted from them are untrusted input. The
translation prompt tells the active agent not to follow article instructions,
run commands, invoke tools, read files, or browse links found in that content.
Rendered Markdown is sanitized before Astro inserts it as HTML.

TransCrab is intended for a trusted local operator. HTTP/HTTPS validation is
not a complete SSRF defense. A public or multi-user service must add an
outbound network policy that blocks loopback, private, link-local, metadata,
credential-bearing, and redirect-to-internal destinations.

On first use, record whether `crab` means local-only or includes commit,
delivery, and deployment. Later runs follow that policy. Changing credentials,
remotes, production branches, or deployment settings still requires explicit
approval. A Codex work branch may not deploy, so publishing must use the
repository's configured PR/merge flow or an authorized production branch.

## Update

In a fork checkout:

```bash
./scripts/sync-upstream.sh
```

## License

MIT
