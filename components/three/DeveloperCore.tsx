"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * The developer core: a locked node that gains rings, satellites and light as
 * challenges are completed (0% → 100%).
 */

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function Core({ progress, reduced }: { progress: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const shells = useRef<THREE.LineSegments>(null);

  const p = clamp01(progress / 100);

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.5, 1)),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += reduced ? 0 : delta * (0.12 + p * 0.5);
      group.current.rotation.x = reduced
        ? 0.2
        : THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.3, 0.05);
    }
    if (heart.current) {
      const mat = heart.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + p * 2.1 + (reduced ? 0 : Math.sin(t * 2.2) * 0.25 * (0.3 + p));
      const s = 0.7 + p * 0.35;
      heart.current.scale.setScalar(reduced ? s : s + Math.sin(t * 1.8) * 0.03 * p);
    }
    rings.current.forEach((mesh, i) => {
      if (!mesh) return;
      const threshold = (i + 1) / 5;
      const local = clamp01((p - threshold + 0.18) / 0.22);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = local * 0.8;
      if (!reduced) {
        mesh.rotation.z += delta * (0.2 + i * 0.14) * (i % 2 ? -1 : 1);
        mesh.rotation.x += delta * 0.05 * (i % 2 ? 1 : -1);
      }
    });
    if (shells.current) {
      const mat = shells.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.14 + p * 0.55;
      if (!reduced) shells.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={heart}>
        <icosahedronGeometry args={[0.85, 3]} />
        <meshStandardMaterial
          color={p > 0.5 ? "#0a3a2d" : "#0a1218"}
          emissive={p > 0.66 ? "#4ef0c1" : p > 0.33 ? "#56ccff" : "#8b7cff"}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.2}
          flatShading
        />
      </mesh>

      <lineSegments ref={shells} geometry={edges}>
        <lineBasicMaterial color="#4ef0c1" transparent opacity={0.2} />
      </lineSegments>

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
          rotation={[Math.PI / (2 + i * 0.45), i * 0.5, i * 0.3]}
        >
          <torusGeometry args={[1.7 + i * 0.28, 0.01, 6, 140]} />
          <meshBasicMaterial color={i % 2 ? "#8b7cff" : "#4ef0c1"} transparent opacity={0} />
        </mesh>
      ))}

      {/* satellites appear from 25% */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const shown = p > (i + 1) / 7;
        if (!shown) return null;
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.6, Math.sin(a * 1.4) * 0.9, Math.sin(a) * 2.6]}>
            <boxGeometry args={[0.13, 0.13, 0.13]} />
            <meshStandardMaterial
              color="#4ef0c1"
              emissive="#4ef0c1"
              emissiveIntensity={1.4}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      <Sparkles
        count={reduced ? 30 : Math.round(30 + p * 90)}
        scale={[7, 5, 7]}
        size={2}
        speed={reduced ? 0 : 0.25 + p * 0.5}
        opacity={0.3 + p * 0.5}
        color="#9dffe4"
      />
    </group>
  );
}

export default function DeveloperCore({
  progress = 0,
  reduced = false,
}: {
  progress?: number;
  reduced?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.6], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      aria-label={`Developer core at ${progress} percent`}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={65} color="#4ef0c1" />
      <pointLight position={[-4, -3, -2]} intensity={40} color="#8b7cff" />
      <Core progress={progress} reduced={reduced} />
    </Canvas>
  );
}
