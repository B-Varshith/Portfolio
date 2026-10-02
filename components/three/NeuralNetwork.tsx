"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Neural-network backdrop for the "Building with AI" section.
 * Nodes represent LLM · Agents · Tools · Memory · RAG · APIs · Data
 * (the labels live in the DOM beside the canvas so no font file is needed).
 */

interface NodeDef {
  pos: [number, number, number];
  size: number;
  color: THREE.Color;
  phase: number;
}

const MAIN = [
  { label: "LLM", pos: [0, 0, 0] as [number, number, number], color: "#4ef0c1" },
  { label: "AGENTS", pos: [-2.4, 1.15, 0.4] as [number, number, number], color: "#8b7cff" },
  { label: "TOOLS", pos: [2.5, 1.3, -0.3] as [number, number, number], color: "#56ccff" },
  { label: "MEMORY", pos: [-2.7, -1.25, -0.5] as [number, number, number], color: "#ffc24b" },
  { label: "RAG", pos: [2.4, -1.4, 0.5] as [number, number, number], color: "#ff6b81" },
  { label: "APIS", pos: [0.1, 2.4, -0.8] as [number, number, number], color: "#4ef0c1" },
  { label: "DATA", pos: [0.2, -2.5, 0.6] as [number, number, number], color: "#8b7cff" },
];

function deterministic(i: number) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function Network({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);

  const satellites = useMemo<NodeDef[]>(() => {
    const out: NodeDef[] = [];
    for (let i = 0; i < 22; i++) {
      const a = deterministic(i) * Math.PI * 2;
      const r = 2.6 + deterministic(i + 50) * 1.9;
      out.push({
        pos: [
          Math.cos(a) * r,
          (deterministic(i + 90) - 0.5) * 5.2,
          Math.sin(a) * r * 0.7,
        ],
        size: 0.045 + deterministic(i + 130) * 0.05,
        color: new THREE.Color("#ffffff"),
        phase: deterministic(i + 7) * Math.PI * 2,
      });
    }
    return out;
  }, []);

  const nodes = useMemo(
    () =>
      MAIN.map((m, i) => ({
        pos: m.pos,
        size: 0.16,
        color: new THREE.Color(m.color),
        phase: i * 0.7,
      })),
    [],
  );

  const all = useMemo(() => [...nodes, ...satellites], [nodes, satellites]);

  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const push = (a: NodeDef, b: NodeDef) => {
      pos.push(...a.pos, ...b.pos);
      col.push(a.color.r, a.color.g, a.color.b, b.color.r, b.color.g, b.color.b);
    };
    // main ↔ hub connections
    for (let i = 1; i < nodes.length; i++) push(nodes[0], nodes[i]);
    for (let i = 1; i < nodes.length - 1; i++) push(nodes[i], nodes[i + 1]);
    // satellites hang off the nearest main node
    satellites.forEach((s, i) => push(s, nodes[i % nodes.length]));
    return { positions: new Float32Array(pos), colors: new Float32Array(col) };
  }, [nodes, satellites]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const tx = reduced ? 0 : state.pointer.y * 0.32;
      const ty = reduced ? 0 : state.pointer.x * 0.45;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, tx, 0.04);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, ty, 0.04);
    }
    if (reduced) return;
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const def = all[i];
      const pulse = 1 + Math.sin(t * 1.7 + def.phase) * 0.18;
      mesh.scale.setScalar(pulse);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.1 + Math.sin(t * 1.7 + def.phase) * 0.7;
    });
  });

  return (
    <group ref={group}>
      {all.map((n, i) => (
        <mesh
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          position={n.pos}
        >
          <sphereGeometry args={[n.size, 16, 16]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={1.2}
            roughness={0.4}
          />
        </mesh>
      ))}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.32} />
      </lineSegments>
    </group>
  );
}

export default function NeuralNetwork({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7.2], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      aria-label="Animated neural network visualization"
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 6]} intensity={45} color="#ffffff" />
      <pointLight position={[-6, 3, -2]} intensity={40} color="#8b7cff" />
      <Network reduced={reduced} />
    </Canvas>
  );
}
