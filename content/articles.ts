/**
 * Articles published on the site, in the author's voice and checked against
 * the humanizer skill's patterns. The private drafts live in cv-private.
 */

export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string; // ISO date
  /** The case study the article expands on, if any. */
  caseSlug?: string;
  /**
   * Markdown-light body: paragraphs, "## " headings, fenced code, "- " and
   * "1. " lists, and inline `code`, **bold** and [links](url).
   */
  body: string;
};

export const articles: Article[] = [
  {
    slug: "jalali-dates-in-form-js",
    title: "What it took to add Jalali dates to form-js",
    description:
      "Jalali dates inside BPMN-IO's form-js, without forking it: how the monorepo is put together, how a value moves through it, and every part the feature had to reach.",
    published: "2026-11-10",
    body: `I was working on a project that needed a form builder for the forms inside business processes. After some research, I found that BPMN-IO's form-js was a good library for it, but it lacked something our users needed. They work in Persian, so the forms needed the Jalali calendar in the date logic as well as on screen, in the form viewer and in the form builder, and form-js only knows Gregorian dates. Forking the library was ruled out from the start, because a fork of a project this size becomes a second product that you maintain alone.

I already knew the calendar. Most of the work was fitting it into form-js's architecture: a large monorepo I hadn't written, code that is hard to follow, and very little documentation for the internals I needed to change. Before I could change anything safely, I had to work out how it fitted together. Below is the map I ended up with, and what the feature needed from each part of it.

The code has moved on since I worked on it. I've checked the details below against the current source.

## How form-js is put together

form-js is a monorepo of separately published packages:

- \`form-js-viewer\` renders a form from a JSON schema and data, validates it and produces the submission.
- \`form-js-editor\` is the drag-and-drop form builder. It depends on the viewer.
- \`form-js-playground\` combines the two with panels for input and output data, and depends on both.
- \`form-json-schema\` describes what a valid form schema is.
- \`form-js\` bundles the viewer, editor and playground. Today there is also an \`i18n\` package for translations and an integration test package.

Nothing in it is wired together by hand. Each package is assembled from dependency-injection modules (didi, the same container the rest of bpmn.io uses), and almost every behaviour is a service you can replace. The viewer's core module alone registers the event bus, the importer, the field factory, a field registry and a field-instance registry, a path registry, the layouter and the validator. Features such as the FEEL expression language, templating, markdown, viewer commands and repeating groups are further modules on top.

Fields are Preact components. A \`FormFields\` registry maps each field type (\`textfield\`, \`number\`, \`datetime\` and the rest) to its component, and the renderer looks components up there by type.

The editor is a second application on the same pieces. It builds its own injector with modeling and a command stack, a properties panel, drag and drop, a palette and selection. Its \`EditorFormFields\` extends the viewer's registry and swaps in editor versions of a handful of field types:

\`\`\`js
export class EditorFormFields extends FormFields {
  constructor() {
    super();
    editorFormFields.forEach((formField) => {
      this.register(formField.config.type, formField);
    });
  }
}
\`\`\`

The date field isn't one of those, so the builder's canvas renders the viewer's own date component inside a different injector.

## How a value moves through it

A value goes through five stages, and the date feature had to hold at every one of them:

1. Import: \`importSchema\` hands the schema to the importer, which creates every field, registers it, and claims its key or path in the path registry.
2. Initial data: Each field's value is read from the supplied data at its value path, falls back to its default, and passes through the field type's \`sanitizeValue\`. For the date field, that's where an incoming string becomes a value the component accepts, or gets discarded.
3. Changes: A component reports a new value. The form updates its state and emits \`field.updated\` and \`changed\` on the event bus, and anything listening reacts.
4. Expressions and validation: Conditions, templates and some validation bounds (\`min\`, \`max\` and length limits) are FEEL expressions evaluated against the current data, and the validator runs on every relevant change.
5. Submit: The submission collects every keyed, enabled field instance by its value path, which may be nested, from the current state.

So the value in state is a contract. Expressions read it, the validator reads it, the submission sends it on, and the process engine on the other side stores it. For dates that contract is an ISO string, \`YYYY-MM-DD\`, with separate formats for time and date-time.

## Inside the date field

Inside the date field, a single value passes through four libraries and conventions:

- The picker wraps flatpickr, whose calendar is Gregorian.
- The value is written as an ISO string by Luxon.
- The display format is derived from \`Intl\`, based on the browser's locale.
- Validation helpers check the string's shape by splitting it on \`-\` and \`T\`.

That has a consequence that is easy to miss. In a \`fa-IR\` browser, \`Intl\` defaults to the Persian calendar:

\`\`\`js
new Intl.DateTimeFormat("fa-IR").resolvedOptions().calendar;
// "persian"
\`\`\`

The field takes its date pattern from there, and flatpickr then fills that pattern with Gregorian values. Out of the box, the format and the value come from two different calendars.

## What the feature needed

The design decision that everything else followed from was to keep the stored value exactly as it was: Gregorian, ISO, the same contract as before. Jalali lives at the edges, in what a person sees, picks and types. That kept FEEL conditions, validation, the submission and every system downstream unchanged, and it kept existing forms and saved data valid.

Getting there meant reaching every layer above:

- The viewer needed a Jalali date field. flatpickr only knows the Gregorian calendar, so the new field uses [jalaliDatePicker](https://github.com/majidh1/jalaliDatePicker) instead, a small picker with no dependencies that handles Jalali dates and times. The harder part was that the two libraries disagree about who owns the input. form-js renders it as a Preact component and treats its value as state. jalaliDatePicker attaches itself to inputs on focus, writes Jalali strings such as \`1403/01/10\` into them and announces the change with its own \`jdp:change\` event. The field sits between the two. It opens the picker on its own input, listens for the picker's events, converts the Jalali string to the ISO value the form expects and back again on every render, and parses dates people type by hand. The time and date-time subtypes map onto the picker's time options. The field is registered under the existing \`datetime\` type through a module, so the registry resolves to it and every schema that already used the field picked it up.
- Existing ISO values and defaults had to come through the import and sanitising path into the new field unchanged, for the date, time and date-time subtypes, and conversions had to happen at the right time zone, so a value near midnight in Tehran stays on the right day.
- Users type Persian or Arabic digits, such as ۱۴۰۵, and the stock number field accepts a key only if it matches \`/^[0-9]$/\`. Input had to be normalised before it reached any of that logic.
- Bounds such as "no dates in the past" are evaluated on the Gregorian value. The picker has its own \`minDate\` and \`maxDate\`, so they had to be fed from the same field settings, or the calendar would offer days the validator then rejects. The messages still had to make sense in Jalali.
- The editor has its own injector and its own field registry, so the field had to be registered there too, so the builder's canvas shows the same field a user will see. The properties panel has its own date-time settings and constraints, which also had to read correctly.
- The playground, where the editor and viewer meet, had to work as well. It is the one place where the round trip from schema to rendered form to submitted data can be tested.
- jalaliDatePicker attaches its calendar to the page body by default, outside the form's own markup. In the builder that meant it had to stack above the canvas and the properties panel instead of opening behind them, and it had to be styled to match the form instead of the about 50 lines of flatpickr styling the stock field relies on.

Every one of these sits outside the library's source, as modules registered through its extension points and a stylesheet layer of our own, so upgrades stayed routine and we never had to fork.

## Working in a codebase like that

Most of my time went into finding out where things happen. Code that runs through dependency injection and an event bus doesn't let you follow a call from one place to the next. A service is resolved by name, an event is emitted in one package and handled in another, and the documentation stops where the public API does.

What worked for me was following a single value end to end, from the schema through import, state, the event bus, validation and submission, and writing down what I found. Those notes became the documentation I needed. The rule I would apply to any library this size is to change nothing until you can say where your change will be resolved, rendered, validated and serialised.

## What I would do differently

I would ask earlier whether this was the right foundation. form-js is a capable library, and it was much larger than our requirements. Every feature we added had to fit someone else's architecture, which cost time in every sprint. Building our own form layer would have cost more in the first month and less in every month after.`,
  },
];
