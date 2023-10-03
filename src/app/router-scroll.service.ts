import { ActivatedRoute, NavigationEnd, NavigationStart, Router, Route } from "@angular/router";
import { Injectable, OnDestroy } from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { filter, observeOn, scan } from "rxjs/operators";
import { asyncScheduler, Subscription, Observable } from "rxjs";


export interface RouterScrollService {
  /**
   * Provide the DOM element corresponding to the main viewport.
   * That viewport is the one that will be scrolled
   */
  setCustomViewportToScroll(viewport: HTMLElement): void;

  /**
   * Disable scrolling the default viewport
   */
  disableScrollDefaultViewport(): void;

  /**
   * Enable scrolling the default viewport (enabled by default)
   */
  enableScrollDefaultViewPort(): void;

  /**
   * Add a strategy that applies before navigation for a partial route
   * @param partialRoute the partial route to match
   * @param behaviour the desired behavior
   */
  addStrategyOnceBeforeNavigationForPartialRoute(partialRoute: string, behaviour: RouteScrollBehaviour): void;

  /**
   * Add a strategy for a partial route
   * @param partialRoute the partial route to match
   * @param behaviour the desired behavior
   */
  addStrategyForPartialRoute(partialRoute: string, behaviour: RouteScrollBehaviour): void;

  /**
   * Remove a strategy for a partial route
   * @param partialRoute the partial route to remove strategies for
   */
  removeStrategyForPartialRoute(partialRoute: string): void;
}

/**
 * Scroll position restore
 */
export interface ScrollPositionRestore {
  /**
   * Which event to match
   */
  event: NavigationStart | NavigationEnd;
  /**
   * Used to keep track of the known positions.
   * The key is the id of the entry (according to the route ids)
   * The value is the scroll position. Any is used because there are different representations
   */
  positions: Record<string, any>;
  /**
   * Trigger to react to
   * Imperative: e.g., user clicked on a link
   * Popstate: e.g., browser back button
   * Hashchange: e.g., change in the URL fragment
   */
  trigger: "imperative" | "popstate" | "hashchange" | undefined;
  /**
   * Id to restore
   */
  idToRestore: number;
  /**
   * The route's data (if any defined)
   */
  routeData?: CustomRouteData;
}

/**
 * Defines a strategy to handle route scrolling.
 */
export interface RouteScrollStrategy {
  /**
   * Partial route path
   */
  partialRoute: string;
  /**
   * Associated behavior
   */
  behaviour: RouteScrollBehaviour;
  /**
   * Whether it should be applied before navigation (default is after)
   */
  onceBeforeNavigation?: boolean;
}

/**
 * Defines the possible route scroll behaviors
 */
export enum RouteScrollBehaviour {
  KEEP_POSITION = "KEEP_POSITION",
  GO_TO_TOP = "GO_TO_TOP",
}

/**
 * Include our scroll behavior in the supported route data
 */
export interface CustomRouteData {
  /**
   * Scroll behavior when navigating to this route
   */
  scrollBehavior?: RouteScrollBehaviour;
}

/**
 * Extends the default type of Angular to be more prescriptive
 */
export interface CustomRoute extends Route {
  data?: CustomRouteData;
}

/**
 * Define a set of routes for the router.
 * Usually one instance defined per module in the app.
 */
export type CustomRoutes = CustomRoute[];

const componentName = "RouterScrollService";

const defaultViewportKey = `defaultViewport`;
const customViewportKey = `customViewport`;

@Injectable()
export class RouterScrollServiceImpl implements RouterScrollService, OnDestroy {
  private readonly scrollPositionRestorationSubscription: Subscription | null;

