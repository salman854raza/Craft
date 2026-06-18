import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// A low-poly architectural massing model rendered as a blueprint wireframe.
// Slowly auto-rotates and tilts toward the cursor for a subtle 3D parallax feel.
export default function BlueprintBuilding({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(5.5, 4.2, 7.5);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const lineColor = new THREE.Color("#8FB7DE");
    const accentColor = new THREE.Color("#C99A63");

    // Stacked massing blocks — a stepped tower, like an architect's study model
    const blocks = [
      { w: 3.2, h: 0.5, d: 3.2, y: 0.25 },
      { w: 2.6, h: 1.8, d: 2.6, y: 1.05 },
      { w: 2.0, h: 1.6, d: 2.0, y: 2.2 },
      { w: 1.3, h: 1.9, d: 1.3, y: 3.4 },
    ];

    blocks.forEach((b, i) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color: i === blocks.length - 1 ? accentColor : lineColor,
        transparent: true,
        opacity: 0.85,
      });
      const lines = new THREE.LineSegments(edges, mat);
      lines.position.y = b.y;
      group.add(lines);
    });

    // Ground grid plane (drafting baseplate)
    const grid = new THREE.GridHelper(8, 16, 0x5b8dbf, 0x5b8dbf);
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
    grid.position.y = 0;
    scene.add(grid);

    // Faint vertical "construction lines" radiating up from the base
    const linePts = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(angle) * 1.8;
      const z = Math.sin(angle) * 1.8;
      linePts.push(new THREE.Vector3(x, 0, z), new THREE.Vector3(x, 4.6, z));
    }
    const constructionGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const constructionMat = new THREE.LineDashedMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.25,
      dashSize: 0.12,
      gapSize: 0.12,
    });
    const constructionLines = new THREE.LineSegments(constructionGeo, constructionMat);
    constructionLines.computeLineDistances();
    group.add(constructionLines);

    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = nx * 0.5;
      targetX = ny * -0.2;
    };
    window.addEventListener("pointermove", onPointerMove);

    let frameId;
    let t = 0;
    const animate = () => {
      t += 0.0035;
      group.rotation.y += (targetY + 0.18 - group.rotation.y) * 0.04 + 0.0015;
      group.rotation.x += (targetX - group.rotation.x) * 0.04;
      group.position.y = Math.sin(t * 1.3) * 0.08;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
