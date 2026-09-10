import { Breadcrumb } from "../components";

interface AboutProps {
  onNavigate: (view: "landing" | "form" | "history" | "view" | "about") => void;
}

export function About({ onNavigate }: AboutProps) {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      <Breadcrumb
        items={[
          { label: "Start", onClick: () => onNavigate("landing") },
          { label: "Prototyp" },
        ]}
      />

      <h1
        style={{
          fontSize: "2rem",
          margin: "0 0 1.5rem 0",
          color: "#333",
        }}
      >
        Über diesen Prototyp
      </h1>

      <div
        style={{
          lineHeight: "1.8",
          color: "#555",
        }}
      >
        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Prototyp: Zielvereinbarung SCP
          </h2>
          <p>
            Dieses Projekt ist ein vorläufiger Prototyp zur Verwaltung von
            Zielvereinbarungen im SCP-Programm. Folgende Anforderung soll das
            Tool erfüllen:
          </p>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>Zielvereinbarungsformular</li>
            <li>Modulare Tabelle</li>
            <li>Bearbeiten gespeicherter Zielvereinbarungen</li>
            <li>Exportfunktionen (PDF/Word)</li>
          </ul>
        </section>

        <section>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Kontakt
          </h2>

          <p>
            <strong>Ansprechpartner:</strong>{" "}
            <a
              href="mailto:edgar.treischl@isb.bayern.de"
              style={{
                color: "#1E8AD9",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Dr. Edgar Treischl
            </a>
          </p>

          <p>
            Alle weiteren Kontaktdetails finden Sie auf der QA Website:{" "}
            <a
              href="https://www.isb.bayern.de/schulqualitaet/qualitaetssicherung/bildungsberichterstattung/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1E8AD9",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              www.isb.bayern.de/schulqualitaet
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
