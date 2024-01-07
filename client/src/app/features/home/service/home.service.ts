import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable()
export class HomeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  private clock = new THREE.Clock();

  private textureLoader = new THREE.TextureLoader();
  private galaxyGeometry!: THREE.BufferGeometry;
  private galaxyMaterial!: THREE.PointsMaterial;
  private galaxyPoints!: THREE.Points;
  private galaxyParameters = {
    count: 70000,
    size: 0.01,
    radius: 5,
    branches: 8,
    spin: 1,
    randomness: 0.3,
    randomnessPower: 5,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
  };

  private bgStarsGeometry!: THREE.BufferGeometry;
  private bgStarsMaterial!: THREE.PointsMaterial;
  private bgStars!: THREE.Points;
  private starParameters = {
    stars: 9000,
    size: 0.01,
    starColor: '#1b3984',
  };
  private shapeTexture!: THREE.Texture;

  constructor() {
    this.shapeTexture = this.textureLoader.load('/assets/images/particles.png');
  }

  public initializeRenderer(canvas: ElementRef<HTMLCanvasElement>): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas.nativeElement,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000);
    this.initScene();
    this.addGalaxy();
    this.addBackgroundStars();
    this.animate();
  }

  public disposeResources(): void {
    // Dispose geometries, materials, textures, etc.
    this.galaxyGeometry.dispose();
    this.galaxyMaterial.dispose();
    this.bgStarsGeometry.dispose();
    this.bgStarsMaterial.dispose();

    // Dispose textures if there are any
    // e.g., this.shapeTexture.dispose();

    // Remove objects from scene
    this.scene.remove(this.galaxyPoints);
    this.scene.remove(this.bgStars);

    // Optionally reset the renderer's DOM element
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(3, 3, 3);
    this.scene.add(this.camera);

    // this.renderer = new THREE.WebGLRenderer({
    //   canvas: this.canvasRef.nativeElement,
    // });
    console.log(11, window.innerWidth, window.innerHeight);

    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  public addGalaxy(): void {
    if (this.galaxyPoints !== undefined) {
      this.galaxyGeometry.dispose();
      this.galaxyMaterial.dispose();
      this.scene.remove(this.galaxyPoints);
    }

    this.galaxyGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.galaxyParameters.count * 3);
    const colors = new Float32Array(this.galaxyParameters.count * 3);

    const colorInside = new THREE.Color(this.galaxyParameters.insideColor);
    const colorOutside = new THREE.Color(this.galaxyParameters.outsideColor);

    for (let i = 0; i < this.galaxyParameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * this.galaxyParameters.radius;
      const branchAngle =
        ((i % this.galaxyParameters.branches) /
          this.galaxyParameters.branches) *
        Math.PI *
        2;
      const spinAngle = radius * this.galaxyParameters.spin;

      const randomX =
        Math.pow(Math.random(), this.galaxyParameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), this.galaxyParameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), this.galaxyParameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / this.galaxyParameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    this.galaxyGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    this.galaxyGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    this.galaxyMaterial = new THREE.PointsMaterial({
      size: this.galaxyParameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      alphaMap: this.textureLoader.load('/assets/images/particles.png'),
    });

    this.galaxyPoints = new THREE.Points(
      this.galaxyGeometry,
      this.galaxyMaterial
    );
    this.scene.add(this.galaxyPoints);
  }

  public addBackgroundStars(): void {
    if (this.bgStars !== undefined) {
      this.bgStarsGeometry.dispose();
      this.bgStarsMaterial.dispose();
      this.scene.remove(this.bgStars);
    }

    this.bgStarsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.starParameters.stars * 3);

    for (let i = 0; i < this.starParameters.stars; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }

    this.bgStarsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    this.bgStarsMaterial = new THREE.PointsMaterial({
      size: this.starParameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(this.starParameters.starColor),
      transparent: true,
      alphaMap: this.shapeTexture,
    });

    this.bgStars = new THREE.Points(this.bgStarsGeometry, this.bgStarsMaterial);
    this.scene.add(this.bgStars);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Update the galaxy and background stars
    if (this.galaxyPoints) {
      this.galaxyPoints.rotation.y = elapsedTime * 0.3;
    }
    if (this.bgStars) {
      this.bgStars.rotation.y = -elapsedTime * 0.05;
    }

    // Update controls if necessary
    if (this.controls) {
      this.controls.update();
    }

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}
