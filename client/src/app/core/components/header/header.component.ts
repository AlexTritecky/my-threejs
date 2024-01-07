import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.createParticles();
  }

  createParticles(): void {
    const particleCount = 200;
    const particlesContainer =
      this.elRef.nativeElement.querySelector('.bottom-particles');

    for (let i = 0; i < particleCount; i++) {
      const bubble = this.renderer.createElement('div');
      this.renderer.addClass(bubble, 'bubble');

      const leftPosition = Math.random() * 100;
      const delay = Math.random() * 12000;
      const duration = Math.random() * (15000 - 5000) + 5000;

      this.renderer.setStyle(bubble, 'left', `${leftPosition}%`);
      this.renderer.setStyle(bubble, 'animation-delay', `${delay}ms`);
      this.renderer.setStyle(bubble, 'animation-duration', `${duration}ms`);

      this.renderer.appendChild(particlesContainer, bubble);
    }
  }
}
