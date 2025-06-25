import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { departments } from 'app/shared/storage/data/departaments.data';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { InViewportDirective } from 'app/shared/directives/show-viewport.directive';
import { Department } from 'app/core/interface/department.interface';

@Component({
  selector: 'dealhub-departaments',
  standalone: true,
  imports: [CommonModule, InViewportDirective],
  templateUrl: './departaments.component.html',
  styleUrl: './departaments.component.scss',
  animations: [
    trigger('fadeInUp', [
      state(
        'out',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        })
      ),
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('out => in', animate('800ms ease-out')),
    ]),
  ],
})
export class DepartamentsComponent {
  public departments: Department[] = departments;
  public isVisible: { [key: number]: boolean } = {};

  setVisible(index: number, visible: boolean): void {
    this.isVisible[index] = visible;
  }
}