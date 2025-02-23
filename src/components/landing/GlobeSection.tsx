
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Languages, Sparkles } from "lucide-react";
import twemoji from "twemoji";

const languages = [
  { name: "English", lat: 37.0902, lon: -95.7129, emoji: "🇺🇸" },
  { name: "Spanish", lat: 40.4168, lon: 3.7038, emoji: "🇪🇸" },
  { name: "Chinese", lat: 35.8617, lon: 104.1954, emoji: "🇨🇳" },
  { name: "Swedish", lat: 59.3293, lon: 18.0686, emoji: "🇸🇪" },
  { name: "Russian", lat: 61.524, lon: 105.3188, emoji: "🇷🇺" },
  { name: "Finnish", lat: 60.9241, lon: 28.7482, emoji: "🇫🇮" },
  { name: "French", lat: 43.2276, lon: 10.21, emoji: "🇫🇷" },
  { name: "German", lat: 48.1657, lon: 16.4515, emoji: "🇩🇪" },
  { name: "Dutch", lat: 46.1326, lon: 6.2913, emoji: "🇳🇱" },
  { name: "Japanese", lat: 38.2048, lon: 145.2529, emoji: "🇯🇵" },
];

const loadTwemoji = async (emoji: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 128;
    canvas.height = 128;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      twemoji
        .parse(emoji, {
          base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
        })
        .match(/src="([^"]+)"/)?.[1] || "";

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 128, 128);
      resolve(canvas.toDataURL());
    };
  });
};

const Pin = ({
  position,
  flagEmoji,
}: {
  position: THREE.Vector3;
  flagEmoji: string;
}) => {
  const pinHeadRef = useRef<THREE.Group>(null);
  const pinHeight = 0.2;
  const pinHeadSize = 0.1;
  const [emojiTexture, setEmojiTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loadEmoji = async () => {
      const emojiDataUrl = await loadTwemoji(flagEmoji);
      const texture = new THREE.TextureLoader().load(emojiDataUrl);
      setEmojiTexture(texture);
    };
    loadEmoji();
  }, [flagEmoji]);

  useFrame(({ camera }) => {
    if (pinHeadRef.current) {
      pinHeadRef.current.lookAt(camera.position);
    }
  });

  return (
    <group position={position}>
      <group ref={pinHeadRef} position={[0, pinHeight / 2, 0]}>
        <lineSegments position={[0, 0, 0.001]}>
          <edgesGeometry
            args={[new THREE.BoxGeometry(pinHeadSize, pinHeadSize, 0.01)]}
          />
          <lineBasicMaterial color="#999999" linewidth={0.5} />
        </lineSegments>
        {emojiTexture && (
          <mesh position={[0, 0, 0.011]}>
            <planeGeometry args={[pinHeadSize * 0.8, pinHeadSize * 0.8]} />
            <meshBasicMaterial
              map={emojiTexture}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#E3492D"
          roughness={0.3}
          metalness={0}
          emissive="#E3492D"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const earthTexture = useTexture("/earth-texture.jpg");

  const globeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        globeTexture: { value: earthTexture },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D globeTexture;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec4 texColor = texture2D(globeTexture, vUv);
          vec3 color = texColor.rgb;
          
          float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 8.0);
          color += vec3(0.5, 0.5, 0.5) * edge * 0.3;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
    });
  }, [earthTexture]);

  const convertLatLonToVector = (lat: number, lon: number, radius: number) => {
    const latRad = ((lat - 23) * Math.PI) / 180;
    const lonRad = (-(lon - 15) * Math.PI) / 180;
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);
    return new THREE.Vector3(x, y, z);
  };

  useFrame((state) => {
    if (meshRef.current) {
      globeMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group rotation={[-0.09, -Math.PI * -0.95, 0]}>
      <mesh ref={meshRef} material={globeMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>

      {languages.map((lang) => {
        const position = convertLatLonToVector(lang.lat, lang.lon, 2.1);
        return (
          <Pin key={lang.name} position={position} flagEmoji={lang.emoji} />
        );
      })}
    </group>
  );
};

const GlobeSection = () => {
  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn Any Language in the{" "}
            <span className="text-gradient">World</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI supports learning any language, with specialized expertise in
            numerous world languages
          </p>
        </div>
        <div className="relative h-[600px] w-full rounded-xl overflow-hidden glass flex flex-col">
          <div className="absolute inset-0 lg:right-[320px] h-[300px] lg:h-auto">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              gl={{ antialias: true }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <directionalLight position={[-5, -5, -5]} intensity={1} />
                <Globe />
                <Stars
                  radius={100}
                  depth={50}
                  count={5000}
                  factor={4}
                  fade={true}
                />
                <OrbitControls
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 1.5}
                />
              </Suspense>
            </Canvas>
          </div>
          <div className="absolute lg:right-0 bottom-0 lg:top-0 w-full lg:w-[320px] p-6 py-14 space-y-4 bg-white/40 backdrop-blur-sm lg:border-l border-t lg:border-t-0 border-white/10 flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-gray-900">We Support:</h3>
            <ul className="space-y-4">
              {languages.map((language, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-1 rounded-full bg-primary/10">
                    <Languages className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-700">{language.name}</span>
                </li>
              ))}
              <li
                className="flex items-center gap-3 animate-in"
                style={{
                  animationDelay: `${languages.length * 100}ms`,
                }}
              >
                <div className="p-1 rounded-full bg-primary/10">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="text-primary font-bold">
                  And every other language
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobeSection;
