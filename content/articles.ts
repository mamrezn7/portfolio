/**
 * Articles published on the site. Written in the author's voice and checked
 * against the humanizer skill's patterns; every fact matches the case study
 * it links to.
 */

export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string; // ISO date
  /** The case study the article expands on. */
  caseSlug: string;
  /** Markdown-light body: paragraphs, "## " headings and one ```json block. */
  body: string;
};

export const articles: Article[] = [
  {
    slug: "llm-dashboard-copilot-without-trusting-it",
    title: "Letting a language model build dashboards without trusting it",
    description:
      "How I let an LLM propose charts and DAX measures in a BI dashboard builder while checking every column it names against the real data model before anything runs.",
    published: "2026-11-02",
    caseSlug: "farakav-ai-copilot",
    body: `Two months ago I commented on a LinkedIn post about AI and developer jobs. I wrote that AI agents can already handle a lot of coding, and then asked the question I keep coming back to: if AI writes the code, who checks that it is actually correct? I think that question is fair for code. In my day job it applies to something else as well, which is what an AI feature tells the people using it.

I work on Farakav, an analytics platform at Golrang System. Part of it is a dashboard builder where analysts pick columns and measures from an SSAS model and get charts, tables and pivot views. I am rewriting it, and the brief added AI on top: an analyst describes a chart or a measure, in Persian or in English, and gets it built.

## The problem with a confident answer

A language model will happily produce a column name that looks right and does not exist. Something like "Net Sales Amount" when the model only has "Net Amount", or a measure that was renamed a while ago. In a chat window that is annoying. In a reporting tool it is worse than an error. An error stops you, but a chart built on the wrong field looks finished, and people make decisions from charts that look finished.

So the question I had to answer was where the model's answer stops being trusted. Five rules came out of it.

## 1. The model proposes and never runs anything

The model never writes a query and never talks to SSAS. In the dashboard copilot it can do three things, as tool calls: propose a query definition (columns, measures, filters), propose a DAX measure, or ask a clarifying question. There is no tool for running anything. Whatever it proposes comes back to the screen as a card the analyst can preview, change or throw away.

A proposal looks roughly like this:

\`\`\`json
{
  "type": "query",
  "columns": ["Date[Month]", "Region[Province]"],
  "measures": ["Sales[Net Amount]"],
  "filters": [{ "column": "Date[Year]", "equals": 2026 }]
}
\`\`\`

## 2. It sees the real model, and only what the analyst may see

The prompt carries the model's actual metadata: its tables, columns, measures and their display names. Hidden fields are left out, so if an analyst cannot see a field, the model does not know it exists either.

This grounding helps a lot. It is still only an instruction, though, and a model can ignore an instruction.

## 3. Every id is checked after it answers

When a proposal comes back, every column and measure id in it is checked against the same metadata before the analyst sees anything. If one of them does not exist, the proposal becomes a clarifying question instead, along the lines of "I could not find that field, did you mean one of these?"

The prompt and the check do different jobs. The prompt makes good answers more likely, and the check is what stops a bad one from reaching the screen. If I could only keep one of them, I would keep the check.

## 4. One path to the data

When an analyst approves a proposal, it goes through the same query engine as a chart someone built by hand: the same planner, the same DAX generator, the same permissions and the same row-level security. The AI is a new way to describe what you want, and it reaches the data through the code that was already there.

If the AI path had its own query code, the two would drift apart, and a bug fixed in one would stay alive in the other.

## 5. Structured definitions instead of strings of DAX

The later features follow the same rule: a natural-language measure builder, a DAX copilot that explains, repairs and generates expressions, and an analyst that answers questions about a dashboard by running validated queries.

Where it can, the model returns a structured definition, for example "aggregate this column", "divide this measure by that one" or "compare with the previous year", and existing, tested code turns it into DAX. A structure is easy to validate. Free-form DAX written by a model is much harder, and I would rather not have that problem.

## One gateway for every model call

All of these features call one AI gateway instead of calling a provider directly. It picks the provider and model from configuration per task, follows a data-sensitivity policy (some requests have to stay on the company's internal model), falls back to a second provider when the first one fails, and logs usage and cost. Switching between Claude, OpenAI and the internal model only takes a configuration change.

At one point there was a dropdown in the UI for choosing the provider. We removed it. I think which model handles which data is a decision for whoever runs the system, and a chat box is the wrong place for it.

## What I got wrong

The first version of that gateway was built from a summary of the requirements instead of the specification itself. It ended up as a third hard-coded provider next to the other two. The actual spec asked for a model-agnostic gateway with routing and fallback, so that work had to be redone.

The lesson is boring, and I keep relearning it: read the source document before building, however clear the summary sounds.

## Back to the comment

I still think the question in that comment was the right one to ask. Working on this product, I have started to use it as a requirement for any AI feature: the model may be wrong, so the product has to stop a wrong answer before it reaches the screen looking like a finished chart.`,
  },
];
