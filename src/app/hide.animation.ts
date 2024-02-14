import { style, animate, animation, animateChild, useAnimation, group, sequence, transition, state, trigger, query as q, stagger } from '@angular/animations';
const query = (s: any, a: any, o = { optional: true }) => q(s, a, o);


export const hideAnimation =
  trigger('hideAnimation', [
    state('opened', style({ width: '250px' })),
    state('closed', style({ width: '80px' })),
    transition('* <=> *', [
      group([
        query('@option', animateChild()),
        animate('400ms cubic-bezier(.35,.04,.18,1.33)'),
      ])
    ]),
  ]);

export const leftAnimation =
  trigger('leftAnimation', [
    state('opened', style({ marginLeft: '250px' })),
    state('closed', style({ marginLeft: '80px' })),
    transition('* <=> *', [
      animate('400ms cubic-bezier(.35,.04,.18,1.33)')
    ])
  ]);


export const optionAnimation =
  trigger('option', [
    state('opened', style({ opacity: 1, width: '150px' })),
    state('closed', style({ opacity: 0, width: '0px' })),
    transition('* <=> *', [
      animate('400ms cubic-bezier(.35,.04,.18,1.33)')
    ])
  ]);