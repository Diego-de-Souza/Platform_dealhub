import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BannerType } from 'app/core/interface/banner.interface';
import { Banner } from 'app/shared/storage/data/banner.data';


@Component({
  selector: 'dealhub-slider',
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent implements OnInit{
  currentSlide = 0;

  public banner: BannerType[] = Banner;

  ngOnInit(): void {
    setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.banner.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.banner.length) % this.banner.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
