import * as THREE from "three";
import { useEffect, useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Physics,
  useSphere,
  usePlane,
} from "@react-three/cannon";
import { Environment, useTexture } from "@react-three/drei";
import { EffectComposer, N8AO, Bloom } from "@react-three/postprocessing";
import "./styles/TechStack.css";

const imageUrls = [
  "/images/python.png",
  "/images/r.png",
  "/images/cpp.png",
  "/images/pandas.png",
  "/images/numpy.png",
  "/images/scikitlearn.png",
  "/images/matplotlib.png", 
  "/images/excel.png",
  "/images/powerbi.png",
  "/images/jupyter.png",
  "/images/git.png",
  "/images/github.png",
  "/images/vscode.png",
  "/images/mysql.webp", 
  "/images/huggingface.png",
];

// Initial positions for a triangle rack (15 balls)
const getRackPositions = () => {
  const positions: [number, number, number][] = [];
  const spacing = 2.15; 
  const startY = 5; 
  let count = 0;
  
  // Create 5 rows for 15 balls
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j <= i; j++) {
      const x = (j - i / 2) * spacing;
      const z = 0;
      const y = startY - i * (spacing * 0.866); 
      if (count < 15) { 
          positions.push([x, y, z]);
          count++;
      }
    }
  }
  return positions;
};

const initialPositions = getRackPositions();

// Mouse/Pointer Component collision sphere
const Pointer = () => {
    const { viewport } = useThree();
    const [ref, api] = useSphere(() => ({ 
        args: [2], 
        position: [0, 0, 0], 
        type: "Kinematic", 
        isTrigger: false
    }));
    
    useFrame((state) => {
        const x = (state.mouse.x * viewport.width) / 2;
        const y = (state.mouse.y * viewport.height) / 2;
        api.position.set(x, y, 0); 
    });
    
    return (
        <mesh ref={ref as any} visible={false}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="red" wireframe />
        </mesh>
    );
};

// Ball Component
const Ball = ({
  position,
  texture,
}: {
  position: [number, number, number];
  texture: THREE.Texture;
}) => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [1],
    linearDamping: 0.5, 
    angularDamping: 0.5,
    material: { friction: 0.1, restitution: 0.8 },
  }));

  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const currentPos = useRef(new THREE.Vector3(...position));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => currentPos.current.set(v[0], v[1], v[2]));
    return unsubscribe;
  }, [api.position]);

  useFrame(() => {
     const dir = new THREE.Vector3().subVectors(initialPos, currentPos.current);
     const dist = dir.length();
     
     if (dist > 0.5) {
         const k = 1.5; 
         api.applyForce(
             [dir.x * k, dir.y * k, dir.z * k], 
             [0, 0, 0] 
         );
     }
     
     if (Math.abs(currentPos.current.z) > 0.5) {
          api.applyForce([0, 0, -currentPos.current.z * 5], [0, 0, 0]);
     }
  });

  return (
    <mesh 
        ref={ref as any} 
        castShadow 
        receiveShadow
        onPointerOver={() => {
            api.applyImpulse(
                [
                    (Math.random() - 0.5) * 5, 
                    (Math.random() - 0.5) * 5, 
                    Math.random() * 2 
                ], 
                [0, 0, 0]
            );
        }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.4}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
};

// Invisible Walls (Container)
const Walls = () => {
    const { viewport } = useThree();
    const width = viewport.width;
    const height = viewport.height;
    
  usePlane(() => ({ position: [0, -height/1.5, 0], rotation: [-Math.PI / 2, 0, 0] })); 
  usePlane(() => ({ position: [0, height/1.5, 0], rotation: [Math.PI / 2, 0, 0] })); 
  usePlane(() => ({ position: [-width/1.5, 0, 0], rotation: [0, Math.PI / 2, 0] })); 
  usePlane(() => ({ position: [width/1.5, 0, 0], rotation: [0, -Math.PI / 2, 0] })); 
  usePlane(() => ({ position: [0, 0, -2], rotation: [0, 0, 0] })); 
  usePlane(() => ({ position: [0, 0, 2], rotation: [0, -Math.PI, 0] })); 
  return null;
};

const SceneContent = () => {
    // Load textures inside Suspense boundary
    const textures = useTexture(imageUrls);

    // Map textures to balls cycling if needed
    const balls = useMemo(() => {
        return initialPositions.map((pos, i) => ({
            pos,
            texture: textures[i % textures.length]
        }));
    }, [textures]);

    return (
        <Physics gravity={[0, 0, 0]}>
            <Walls />
            <Pointer />
            {balls.map((b, i) => (
                <Ball 
                    key={i} 
                    position={b.pos} 
                    texture={b.texture} 
                />
            ))}
        </Physics>
    );
};

// Main Scene Component
const TechStack = () => {
  return (
    <div className="techstack">
       <h2>My Skills</h2>
       <Canvas
        className="tech-canvas"
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: true }}
        camera={{ position: [0, 0, 20], fov: 45, near: 1, far: 100 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <Suspense fallback={null}>
            <SceneContent />
        </Suspense>
        <Environment preset="city" />
        <EffectComposer enableNormalPass={false}>
            <N8AO aoRadius={0.5} intensity={1} />
            <Bloom luminanceThreshold={1} intensity={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
