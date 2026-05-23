import { useRef, useMemo, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, useTexture, Text, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Vignette, Noise as NoiseEffect } from "@react-three/postprocessing";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { useTheme } from "../context/ThemeContext";
import { stripImages } from "../data";

const noise2D = createNoise2D();

function DustParticles({ count = 200 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      ref.current.geometry.attributes.position.array[i3 + 1] += Math.sin(time * 0.1 + i) * 0.002;
      ref.current.geometry.attributes.position.array[i3] += Math.cos(time * 0.1 + i) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d4af37"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function FloatingFrame({ url, position, rotation, speed, scrollRef }) {
  const mesh = useRef();
  const texture = useTexture(url);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = scrollRef.current || 0;
    
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.3 + scrollY * 0.0008;
      mesh.current.rotation.y = rotation[1] + Math.cos(time * speed * 0.4) * 0.15 + scrollY * 0.0004;
      mesh.current.position.z = position[2] + Math.sin(time * 0.3) * 0.6;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} rotation={rotation}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={0.35} 
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.1}
          emissive="#d4af37"
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  );
}

function CameraModel({ scrollRef }) {
  const group = useRef();
  const { theme } = useTheme();
  const { mouse } = useThree();

  const isLightTheme = theme === "bone";

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = scrollRef.current || 0;
    
    if (group.current) {
      // Procedural "Handheld" motion
      const noiseX = noise2D(time * 0.2, 0) * 0.1;
      const noiseY = noise2D(0, time * 0.2) * 0.1;
      
      // Reactive rotation
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (mouse.x * 0.3) + time * 0.1 + scrollY * 0.001, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (mouse.y * -0.2) + noiseX, 0.1);
      group.current.position.y = Math.sin(time * 0.5) * 0.1 + noiseY;
      group.current.position.x = Math.cos(time * 0.4) * 0.05;
    }
  });

  return (
    <group ref={group} scale={1.4}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
        {/* Main Body - Magnesium Alloy look */}
        <mesh>
          <boxGeometry args={[1.2, 0.8, 0.5]} />
          <meshPhysicalMaterial 
            color={isLightTheme ? "#ffffff" : "#0a0a0a"} 
            roughness={0.15} 
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        {/* Lens Barrel */}
        <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.5, 64]} />
          <meshPhysicalMaterial 
            color={isLightTheme ? "#dddddd" : "#111111"} 
            roughness={0.05} 
            metalness={1}
            reflectivity={1}
          />
        </mesh>
        {/* Glass Element */}
        <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.05, 32]} />
          <meshPhysicalMaterial 
            color="#222" 
            transparent 
            opacity={0.8} 
            roughness={0} 
            transmission={0.9} 
            thickness={0.5}
          />
        </mesh>
        {/* Lens Ring (Gold Accent) */}
        <mesh position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.015, 16, 100]} />
          <meshStandardMaterial 
            color="#d4af37" 
            emissive="#d4af37" 
            emissiveIntensity={1} 
            metalness={1}
            roughness={0.1}
          />
        </mesh>
        {/* Viewfinder Detail */}
        <mesh position={[0.4, 0.45, 0]}>
          <boxGeometry args={[0.35, 0.25, 0.4]} />
          <meshPhysicalMaterial color="#050505" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Shutter Button */}
        <mesh position={[-0.4, 0.42, 0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function SceneContents() {
  const scrollRef = useRef(0);
  const { theme } = useTheme();
  const isLightTheme = theme === "bone";
  
  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const frameData = useMemo(() => {
    return stripImages.map((img, i) => ({
      url: img.src,
      position: [
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12 - 6,
      ],
      rotation: [0, (Math.random() - 0.5) * Math.PI * 0.5, 0],
      speed: 0.15 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      
      {/* Cinematic Lighting */}
      <ambientLight intensity={isLightTheme ? 0.8 : 0.4} />
      <pointLight position={[10, 10, 10]} intensity={isLightTheme ? 1.5 : 2.5} color="#d4af37" />
      <spotLight 
        position={[-10, 20, 10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={isLightTheme ? 1 : 2} 
        color={isLightTheme ? "#fff" : "#d4af37"}
      />
      
      <CameraModel scrollRef={scrollRef} />

      <Suspense fallback={null}>
        {frameData.map((data, i) => (
          <FloatingFrame key={i} {...data} scrollRef={scrollRef} />
        ))}
        <DustParticles count={isLightTheme ? 150 : 300} />
      </Suspense>

      <Environment preset="studio" />

      {/* Post-Processing for "Real" Feel */}
      <EffectComposer disableNormalPass>
        <DepthOfField 
          focusDistance={0} 
          focalLength={0.02} 
          bokehScale={isLightTheme ? 1 : 3} 
          height={480} 
        />
        <Bloom 
          intensity={isLightTheme ? 0.5 : 1.5} 
          luminanceThreshold={0.8} 
          luminanceSmoothing={0.9} 
          mipmapBlur 
        />
        <NoiseEffect opacity={isLightTheme ? 0.02 : 0.05} />
        <Vignette eskil={false} offset={0.1} darkness={isLightTheme ? 0.3 : 0.7} />
      </EffectComposer>
    </>
  );
}

export function GlobalScene() {
  const { theme } = useTheme();
  const isLightTheme = theme === "bone";

  return (
    <div 
      className={`fixed inset-0 z-0 pointer-events-none transition-all duration-1000 overflow-hidden ${
        isLightTheme ? 'opacity-40 bg-void' : 'opacity-60 bg-void'
      }`}
    >
      <Canvas dpr={[1, 2]} gl={{ antialias: false, stencil: false, depth: true }}>
        <SceneContents />
      </Canvas>
    </div>
  );
}

