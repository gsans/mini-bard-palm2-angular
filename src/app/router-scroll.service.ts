import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { Subscription } from "rxjs";

@Injectable()
export class RouterScrollService {

  private routerSubscription: Subscription | null;
  private scrollPositions: { [route: string]: any } = {};
  private customViewport: HTMLElement | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly viewportScroller: ViewportScroller  
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (!this.customViewport) return; // skip if not present

      if (event instanceof NavigationStart) {
        // Save scroll position for current route. Eg: { path: 'chat', data: { scroll: true } }
        if (this.activatedRoute.firstChild?.routeConfig?.data?.['scroll']) {
          this.scrollPositions[this.router.url] = this.viewportScroller.getScrollPosition();
        }
      } else if (event instanceof NavigationEnd) {
        // Restore scroll position if available
        const scrollPosition = this.scrollPositions[event.url];
        if (scrollPosition) {
          setTimeout(() => { // run during next tick
            this.viewportScroller.scrollToPosition(scrollPosition);
          }, 0);
        }
      }
    });
  }

  setCustomViewportToScroll(viewport: HTMLElement): void {
    this.customViewport = viewport;
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}