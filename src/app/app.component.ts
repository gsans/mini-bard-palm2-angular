import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from "rxjs/operators";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { hideAnimation, leftAnimation, optionAnimation } from './hide.animation';

import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { RouterScrollService } from './router-scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [hideAnimation, leftAnimation, optionAnimation]
})
export class AppComponent implements AfterContentChecked, AfterViewInit {
  title: string = "";
  isExpanded: boolean = false;
  state = this.isExpanded ? 'opened' : 'closed';
  selection = {
    text: true,
    chat: false,
    visual: false,
    config: false,
    voice: false,
  }
  @ViewChild("mainContent")
  private mainContentElement!: ElementRef<HTMLElement>;

  toggleState() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'opened' : 'closed';
  }

  select(option:string) {
    this.selection.chat = option == "chat";
    this.selection.text = option == "text";
    this.selection.text = option == "visual";
    this.selection.text = option == "config";
  }

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
    private routerScrollService: RouterScrollService,
  ) {
    
    this.matIconRegistry.addSvgIcon( 
      `gemini`, 
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/gemini.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `angular`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/angular.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `sparkle`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/sparkle.svg")
    );
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe((data: any) => {
      if (data) {
        this.title = `Gemini for ${data}`;
        this.titleService.setTitle(this.title);
      }
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit() {
    if (this.mainContentElement) {
      this.routerScrollService.setCustomViewportToScroll(this.mainContentElement.nativeElement);
    }
  }
}

