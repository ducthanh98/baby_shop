import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Socket} from "ngx-socket-io";

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `
    <div class="alert alert-danger" role="alert" *ngIf="newOrder">
      You have a new order — <a (click)="newOrder = false" [routerLink]="['order']">Check it out!</a>
      <span class="float-right" style="cursor: pointer" (click)="newOrder = false">x</span>
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  newOrder = false;

  constructor(private router: Router, private socket: Socket) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.socket.fromEvent('order').subscribe(() => {
      this.newOrder = true;
    });
  }
}
