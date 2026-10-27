import { createRoot } from "react-dom/client";
import { COPYRIGHT, DESCRIPTION, EMAIL, SERVICES } from "./content";
import { useFitText } from "./useFitText";
import "./brutal.css";

function Wordmark() {
  const word = useFitText<HTMLHeadingElement>();
  return (
    <div className="wm">
      <div className="wm-top">
        <ul>
          {SERVICES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="wm-contact">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <small>{COPYRIGHT}</small>
        </div>
      </div>
      <p className="wm-desc">{DESCRIPTION}</p>
      <div className="wm-bottom">
        <h1 ref={word} className="heavy fit wm-word">
          SOLOLABS
        </h1>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Wordmark />);
