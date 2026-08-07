import { useCallback, useEffect, useRef, useState } from "react";

type Section = {
  heading: string;
  lead?: string;
  items: string[];
};

const REPORT_TITLE = "Resonance: Fractured Frequency";
const REPORT_SUBTITLE = "Pre-Production Design — Work Report";
const REPORT_DATE = "July 1, 2026";
const REPORT_REPO = "The-Nexus-system/Resonance-Fractured-Frequency (branch: main)";

const SECTIONS: Section[] = [
  {
    heading: "Summary",
    lead: "Three units of work were completed, reviewed, and pushed to the canonical repository.",
    items: [
      "Authored a new canonical design document establishing how every playable profession experiences the opening operation.",
      "Synchronized all cross-references to the new document across the existing design corpus.",
      "Disambiguated 276 duplicated headings so the entire repository is screen-reader navigable with zero duplicate headings.",
      "Passed an architecture review and corrected the single item it flagged.",
    ],
  },
  {
    heading: "New Canonical Document — Operation One Perspective Map",
    lead: "docs/design_notes/operation_one_exodus_perspective_map.md (259 lines).",
    items: [
      "Defines the vantage layer for Operation One: how the eight professions each experience the same fixed events and spaces.",
      "Canon locked: the player is a member of the chosen profession, not its named lead.",
      "The named professional leads launch from fixed-scatter pods and are rescued in Chapter Two.",
      "Regardless of profession, the player wakes in a separate damaged pod — the place where Faience first stirs.",
      "Written clean to house style: single H1, ## sections, ### subsections disambiguated by name, bullet lists, no tables, no placeholders.",
    ],
  },
  {
    heading: "Cross-References Synchronized",
    lead: "The new document was wired into the existing corpus so nothing points at a gap.",
    items: [
      "Master Timeline — updated Purpose and Relationship sections.",
      "Character Schedule — references refreshed.",
      "Modular Architecture Bible — reference added.",
      "Design Notes index (README) — new entry added.",
      "Decision Log — entry appended recording the addition.",
    ],
  },
  {
    heading: "Heading Disambiguation",
    lead: "A repository-wide accessibility pass.",
    items: [
      "Scope: the crew progression system document and maintenance chapters two through seven (chapter one was already clean).",
      "276 duplicated ### headings were prefixed with their parent ## section name (e.g. \"### Part Two — Purpose\").",
      "Heading lines only — no canon or narrative content was changed.",
      "Result: the repository now has zero duplicate headings.",
      "Decision Log — entry appended recording the pass.",
    ],
  },
  {
    heading: "Review & Validation",
    items: [
      "Architecture review returned PASS with no blocking issues.",
      "The one flagged item — stale \"will describe / once written\" wording in the timeline Purpose section — was corrected.",
    ],
  },
  {
    heading: "Repository",
    items: [REPORT_REPO],
  },
];

function buildPlainText(): string {
  const lines: string[] = [];
  lines.push(`${REPORT_TITLE}`);
  lines.push(`${REPORT_SUBTITLE}`);
  lines.push(`Date: ${REPORT_DATE}`);
  lines.push("");
  for (const section of SECTIONS) {
    lines.push(`## ${section.heading}`);
    if (section.lead) {
      lines.push(section.lead);
    }
    for (const item of section.items) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function App() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const resetRef = useRef<number | null>(null);

  const handleCopy = useCallback(async () => {
    const text = buildPlainText();
    let ok = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      const textarea = document.createElement("textarea");
      try {
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "-1000px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      } finally {
        if (textarea.parentNode) {
          textarea.parentNode.removeChild(textarea);
        }
      }
    }

    setCopied(ok);
    setFailed(!ok);

    if (resetRef.current !== null) {
      window.clearTimeout(resetRef.current);
    }
    resetRef.current = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (resetRef.current !== null) {
        window.clearTimeout(resetRef.current);
      }
    };
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>{REPORT_SUBTITLE}</p>
            <h1 style={styles.title}>{REPORT_TITLE}</h1>
            <p style={styles.date}>{REPORT_DATE}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              ...styles.copyButton,
              ...(copied ? styles.copyButtonDone : {}),
              ...(failed ? styles.copyButtonFail : {}),
            }}
          >
            {copied ? "Copied" : failed ? "Copy failed — select manually" : "Copy report"}
          </button>
        </header>

        <div style={styles.rule} />

        {SECTIONS.map((section) => (
          <section key={section.heading} style={styles.section}>
            <h2 style={styles.h2}>{section.heading}</h2>
            {section.lead ? <p style={styles.lead}>{section.lead}</p> : null}
            <ul style={styles.list}>
              {section.items.map((item, i) => (
                <li key={i} style={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <footer style={styles.footer}>
          Generated report — click “Copy report” to copy a plain-text version.
        </footer>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    padding: "48px 20px 80px",
    background:
      "radial-gradient(1200px 600px at 50% -10%, rgba(64,120,200,0.12), transparent 60%), #0b0e14",
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },
  kicker: {
    margin: "0 0 8px",
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#7f93b8",
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.15,
    fontWeight: 700,
    color: "#f2f5fb",
    letterSpacing: "-0.01em",
  },
  date: {
    margin: "8px 0 0",
    fontSize: 14,
    color: "#8b9cbd",
  },
  copyButton: {
    appearance: "none",
    border: "1px solid rgba(120,160,220,0.35)",
    background: "rgba(70,120,200,0.16)",
    color: "#dbe6fb",
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background 140ms ease, border-color 140ms ease, color 140ms ease",
  },
  copyButtonDone: {
    background: "rgba(56,168,110,0.20)",
    borderColor: "rgba(90,200,140,0.5)",
    color: "#c7f2da",
  },
  copyButtonFail: {
    background: "rgba(200,90,90,0.18)",
    borderColor: "rgba(220,120,120,0.5)",
    color: "#f6d2d2",
  },
  rule: {
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(140,170,220,0.28), transparent)",
    margin: "28px 0 8px",
  },
  section: {
    marginTop: 28,
  },
  h2: {
    margin: "0 0 10px",
    fontSize: 18,
    fontWeight: 700,
    color: "#e8edf7",
  },
  lead: {
    margin: "0 0 12px",
    fontSize: 15,
    lineHeight: 1.6,
    color: "#aebbd6",
  },
  list: {
    margin: 0,
    paddingLeft: 20,
  },
  listItem: {
    margin: "0 0 8px",
    fontSize: 15,
    lineHeight: 1.6,
    color: "#cdd6ea",
  },
  footer: {
    marginTop: 44,
    paddingTop: 18,
    borderTop: "1px solid rgba(140,170,220,0.14)",
    fontSize: 13,
    color: "#6f80a3",
  },
};

export default App;
