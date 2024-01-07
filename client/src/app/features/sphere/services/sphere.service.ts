import { ElementRef, Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { Options, Position } from 'src/app/interfaces/sphere.interface';

@Injectable()
export class SphereService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private galaxy!: THREE.Object3D;

  private strokes!: THREE.LineSegments;
  private dotStrokes!: THREE.Points;
  private dotsMaterial!: THREE.PointsMaterial;
  private strokesMaterial!: THREE.LineBasicMaterial;

  private positions: Position[] = [];
  private userData!: Options;

  private clock: THREE.Clock;

  constructor() {
    this.userData = this.createOptions();
    this.createPositions();
    this.clock = new THREE.Clock();
  }

  public initializeRenderer(canvas: ElementRef<HTMLCanvasElement>): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas.nativeElement,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.renderer.setClearColor(0x000000);
    this.initThree();
    this.createScene();
    this.animate();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 800, 2500);

    const ww = window.innerWidth;
    const wh = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
    this.camera.position.set(0, 100, 600);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.galaxy = new THREE.Object3D();
    this.scene.add(this.galaxy);

    const dotTexture = new THREE.TextureLoader().load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/dotTexture.png'
    );

    this.dotsMaterial = new THREE.PointsMaterial({
      size: this.userData.dotsSize,
      map: dotTexture,
      transparent: true,
      opacity: this.userData.dotsOpacity,
      alphaTest: 0.1,
    });

    this.strokesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.userData.strokesColor),
      transparent: true,
      opacity: this.userData.linesOpacity,
    });

    this.strokes = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      this.strokesMaterial
    );
    this.galaxy.add(this.strokes);

    this.dotStrokes = new THREE.Points(
      new THREE.BufferGeometry(),
      this.dotsMaterial
    );
    this.galaxy.add(this.dotStrokes);
  }

  private createScene(): void {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    this.renderer.setSize(ww, wh);
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.renderer.setClearColor(0x000000);

    this.camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
    this.camera.position.set(0, 100, 600);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 800, 2500);

    this.galaxy = new THREE.Object3D();
    this.scene.add(this.galaxy);

    const dotTexture = new THREE.TextureLoader().load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/dotTexture.png'
    );
    this.dotsMaterial = new THREE.PointsMaterial({
      size: this.userData.dotsSize,
      map: dotTexture,
      transparent: true,
      opacity: this.userData.dotsOpacity,
      alphaTest: 0.1,
    });
    this.strokesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.userData.strokesColor),
      transparent: true,
      opacity: this.userData.linesOpacity,
    });

    this.strokes = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      this.strokesMaterial
    );
    this.galaxy.add(this.strokes);
    this.dotStrokes = new THREE.Points(
      new THREE.BufferGeometry(),
      this.dotsMaterial
    );
    this.galaxy.add(this.dotStrokes);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.createStrokes();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    this.applyChaoticMovement(this.strokes.geometry, 0.4);
    this.applyChaoticMovement(this.dotStrokes.geometry, 0.8);

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private createOptions(): Options {
    return {
      radius: 200,
      connections: 3,
      distance: 30,
      linesOpacity: 0.3,
      height: 20,
      dots: true,
      amount: 3000,
      dotsSize: 6,
      dotsOpacity: 0.3,
      strokesColor: '#ffffff',
      dotsColor: '#ffffff',
      backgroundColor: '#000000',
    };
  }

  private createPositions() {
    for (let x = 0; x < 5000; x++) {
      const long = Math.acos(2 * Math.random() - 1);
      const pos = {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        lat: 2 * Math.PI * Math.random(),
        long: long,
        u: Math.cos(long),
        sqrt: Math.sqrt(1 - Math.pow(Math.cos(long), 2)),
      };
      this.positions.push(pos);
    }
  }

  private createStrokes(): void {
    const dotsGeometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < this.userData.amount; i++) {
      const pos = this.positions[i];
      const x =
        (pos.x * this.userData.height + this.userData.radius) *
        pos.sqrt *
        Math.cos(pos.lat);
      const y =
        (pos.y * this.userData.height + this.userData.radius) *
        pos.sqrt *
        Math.sin(pos.lat);
      const z = (pos.z * this.userData.height + this.userData.radius) * pos.u;
      vertices.push(x, y, z);
    }
    dotsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const segmentsGeometry = new THREE.BufferGeometry();
    const segmentsVertices = [];
    for (let i = 0; i < vertices.length; i += 3) {
      for (let j = 0; j < vertices.length; j += 3) {
        const dx = vertices[i] - vertices[j];
        const dy = vertices[i + 1] - vertices[j + 1];
        const dz = vertices[i + 2] - vertices[j + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < this.userData.distance) {
          segmentsVertices.push(vertices[i], vertices[i + 1], vertices[i + 2]);
          segmentsVertices.push(vertices[j], vertices[j + 1], vertices[j + 2]);
        }
      }
    }
    segmentsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(segmentsVertices, 3)
    );

    this.strokesMaterial.opacity = this.userData.linesOpacity;
    this.strokesMaterial.color = new THREE.Color(this.userData.strokesColor);
    this.strokes.geometry.dispose(); // Dispose old geometry
    this.strokes.geometry = segmentsGeometry;

    if (this.userData.dots) {
      this.dotsMaterial.size = this.userData.dotsSize;
      this.dotsMaterial.opacity = this.userData.dotsOpacity;
      this.dotsMaterial.color = new THREE.Color(this.userData.dotsColor);
      this.dotStrokes.geometry.dispose(); // Dispose old geometry
      this.dotStrokes.geometry = dotsGeometry;
    } else {
      this.dotsMaterial.opacity = 0;
    }

    this.renderer.setClearColor(new THREE.Color(this.userData.backgroundColor));
  }

  private applyChaoticMovement(
    geometry: THREE.BufferGeometry,
    magnitude: number
  ): void {
    const elapsedTime = this.clock.getElapsedTime();
    const positions = geometry.attributes['position'].array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(elapsedTime + i) * magnitude;
      positions[i + 1] += Math.cos(elapsedTime + i) * magnitude;
      positions[i + 2] += Math.sin(elapsedTime + i) * magnitude;
    }

    geometry.attributes['position'].needsUpdate = true;
  }
}
