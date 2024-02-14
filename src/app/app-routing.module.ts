import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { CustomChatComponent } from './custom-chat/custom-chat.component';
import { TextComponent } from './text/text.component';
import { ReadComponent } from './read/read.component';
import { VisualComponent } from './visual/visual.component';
import { CustomRouteReuseStrategy } from './reuse-strategy.routing';

const routes: Routes = [
  { path: 'chat', component: CustomChatComponent, data: { title: 'Chat', scroll: true, viewportSelector: '.messages' } },
  { path: 'text', component: TextComponent, data: { title: 'Text' } },
  { path: 'voice', component: ReadComponent, data: { title: 'Voice' } },
  { path: 'visual', component: VisualComponent, data: { title: 'Images' } },
  { path: '', redirectTo: '/chat', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  },]
})
export class AppRoutingModule { }
