import { createRoot } from "react-dom/client";
import { COPYRIGHT, EMAIL, SERVICES } from "./content";
import "./brutal.css";

const num = (n: number) => String(n).padStart(2, "0");

function Grid() {
  return (
    <div className="grid">
      <div className="cell">
        <span className="cell-num">{num(1)}</span>
        <img src="/logo.svg" alt="Sololabs logo" width={88} height={88} />
      </div>
      <div className="cell cell-wide">
        <span className="cell-num">{num(2)}</span>
        <h1 className="heavy" style={{ fontSize: "clamp(48px, 12vw, 180px)" }}>
          SOLOLABS
        </h1>
      </div>
      {SERVICES.map((s, i) => (
        <div key={s} className="cell cell-big">
          <span className="cell-num">{num(i + 3)}</span>
          {s}
        </div>
      ))}
      <a href={`mailto:${EMAIL}`} className="cell cell-half cell-big">
        <span className="cell-num">{num(8)}</span>
        {EMAIL}
      </a>
      <div className="cell cell-full-sm">
        <span className="cell-num">{num(9)}</span>
        {COPYRIGHT}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Grid />);
