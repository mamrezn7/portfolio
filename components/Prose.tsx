import { TODO_PREFIX } from "@/content/case-studies";

/**
 * Renders a paragraph, unless it is a TODO marker, in which case it renders as
 * a loud red block so an unfinished page cannot quietly ship.
 */
export function Para({ text }: { text: string }) {
  if (text.startsWith(TODO_PREFIX)) {
    return (
      <div className="todo" role="note">
        <strong>Still to write</strong>
        {text.slice(TODO_PREFIX.length).trim()}
      </div>
    );
  }
  return <p>{text}</p>;
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="prose">
      {paragraphs.map((p, i) => (
        <Para key={i} text={p} />
      ))}
    </div>
  );
}
