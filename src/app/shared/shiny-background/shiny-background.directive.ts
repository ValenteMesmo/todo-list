import { Directive, HostBinding, Input } from "@angular/core";

@Directive({
  selector: '[shiny-background]',
  host: {
    '[-webkit-transition]': '"background-color 1000ms linear"',
    '[-ms-transition]': '"background-color 1000ms linear"',
    '[transition]': '"background-color 1000ms linear"'
  }
})
export class ShinyBackgroundDirective {
  @HostBinding('style.background-color')
  backgroundColor: string;
  @HostBinding('style.-webkit-transition')
  _webkit_transition: string = "background-color 300ms linear";
  @HostBinding('style.-ms-transition')
  _ms_transition: string = "background-color 300ms linear";
  @HostBinding('style.transition')
  transition: string = "background-color 300ms linear";

  private static count: number = 0;
  @Input('shiny-background') set shinyColor(color: string) {
    
    if (color) {
      this.shine(color);
    }
  }

  shine(color) {
    const original = this.backgroundColor;
    setTimeout(() => {
      this.backgroundColor = color;
      setTimeout(() => {
        this.backgroundColor = original;
        ShinyBackgroundDirective.count--;
      }, 300);
    }, ShinyBackgroundDirective.count++ * 10);    
  }
}
