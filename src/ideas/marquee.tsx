import { createRoot } from "react-dom/client";
import { COPYRIGHT, EMAIL, SERVICES } from "./content";
import "./brutal.css";

// Content is doubled so translating the track by -50% loops seamlessly.
const line = SERVICES.map((s) => `${s.toUpperCase()} ✦ `).join("");
const track = line.repeat(2);

function Marquee() {
  return (
    <div className="mq">
      <img className="mq-logo" src="/logo.svg" alt="Sololabs logo" />
      <div className="mq-band mq-band-a">
        <span className="mq-track">{track + track}</span>
      </div>
      <div className="mq-band mq-band-b">
        <span className="mq-track">{track + track}</span>
      </div>
      <h1 className="mq-corner mq-tl heavy">SOLOLABS</h1>
      <a className="mq-corner mq-tr" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      <small className="mq-corner mq-br">{COPYRIGHT}</small>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Marquee />);
