import { useState } from "react";
import { createRoot } from "react-dom/client";
import { COPYRIGHT, DESCRIPTION, EMAIL } from "./content";
import { useFitText } from "./useFitText";
import "./brutal.css";

function Email() {
  const text = useFitText<HTMLSpanElement>();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="em">
      <div className="em-meta">
        <img src="/logo.svg" alt="Sololabs logo" width={32} height={32} />
        <a href={`mailto:${EMAIL}`}>Open mail app →</a>
      </div>
      <button className="em-btn heavy" onClick={copy} aria-label={`Copy ${EMAIL}`}>
        <span ref={text} className="fit">
          {EMAIL.toUpperCase()}
        </span>
        {copied && <span className="em-stamp">COPIED</span>}
      </button>
      <div className="em-meta">
        <p>{DESCRIPTION}</p>
        <small>{COPYRIGHT}</small>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Email />);
