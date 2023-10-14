import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { Subscription } from "rxjs";

@Injectable()
export class RouterScrollService {

  private routerSubscription: Subscription | null;
  private scrollTopArray: { [route: string]: any } = {};
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
          const viewportSelector = this.activatedRoute.firstChild?.routeConfig?.data?.['viewportSelector'];
          if (viewportSelector) {
            document.querySelectorAll(viewportSelector).forEach(elem => {
              this.scrollTopArray[this.router.url] = elem.scrollTop;
            })
          }
        }
      } else if (event instanceof NavigationEnd) {
        const viewportSelector = this.activatedRoute.firstChild?.routeConfig?.data?.['viewportSelector'];
        if (viewportSelector) {
          // Restore scroll position if available
          const scrollTop = this.scrollTopArray[event.url];
          if (scrollTop) {
            setTimeout(() => { // run during next tick
              document.querySelectorAll(viewportSelector).forEach(elem => {
                elem.scrollTop = scrollTop;
              })
            });
          }
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