import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Computes visible indices for either:
 * - "spread" mode: step 0 = cover [null, 0], step k = [2k-1, 2k], final = back cover [lastPage, null]
 * - "single" mode: step i = single page i
 */
export function getStepView(step, totalPages, singlePageMode) {
  if (totalPages <= 0) {
    return { leftIdx: null, rightIdx: null, label: "EMPTY" };
  }

  if (singlePageMode) {
    const clamped = Math.max(0, Math.min(step, totalPages - 1));
    return {
      leftIdx: null,
      rightIdx: clamped,
      label:
        clamped === 0
          ? `FRONT COVER // P.1`
          : clamped === totalPages - 1
            ? `BACK COVER // P.${totalPages}`
            : `PAGE ${clamped + 1} OF ${totalPages}`,
    };
  }

  const interiorSpreads = Math.ceil((totalPages - 1) / 2);
  const maxStep = interiorSpreads + (totalPages % 2 === 0 ? 1 : 0);
  const clamped = Math.max(0, Math.min(step, maxStep));

  if (clamped === 0) {
    return {
      leftIdx: null,
      rightIdx: 0,
      label: "FRONT COVER // P.1",
    };
  }

  const leftIdx = clamped * 2 - 1;
  const rightIdx = clamped * 2 < totalPages ? clamped * 2 : null;

  if (rightIdx === null && leftIdx === totalPages - 1) {
    return {
      leftIdx,
      rightIdx: null,
      label: `BACK COVER // P.${totalPages}`,
    };
  }

  return {
    leftIdx: leftIdx < totalPages ? leftIdx : null,
    rightIdx,
    label:
      rightIdx !== null
        ? `SPREAD ${String(clamped).padStart(2, "0")} // P.${leftIdx + 1}–${
            rightIdx + 1
          }`
        : `PAGE ${leftIdx + 1} OF ${totalPages}`,
  };
}

export function getMaxStep(totalPages, singlePageMode) {
  if (totalPages <= 0) return 0;
  if (singlePageMode) return totalPages - 1;
  const interiorSpreads = Math.ceil((totalPages - 1) / 2);
  return interiorSpreads + (totalPages % 2 === 0 ? 1 : 0);
}

/**
 * Single-sided paper material with low gleam so ink and photos stay rich and natural.
 */
function usePaperMaterial(texture, fallbackColor = "#14151a", roughness = 0.72) {
  const mat = useMemo(() => {
    if (!texture) {
      return new THREE.MeshStandardMaterial({
        color: fallbackColor,
        roughness: 0.85,
        metalness: 0.0,
        side: THREE.FrontSide,
      });
    }
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness,
      metalness: 0.0,
      side: THREE.FrontSide,
    });
  }, [texture, fallbackColor, roughness]);

  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

