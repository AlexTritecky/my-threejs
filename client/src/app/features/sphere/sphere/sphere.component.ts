import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { SphereService } from '../services/sphere.service';

@Component({
  selector: 'app-sphere',
  templateUrl: './sphere.component.html',
  styleUrls: ['./sphere.component.scss'],
})
export class SphereComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(private sphereService: SphereService) {}

  ngAfterViewInit() {
    this.sphereService.initializeRenderer(this.canvasRef);
  }
  ngOnDestroy() {
    // Add any necessary cleanup logic
  }
}
