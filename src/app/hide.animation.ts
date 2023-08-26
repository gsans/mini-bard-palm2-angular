import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const hideAnimation =
  trigger('hideAnimation', [
    state('opened', style({ width: '250px' })),
    state('closed', style({ width: '80px' })),
    transition('* <=> *', [
      animate('400ms cubic-bezier(.35,.04,.18,1.33)')
    ])
  ]);

export const leftAnimation =
  trigger('leftAnimation', [
    state('opened', style({ marginLeft: '250px' })),
    state('closed', style({ marginLeft: '80px' })),
    transition('* <=> *', [
      animate('400ms cubic-bezier(.35,.04,.18,1.33)')
    ])
  ]);