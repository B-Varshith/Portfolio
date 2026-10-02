"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export interface OrbitCard {
  id: string;
  name: string;
  category: string;
  repo: string;
  url: string;
  accent: string;
}

const ACCENTS: Record<string, string> = {
  mint: "#4ef0c1",
  violet: "#8b7cff",
  amber: "#ffc24b",
  sky: "#56ccff",
  rose: "#ff6b81",
};

function makeTexture(card: OrbitCard) {
  const accent = ACCENTS[card.accent] ?? "#4ef0c1";
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 400;
  const ctx = c.getContext("2d")!;

  // panel
  ctx.fillStyle = "#0a0c0f";
  ctx.fillRect(0, 0, c.width, c.height);

  // subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= c.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, c.height);
    ctx.stroke();
  }
  for (let y = 0; y <= c.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(c.width, y);
    ctx.stroke();
  }

  // accent bar + border
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, c.width, 8);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, c.width - 12, c.height - 12);
  ctx.globalAlpha = 1;

  // category
  ctx.fillStyle = accent;
  ctx.font = "600 26px monospace";
  ctx.fillText(card.category.toUpperCase(), 44, 84);

  // title (wrap onto two lines)
  ctx.fillStyle = "#e9ecf1";
  ctx.font = "700 54px sans-serif";
  const words = card.name.split(" ");
  let line = "";
  let y = 176;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > 550 && line) {
      ctx.fillText(line, 44, y);
      y += 62;
      line = w;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, 44, y);

  // repo path
  ctx.fillStyle = "#6b7280";
  ctx.font = "300 26px monospace";
  ctx.fillText(`github.com/${card.repo}`, 44, c.height - 54);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Cards({
  cards,
  reduced,
  onOpen,
}: {
  cards: OrbitCard[];
  reduced: boolean;
  onOpen: (url: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const refs = useRef<Array<THREE.Mesh | null>>([]);

  const textures = useMemo(() => cards.map((c) => makeTexture(c)), [cards]);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  const radius = 4.1;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * 0.16;
    const t = state.clock.elapsedTime;

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const target = hovered === i ? 1.09 : 1;
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, target, 0.12));
      // billboard: keep the panel square to the camera while it orbits
      mesh.rotation.y = -g.rotation.y;
      if (!reduced) mesh.position.y = Math.sin(t * 0.7 + i) * 0.16;
    });
  });

  const handleClick = (i: number) => onOpen(cards[i].url);

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#07251e"
          emissive="#4ef0c1"
          emissiveIntensity={1.3}
          wireframe
          flatShading
        />
      </mesh>

      {cards.map((card, i) => {
        const a = (i / cards.length) * Math.PI * 2;
        return (
          <mesh
            key={card.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            rotation={[0, -a, 0]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHovered(i);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = "";
            }}
            onClick={() => handleClick(i)}
          >
            <planeGeometry args={[2.5, 1.56]} />
            <meshBasicMaterial map={textures[i]} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ProjectOrbit({
  cards,
  reduced = false,
}: {
  cards: OrbitCard[];
  reduced?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 1.4, 8.2], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label="Orbiting 3D project showcase"
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 4, 5]} intensity={60} color="#4ef0c1" />
      <pointLight position={[-6, -3, -4]} intensity={45} color="#8b7cff" />
      <Cards
        cards={cards}
        reduced={reduced}
        onOpen={(url) => window.open(url, "_blank", "noopener")}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        autoRotate={!reduced}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.75}
      />
    </Canvas>
  );
}
