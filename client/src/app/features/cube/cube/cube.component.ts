import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-cube',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['./cube.component.scss'],
})
export class CubeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private orbitControls!: OrbitControls;

  private cubeGroup!: THREE.Group;

  ngAfterViewInit() {
    this.initTHREE();
    this.createCubes();
    this.animate();
  }

  private initTHREE() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableZoom = true; // Enable zoom
    this.orbitControls.zoomSpeed = 3;

    this.camera.position.z = 5;
  }

  private createCubes() {
    const largeCubeSize = 1; // Size of the larger cubes
    const smallCube1 = largeCubeSize / 3; // Size of the smaller cubes inside each larger cube
    const smallCube2 = smallCube1 / 3; // Size of the smaller cubes inside each small cube
    const smallCube3 = smallCube2 / 3; // Size of the smallest cubes
    const spacing = 1.1; // Spacing between the larger cubes
    this.cubeGroup = new THREE.Group();

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          // Create each larger cube
          const largeCube = new THREE.Mesh(
            new THREE.BoxGeometry(largeCubeSize, largeCubeSize, largeCubeSize),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
          );
          largeCube.position.set(
            x * spacing - spacing,
            y * spacing - spacing,
            z * spacing - spacing
          );
          this.cubeGroup.add(largeCube);

          // Create smaller cubes within each larger cube
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              for (let k = 0; k < 3; k++) {
                const smallCube = new THREE.Mesh(
                  new THREE.BoxGeometry(smallCube1, smallCube1, smallCube1),
                  new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true,
                  })
                );
                smallCube.position.set(
                  i * smallCube1 - largeCubeSize / 2 + smallCube1 / 2,
                  j * smallCube1 - largeCubeSize / 2 + smallCube1 / 2,
                  k * smallCube1 - largeCubeSize / 2 + smallCube1 / 2
                );
                largeCube.add(smallCube);

                // Create smallSmallCubes within each smallCube
                for (let a = 0; a < 3; a++) {
                  for (let b = 0; b < 3; b++) {
                    for (let c = 0; c < 3; c++) {
                      const smallSmallCube = new THREE.Mesh(
                        new THREE.BoxGeometry(
                          smallCube2,
                          smallCube2,
                          smallCube2
                        ),
                        new THREE.MeshBasicMaterial({
                          color: 0xffffff,
                          wireframe: true,
                        })
                      );
                      smallSmallCube.position.set(
                        a * smallCube2 - smallCube1 / 2 + smallCube2 / 2,
                        b * smallCube2 - smallCube1 / 2 + smallCube2 / 2,
                        c * smallCube2 - smallCube1 / 2 + smallCube2 / 2
                      );
                      smallCube.add(smallSmallCube);

                      // Create smallSmallSmallCubes within each smallSmallCube
                      for (let d = 0; d < 3; d++) {
                        for (let e = 0; e < 3; e++) {
                          for (let f = 0; f < 3; f++) {
                            const smallSmallSmallCube = new THREE.Mesh(
                              new THREE.BoxGeometry(
                                smallCube3,
                                smallCube3,
                                smallCube3
                              ),
                              new THREE.MeshBasicMaterial({
                                color: 0xffffff,
                                wireframe: true,
                              })
                            );
                            smallSmallSmallCube.position.set(
                              d * smallCube3 - smallCube2 / 2 + smallCube3 / 2,
                              e * smallCube3 - smallCube2 / 2 + smallCube3 / 2,
                              f * smallCube3 - smallCube2 / 2 + smallCube3 / 2
                            );
                            smallSmallCube.add(smallSmallSmallCube);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    this.scene.add(this.cubeGroup);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