export default function ZineBook3D({
  pages,
  currentStep,
  singlePageMode,
  mouse,
}) {
  const rootRef = useRef();
  const pivotRef = useRef();

  const [flipAnim, setFlipAnim] = useState(null);
  const prevStepRef = useRef(currentStep);

  const aspect = pages[0]?.aspectRatio || 1 / 1.414;
  const pageHeight = 2.85;
  const pageWidth = pageHeight * aspect;

  const frontCoverTex = pages[0]?.texture || null;
  const backCoverTex =
    pages.length > 1 ? pages[pages.length - 1]?.texture || null : frontCoverTex;

  useEffect(() => {
    const prevStep = prevStepRef.current;
    if (prevStep === currentStep || pages.length === 0) {
      prevStepRef.current = currentStep;
      return;
    }

    const dir = currentStep > prevStep ? "next" : "prev";
    const fromView = getStepView(prevStep, pages.length, singlePageMode);
    const toView = getStepView(currentStep, pages.length, singlePageMode);

    let frontTex = null;
    let backTex = null;

    if (singlePageMode) {
      frontTex =
        dir === "next"
          ? pages[fromView.rightIdx]?.texture || null
          : pages[toView.rightIdx]?.texture || null;
      backTex =
        dir === "next"
          ? pages[toView.rightIdx]?.texture || null
          : pages[fromView.rightIdx]?.texture || null;
    } else if (dir === "next") {
      frontTex =
        fromView.rightIdx !== null ? pages[fromView.rightIdx]?.texture : null;
      backTex = toView.leftIdx !== null ? pages[toView.leftIdx]?.texture : null;
    } else {
      frontTex =
        toView.rightIdx !== null ? pages[toView.rightIdx]?.texture : null;
      backTex =
        fromView.leftIdx !== null ? pages[fromView.leftIdx]?.texture : null;
    }

    if (frontTex || backTex) {
      setFlipAnim({
        dir,
        progress: dir === "next" ? 0 : 1,
        frontTex,
        backTex,
      });
    }

    prevStepRef.current = currentStep;
  }, [currentStep, pages, singlePageMode]);

  const view = useMemo(
    () => getStepView(currentStep, pages.length, singlePageMode),
    [currentStep, pages.length, singlePageMode],
  );

  const leftInnerTex =
    view.leftIdx !== null ? pages[view.leftIdx]?.texture : null;
  const rightInnerTex =
    view.rightIdx !== null ? pages[view.rightIdx]?.texture : null;

  const leftInnerMat = usePaperMaterial(leftInnerTex, "#14151a", 0.74);
  const rightInnerMat = usePaperMaterial(rightInnerTex, "#14151a", 0.74);

  const rearLeftCoverMat = usePaperMaterial(frontCoverTex, "#18191f", 0.68);
  const rearRightCoverMat = usePaperMaterial(backCoverTex, "#18191f", 0.68);
  const singleBackMat = usePaperMaterial(backCoverTex, "#18191f", 0.68);

  const flipFrontMat = usePaperMaterial(flipAnim?.frontTex, "#14151a", 0.74);
  const flipBackMat = usePaperMaterial(flipAnim?.backTex, "#14151a", 0.74);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    if (rootRef.current) {
      // Center single cover in the stage box when on step 0 in spread mode;
      // otherwise keep centered at x = 0 inside the stage container.
      const coverOffset =
        !singlePageMode && currentStep === 0 ? -(pageWidth * 0.5 + 0.01) : 0;

      const targetX = coverOffset;
      const targetY = Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
      const targetRotY = (mouse?.current?.x || 0) * 0.18;
      const targetRotX = -(mouse?.current?.y || 0) * 0.12;

      rootRef.current.position.x = THREE.MathUtils.lerp(
        rootRef.current.position.x,
        targetX,
        dt * 6,
      );
      rootRef.current.position.y = THREE.MathUtils.lerp(
        rootRef.current.position.y,
        targetY,
        dt * 5,
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        targetRotY,
        dt * 4,
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        targetRotX,
        dt * 4,
      );
    }

    if (flipAnim && pivotRef.current) {
      const speed = 3.6;
      let nextProgress = flipAnim.progress;

      if (flipAnim.dir === "next") {
        nextProgress = Math.min(1, flipAnim.progress + dt * speed);
      } else {
        nextProgress = Math.max(0, flipAnim.progress - dt * speed);
      }

      const eased =
        nextProgress < 0.5
          ? 4 * nextProgress * nextProgress * nextProgress
          : 1 - Math.pow(-2 * nextProgress + 2, 3) / 2;

      pivotRef.current.rotation.y = -eased * Math.PI;
      pivotRef.current.position.z = Math.sin(eased * Math.PI) * 0.16;

      const done =
        (flipAnim.dir === "next" && nextProgress >= 1) ||
        (flipAnim.dir === "prev" && nextProgress <= 0);

      if (done) {
        setFlipAnim(null);
      } else {
        setFlipAnim((prev) =>
          prev ? { ...prev, progress: nextProgress } : null,
        );
      }
    }
  });

  const showLeftPage = !singlePageMode && leftInnerTex !== null;
  const showRightPage = rightInnerTex !== null;
  const showSpine = !singlePageMode && (showLeftPage || showRightPage);

  return (
    <group ref={rootRef}>
      {showSpine && (
        <mesh position={[0, 0, -0.008]}>
          <boxGeometry args={[0.02, pageHeight * 0.996, 0.022]} />
          <meshStandardMaterial color="#1d1e26" roughness={0.9} metalness={0} />
        </mesh>
      )}

      {showLeftPage && (
        <group position={[-pageWidth / 2 - 0.01, 0, 0]} rotation={[0, 0.03, 0]}>
          <mesh position={[0, 0, 0.002]} material={leftInnerMat}>
            <planeGeometry args={[pageWidth, pageHeight, 12, 12]} />
          </mesh>
          <mesh
            position={[0, 0, -0.002]}
            rotation={[0, Math.PI, 0]}
            material={rearLeftCoverMat}
          >
            <planeGeometry args={[pageWidth, pageHeight, 12, 12]} />
          </mesh>
        </group>
      )}

      {showRightPage && (
        <group
          position={[singlePageMode ? 0 : pageWidth / 2 + 0.01, 0, 0]}
          rotation={[0, singlePageMode ? 0 : -0.03, 0]}
        >
          <mesh position={[0, 0, 0.002]} material={rightInnerMat}>
            <planeGeometry args={[pageWidth, pageHeight, 12, 12]} />
          </mesh>
          <mesh
            position={[0, 0, -0.002]}
            rotation={[0, Math.PI, 0]}
            material={singlePageMode ? singleBackMat : rearRightCoverMat}
          >
            <planeGeometry args={[pageWidth, pageHeight, 12, 12]} />
          </mesh>
        </group>
      )}

      {flipAnim && !singlePageMode && (
        <group ref={pivotRef} position={[0.01, 0, 0.012]}>
          <mesh position={[pageWidth / 2, 0, 0.001]} material={flipFrontMat}>
            <planeGeometry args={[pageWidth, pageHeight, 12, 12]} />
          </mesh>
          <mesh
            position={[pageWidth / 2, 0, -0.001]}
            rotation={[0, Math.PI, 0]}
            material={flipBackMat}
          >
            <planeGeometry args={[pageWidth, pageHeight, 12, 12]} />
          </mesh>
        </group>
      )}
    </group>
  );
}