import { Component, OnInit, Input } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html'
  
})
export class CarouselComponent implements OnInit {

  imgags: string[];
  public _fcontent:any[] = [];
  public fcJson: any;

  constructor() { }

  @Input() description:any;
  @Input() image:any;
  @Input() link:any;

  public carouselTileOneItems: Array<any> = [];
  public carouselTileOne: NgxCarousel;


  ngOnInit() {

  // console.log('from carousal TS');
  //   console.log(this.description);
  //   console.log(this.image);
  //   console.log(this.link);

    this.carouselTileOne = {
      grid: { xs: 2, sm: 3, md: 4, lg: 5, all: 0 },
      speed: 600,
      slide:1,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            background: #6b6b6b;
            padding: 5px;
            margin: 0 3px;
            transition: .4s;
          }
          .ngxcarouselPoint li.active {
              border: 2px solid rgba(0, 0, 0, 0.55);
              transform: scale(1.2);
              background: transparent;
            }
        `
      },
      load: 2,
      loop: false,
      touch: true,
      easing: 'ease'
      
    };

    
      
  }



}
