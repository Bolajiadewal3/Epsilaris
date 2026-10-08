import React from "react";
import * as THREE from "three";

/**
 * Renders a configurable additive Fresnel rim around a sphere.
 * @param {Object} props Shader radius and Fresnel uniform values.
 * @param {number} [props.radius=1.53] Outer mesh scale.
 * @param {string} [props.color="#ffffff"] Rim color.
 * @param {number} [props.bias=-0.29] Fresnel intensity offset.
 * @param {number} [props.scale=1] Fresnel intensity multiplier.
 * @param {number} [props.power=2] Fresnel falloff exponent.
 * @param {number} [props.factor=1] Final opacity multiplier.
 * @returns {React.ReactElement}
 */
export default function FresnelRim({
  radius = 1.53,
  color = "#ffffff",
  bias = -0.29,
  scale = 1,
  power = 2,
  factor = 1,
}) {
  const material = React.useMemo(
    /** @returns {THREE.ShaderMaterial} Material rebuilt when a shader uniform changes. */
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          color: { value: new THREE.Color(color) },
          bias: { value: bias },
          scale: { value: scale },
          power: { value: power },
          factor: { value: factor },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewDir = normalize(-mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          uniform vec3 color;
          uniform float bias, scale, power, factor;
          void main() {
            float fresnel = clamp(bias + scale * pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), power), 0.0, 1.0);
            gl_FragColor = vec4(color, fresnel * factor);
          }
        `,
      }),
    [color, bias, scale, power, factor],
  );

  return (
    <mesh scale={[radius / 1.5, radius / 1.5, radius / 1.5]}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
