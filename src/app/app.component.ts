import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from "rxjs/operators";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { hideAnimation, leftAnimation } from './hide.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [hideAnimation, leftAnimation]
})
export class AppComponent {
  title: string = "";
  isExpanded: boolean = false;
  state = this.isExpanded ? 'opened' : 'closed';

  toggleState() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'opened' : 'closed';
  }

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    
    this.matIconRegistry.addSvgIcon( 
      `palm`, 
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/palm.svg")
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
        this.title = `Generative AI using Angular: ${data}`;
        this.titleService.setTitle(this.title);
      }
    });
  }
}