  /**
   * Queue of strategies to add
   */
  private addQueue: RouteScrollStrategy[] = [];
  /**
   * Queue of strategies to add for onBeforeNavigation
   */
  private addBeforeNavigationQueue: RouteScrollStrategy[] = [];
  /**
   * Queue of strategies to remove
   */
  private removeQueue: string[] = [];
  /**
   * Registered strategies
   */
  private routeStrategies: RouteScrollStrategy[] = [];
  /**
   * Whether the default viewport should be scrolled if/when needed
   */
  private scrollDefaultViewport = true;
  /**
   * Custom viewport to scroll if/when needed
   */
  private customViewportToScroll: HTMLElement | null = null;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly viewportScroller: ViewportScroller,
  ) {

    const scrollPositionRestore$: Observable<ScrollPositionRestore> = this.router.events.pipe(
      filter((event: any) => event instanceof NavigationStart || event instanceof NavigationEnd),
      // Accumulate the scroll positions
      scan<ScrollPositionRestore, ScrollPositionRestore>((acc, event) => {
        const positions: Record<string, any> = {
          ...acc.positions, // Keep the previously known positions
        };

        if (event instanceof NavigationStart && this.scrollDefaultViewport) {
          positions[`${event.id}-${defaultViewportKey}`] = this.viewportScroller.getScrollPosition();
        }

        if (event instanceof NavigationStart && this.customViewportToScroll) {
          positions[`${event.id}-${customViewportKey}`] = this.customViewportToScroll.scrollTop;
        }

        const retVal: ScrollPositionRestore = {
          event: event.event || event,
          positions,
          trigger: event instanceof NavigationStart ? event.navigationTrigger : acc.trigger,
          idToRestore:
            (event instanceof NavigationStart && event.restoredState && event.restoredState.navigationId + 1) ||
            acc.idToRestore,
          routeData: this.activatedRoute.firstChild?.routeConfig?.data,
        };

        return retVal;
      }),
      filter((scrollPositionRestore: ScrollPositionRestore) => !!scrollPositionRestore.trigger),
      observeOn(asyncScheduler),
    );

    this.scrollPositionRestorationSubscription = scrollPositionRestore$.subscribe(
      (scrollPositionRestore: ScrollPositionRestore) => {
        const existingStrategy = this.routeStrategies.find(
          (strategy) => scrollPositionRestore.event.url.indexOf(strategy.partialRoute) > -1,
        );

        const existingStrategyWithKeepScrollPositionBehavior =
          (existingStrategy && existingStrategy.behaviour === RouteScrollBehaviour.KEEP_POSITION) || false;
        const routeDataWithKeepScrollPositionBehavior =
          (scrollPositionRestore.routeData &&
            scrollPositionRestore.routeData.scrollBehavior &&
            scrollPositionRestore.routeData.scrollBehavior === RouteScrollBehaviour.KEEP_POSITION) ||
          false;

        const shouldKeepScrollPosition =
          existingStrategyWithKeepScrollPositionBehavior || routeDataWithKeepScrollPositionBehavior;

        if (scrollPositionRestore.event instanceof NavigationEnd) {
          this.processRemoveQueue(this.removeQueue);

          // Was this an imperative navigation? This helps determine if we're moving forward through a routerLink, a back button click, etc
          // Reference: https://www.bennadel.com/blog/3533-using-router-events-to-detect-back-and-forward-browser-navigation-in-angular-7-0-4.htm
          const imperativeTrigger =
            (scrollPositionRestore.trigger && "imperative" === scrollPositionRestore.trigger) || false;

          // Should scroll to the top if
          // no strategy or strategy with behavior different than keep position
          // OR no route data or route data with behavior different than keep position
          // OR imperative
          // Reference: https://medium.com/javascript-everyday/angular-imperative-navigation-fbab18a25d8b

          // Decide whether we should scroll back to top or not
          const shouldScrollToTop = !shouldKeepScrollPosition; // || imperativeTrigger;

          if (shouldScrollToTop) {
            if (this.scrollDefaultViewport) {
              this.viewportScroller.scrollToPosition([0, 0]);
            }
            if (this.customViewportToScroll) {
              this.customViewportToScroll.scrollTop = 0;
            }
          } else {
            if (this.scrollDefaultViewport) {
              this.viewportScroller.scrollToPosition(
                scrollPositionRestore.positions[`${scrollPositionRestore.event.id - 1}-${defaultViewportKey}`], //changed from original
              );
            }

            if (this.customViewportToScroll) {
              this.customViewportToScroll.scrollTop =
                scrollPositionRestore.positions[`${scrollPositionRestore.event.id - 1}-${customViewportKey}`];  //changed from original
            }
          }

          this.processRemoveQueue(
            this.addBeforeNavigationQueue.map((strategy) => strategy.partialRoute),
            true,
          );
          this.processAddQueue(this.addQueue);
          this.addQueue = [];
          this.removeQueue = [];
          this.addBeforeNavigationQueue = [];
        } else {
          this.processAddQueue(this.addBeforeNavigationQueue);
        }
      },
    );
  }

  addStrategyOnceBeforeNavigationForPartialRoute(partialRoute: string, behaviour: RouteScrollBehaviour): void {
    this.addBeforeNavigationQueue.push({
      partialRoute: partialRoute,
      behaviour: behaviour,
      onceBeforeNavigation: true,
    });
  }

  addStrategyForPartialRoute(partialRoute: string, behaviour: RouteScrollBehaviour): void {
    this.addQueue.push({ partialRoute: partialRoute, behaviour: behaviour });
  }

  removeStrategyForPartialRoute(partialRoute: string): void {
    this.removeQueue.push(partialRoute);
  }

  setCustomViewportToScroll(viewport: HTMLElement): void {
    this.customViewportToScroll = viewport;
  }

  disableScrollDefaultViewport(): void {
    this.scrollDefaultViewport = false;
  }

  enableScrollDefaultViewPort(): void {
    this.scrollDefaultViewport = true;
  }

  processAddQueue(queue: any) {
    for (const partialRouteToAdd of queue) {
      const pos = this.routeStrategyPosition(partialRouteToAdd.partialRoute);
      if (pos === -1) {
        this.routeStrategies.push(partialRouteToAdd);
      }
    }
  }

  processRemoveQueue(queue: any, removeOnceBeforeNavigation = false) {
    for (const partialRouteToRemove of queue) {
      const pos = this.routeStrategyPosition(partialRouteToRemove);
      if (!removeOnceBeforeNavigation && pos > -1 && this.routeStrategies[pos].onceBeforeNavigation) {
        continue;
      }
      if (pos > -1) {
        this.routeStrategies.splice(pos, 1);
      }
    }
  }

  routeStrategyPosition(partialRoute: string) {
    return this.routeStrategies.map((strategy) => strategy.partialRoute).indexOf(partialRoute);
  }

  ngOnDestroy(): void {
    if (this.scrollPositionRestorationSubscription) {
      this.scrollPositionRestorationSubscription.unsubscribe();
    }
  }
}