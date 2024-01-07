import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private homeService: HomeService) {}

  ngAfterViewInit(): void {
    this.homeService.initializeRenderer(this.canvasRef);
  }

  ngOnDestroy(): void {
    this.homeService.disposeResources();
  }
}
