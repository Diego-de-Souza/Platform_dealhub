import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[appInViewport]',
  standalone: true,
})
export class InViewportDirective implements AfterViewInit, OnDestroy {
  @Output() visible = new EventEmitter<boolean>();

  private observer!: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        this.visible.emit(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}