"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hero centrepiece: a faceted core wrapped in orbiting rings and particles.
 * Everything is procedural — no textures, no network assets.
 */

function Core({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.LineSegments>(null);

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.35, 1)),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const targetX = reduced ? 0 : state.pointer.y * 0.35;
      const targetY = reduced ? 0 : state.pointer.x * 0.5;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX,
        0.05,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY + (reduced ? 0 : t * 0.12),
        0.05,
      );
    }
    if (inner.current && !reduced) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.06;
      inner.current.scale.setScalar(pulse);
      const mat = inner.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 1.6) * 0.5;
    }
    if (shell.current && !reduced) {
      shell.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* glowing heart */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.78, 2]} />
        <meshStandardMaterial
          color="#062b22"
          emissive="#4ef0c1"
          emissiveIntensity={1.6}
          roughness={0.25}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* faceted wireframe shell */}
      <lineSegments ref={shell} geometry={edges}>
        <lineBasicMaterial color="#4ef0c1" transparent opacity={0.42} />
      </lineSegments>

      {/* orbit rings */}
      <mesh rotation={[Math.PI / 2.3, 0.4, 0]}>
        <torusGeometry args={[2.1, 0.012, 8, 160]} />
        <meshBasicMaterial color="#4ef0c1" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -0.6, 0.4]}>
        <torusGeometry args={[2.55, 0.009, 8, 160]} />
        <meshBasicMaterial color="#8b7cff" transparent opacity={0.45} />
      </mesh>

      {/* satellites */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * 2.1,
              Math.sin(a * 1.7) * 0.55,
              Math.sin(a) * 2.1,
            ]}
            rotation={[a, a * 0.5, 0]}
          >
            <octahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial
              color={i % 2 ? "#8b7cff" : "#4ef0c1"}
              emissive={i % 2 ? "#8b7cff" : "#4ef0c1"}
              emissiveIntensity={1.1}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function HeroCore({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      aria-label="Rotating 3D developer core"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 3, 5]} intensity={70} color="#4ef0c1" />
        <pointLight position={[-5, -2, -3]} intensity={55} color="#8b7cff" />
        <directionalLight position={[0, 6, 4]} intensity={0.6} color="#ffffff" />

        <Core reduced={reduced} />

        <Float speed={reduced ? 0 : 1.4} rotationIntensity={0} floatIntensity={0.6}>
          <Sparkles
            count={reduced ? 40 : 90}
            scale={[9, 6, 6]}
            size={2}
            speed={reduced ? 0 : 0.35}
            opacity={0.55}
            color="#9dffe4"
          />
        </Float>
      </Suspense>
    </Canvas>
  );
}
