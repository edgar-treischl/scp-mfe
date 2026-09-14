import { Breadcrumb } from "../components";

interface DataProps {
  onNavigate: (view: "landing" | "form" | "history" | "view" | "about" | "data") => void;
}

export function Data({ onNavigate }: DataProps) {
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
          { label: "Datenschutz" },
        ]}
      />

      <h1
        style={{
          fontSize: "2rem",
          margin: "0 0 1.5rem 0",
          color: "#333",
        }}
      >
        Datenschutzerklärung
      </h1>

      <div
        style={{
          lineHeight: "1.8",
          color: "#555",
        }}
      >
        <p>
          Mit Ihrer Teilnahme am Startchancen-Programm willigen Sie in die
          Verarbeitung von Daten ein.
        </p>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Welche Daten?
          </h2>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>
              Angaben aus den Ziel- und Handlungsvereinbarungen (ZHV),
              einschließlich Teilziele, Maßnahmen, Evaluationsdaten und
              Bilanzierungsergebnisse
            </li>
            <li>
              Schulbezogene Informationen (z. B. Schulnummer, Schulart,
              Zuständige Schulaufsicht)
            </li>
            <li>Angaben zur Umsetzung und zum Ressourcenbedarf</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Wer verwendet die Daten?
          </h2>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>
              Die Schule selbst: zur Dokumentation, Steuerung und Evaluation
              der eigenen Schulentwicklung
            </li>
            <li>
              Die zuständige Schulaufsicht: zur Beratung, Begleitung und
              Qualitätssicherung der Schulen im Startchancen-Programm
            </li>
            <li>
              Das Bayerische Staatsministerium für Unterricht und Kultus
              (StMUK): zur Programmsteuerung, Monitoring und Berichterstattung
              auf Landesebene
            </li>
            <li>
              Ggf. beauftragte wissenschaftliche Einrichtungen: zur Evaluation
              des Startchancen-Programms (nur anonymisiert/aggregiert)
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Wofür werden die Daten verwendet?
          </h2>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>
              Begleitung und Beratung der Schulen durch die Schulaufsicht
            </li>
            <li>
              Programmmonitoring und Erfolgsmessung auf Landes- und
              Bundesebene
            </li>
            <li>Wissenschaftliche Evaluation des Startchancen-Programms</li>
            <li>
              Erstellung von Berichten und Statistiken (nur
              anonymisiert/aggregiert)
            </li>
            <li>
              Ggf. Vernetzung von Schulen mit ähnlichen Zielen und Maßnahmen
              (nur auf Basis Ihrer ausdrücklichen Zustimmung)
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Rechtsgrundlage
          </h2>
          <p>
            Art. 6 Abs. 1 UAbs. 1 Buchst. a DSGVO (Einwilligung) sowie Art. 6
            Abs. 1 UAbs. 1 Buchst. e DSGVO (Erfüllung einer öffentlichen
            Aufgabe) i. V. m. den landesspezifischen
            Datenschutzbestimmungen.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Speicherdauer
          </h2>
          <p>
            Die Daten werden für die Dauer des Startchancen-Programms
            (voraussichtlich bis 2034) sowie ggf. für die Dauer gesetzlicher
            Aufbewahrungsfristen gespeichert.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Ihre Rechte
          </h2>
          <p>
            Sie können Ihre Einwilligung jederzeit widerrufen. Der Widerruf
            gilt ab dem Zeitpunkt der Geltendmachung. Berechtigte
            Verarbeitungen vor dem Widerruf bleiben hiervon unberührt.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              color: "#333",
            }}
          >
            Grundsätze zur Datennutzung
          </h2>

          <h3
            style={{
              fontSize: "1.1rem",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#444",
            }}
          >
            Klare Trennung der Datenebenen
          </h3>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>Schulinterne Daten (für die eigene Entwicklung)</li>
            <li>Daten für die Schulaufsicht (zur Begleitung)</li>
            <li>
              Aggregierte Daten für Ministerium und Wissenschaft (anonymisiert)
            </li>
          </ul>

          <h3
            style={{
              fontSize: "1.1rem",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#444",
            }}
          >
            Freiwilligkeit der Vernetzung
          </h3>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>
              Die Option zur Vernetzung mit anderen Schulen ist explizit
              freiwillig.
            </li>
            <li>
              Schulen dürfen selbst entscheiden, ob sie für andere sichtbar
              sein möchten.
            </li>
          </ul>

          <h3
            style={{
              fontSize: "1.1rem",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#444",
            }}
          >
            Transparente Kommunikation
          </h3>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>
              Regelmäßige Rückmeldung an Schulen, wie ihre Daten genutzt werden.
            </li>
            <li>
              Beispiele für konkrete Nutzen (z. B. „Auf Basis Ihrer Daten
              konnten wir X verbessern").
            </li>
          </ul>

          <h3
            style={{
              fontSize: "1.1rem",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#444",
            }}
          >
            Datensparsamkeit
          </h3>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>
              Nur Daten erheben, die tatsächlich für das Programm-Monitoring
              und die Evaluation benötigt werden.
            </li>
            <li>
              Keine personenbezogenen Daten von Schülerinnen und Schülern oder
              einzelnen Lehrkräften.
            </li>
          </ul>

          <h3
            style={{
              fontSize: "1.1rem",
              marginTop: "1rem",
              marginBottom: "0.5rem",
              color: "#444",
            }}
          >
            Unterstützung der Schulen
          </h3>
          <ul style={{ marginLeft: "1.5rem" }}>
            <li>Schulungen und Hilfestellungen zur Dateneingabe anbieten.</li>
            <li>
              Aufzeigen, wie Schulen ihre eigenen Daten für die Schulentwicklung
              nutzen können.
            </li>
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
