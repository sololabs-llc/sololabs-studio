import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Matter from "matter-js";
import { COPYRIGHT, EMAIL, SERVICES } from "./content";
import "./brutal.css";

const { Engine, Runner, Bodies, Body, Composite, Constraint, Events, Query } = Matter;

type BandId = "a" | "b";
// Angles match the rotations of .mq-band-a and .mq-band-b.
const BANDS: { id: BandId; angle: number }[] = [
  { id: "a", angle: -6 },
  { id: "b", angle: 4 },
];

// Content is doubled so translating the track by -50% loops seamlessly.
const track = SERVICES.map((s) => `${s.toUpperCase()} ✦ `).join("").repeat(4);
const emailTrack = `${EMAIL.toUpperCase()} ✦ `.repeat(8);

const HINTS = [
  "Psst — click the tape",
  "Now grab a word and throw it",
  "OK, enough. Say hey ↓",
];

const WALL = 1000;

type Word = { el: HTMLElement; body: Matter.Body; w: number; h: number };

function Marquee2() {
  const [dropped, setDropped] = useState<BandId[]>([]);
  const layer = useRef<HTMLDivElement>(null);
  const engine = useRef(Engine.create());
  const words = useRef<Word[]>([]);

  useEffect(() => {
    const world = engine.current.world;
    let walls: Matter.Body[] = [];
    const placeWalls = () => {
      const w = innerWidth;
      const h = innerHeight;
      Composite.remove(world, walls);
      walls = [
        Bodies.rectangle(w / 2, h + WALL / 2, w + 2 * WALL, WALL, { isStatic: true }),
        Bodies.rectangle(-WALL / 2, 0, WALL, h * 20, { isStatic: true }),
        Bodies.rectangle(w + WALL / 2, 0, WALL, h * 20, { isStatic: true }),
      ];
      Composite.add(world, walls);
    };
    placeWalls();
    window.addEventListener("resize", placeWalls);

    Events.on(engine.current, "afterUpdate", () => {
      for (const { el, body, w, h } of words.current) {
        el.style.transform = `translate(${body.position.x - w / 2}px, ${
          body.position.y - h / 2
        }px) rotate(${body.angle}rad)`;
      }
    });
    Runner.run(Runner.create(), engine.current);
  }, []);

  // Drag by pinning the word to the pointer with a spring; releasing keeps its momentum.
  const grab = (e: PointerEvent, el: HTMLElement, body: Matter.Body) => {
    const world = engine.current.world;
    el.setPointerCapture(e.pointerId);
    const pin = Constraint.create({
      pointA: { x: e.clientX, y: e.clientY },
      bodyB: body,
      pointB: { x: e.clientX - body.position.x, y: e.clientY - body.position.y },
      stiffness: 0.2,
      length: 0,
    });
    Composite.add(world, pin);
    const move = (ev: PointerEvent) => {
      pin.pointA = { x: ev.clientX, y: ev.clientY };
    };
    const release = () => {
      Composite.remove(world, pin);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  };

  const drop = (id: BandId, angle: number, band: HTMLElement) => {
    const rect = band.getBoundingClientRect();
    const y = rect.top + rect.height / 2;
    const world = engine.current.world;
    SERVICES.forEach((text) => {
      const el = document.createElement("span");
      el.className = `mq-word mq-word-${id}`;
      el.textContent = text.toUpperCase();
      layer.current!.append(el);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const body = Bodies.rectangle(
        w / 2 + Math.random() * Math.max(0, innerWidth - w),
        y,
        w,
        h,
        { angle: (angle * Math.PI) / 180, restitution: 0.3, friction: 0.5 },
      );
      // Spawning on top of another word makes the solver fling both apart, so move up into free space.
      while (Query.region(Composite.allBodies(world), body.bounds).length) {
        Body.translate(body, { x: 0, y: -h });
      }
      Composite.add(world, body);
      words.current.push({ el, body, w, h });
      el.addEventListener("pointerdown", (e) => grab(e, el, body));
    });
    setDropped((d) => [...d, id]);
  };

  const reset = () => {
    for (const { el, body } of words.current) {
      el.remove();
      Composite.remove(engine.current.world, body);
    }
    words.current = [];
    setDropped([]);
  };

  return (
    <div className="mq">
      <img className="mq-logo" src="/logo.svg" alt="Sololabs logo" />
      {BANDS.map(({ id, angle }) => (
        <button
          key={id}
          className={`mq-band mq-band-${id} mq-drop`}
          style={{ visibility: dropped.includes(id) ? "hidden" : undefined }}
          onClick={(e) => drop(id, angle, e.currentTarget)}
          aria-label="Drop the words"
        >
          <span className="mq-track">{track + track}</span>
        </button>
      ))}
      <a className="mq-band mq-band-email" href={`mailto:${EMAIL}`}>
        <span className="mq-track">{emailTrack + emailTrack}</span>
      </a>
      <p className="mq-bubble">{HINTS[dropped.length]}</p>
      <div ref={layer} className="mq-words" />
      <h1 className="mq-corner mq-tl heavy">SOLOLABS</h1>
      <a className="mq-corner mq-tr" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      {dropped.length > 0 && (
        <button className="mq-corner mq-bl mq-reset" onClick={reset}>
          ↺ Reset
        </button>
      )}
      <small className="mq-corner mq-br">{COPYRIGHT}</small>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Marquee2 />);
