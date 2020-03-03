import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GalleryComponent } from './gallery.component';
import { SearchComponent } from './search.component';
import { FormsModule} from '@angular/forms';
// import { HttpModule,HttpClient} from '@angular/common/http';
import { FacetsComponent } from './facets.component';
import {MobileFacetsComponent} from './mobile-facets.component';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import {HttpClientModule} from '@angular/common/http';
import { CarouselComponent } from './carousel.component';
import { MaterialModule } from './material.module';
import { KeysPipe, DateFormatPipe, ObjectsLengthPipe, ContainsPipe, ObjectContainsPipe, 
	FacetContainsPipe, FacetAnimationPipe
	,TimeFrameContainsPipe, LocalePipe, ObjectFilterPipe, 
	LimitPipe, ShowingPipe, LabelPipe, EventsDatePipe, MobileFacetContainsPipe, 
	MediaIconPipe, LanguageSpokenPipe,FacetCheckedPipe } from "./pipes/index";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { CommonService } from './common.service';

@NgModule({
  declarations: [
    AppComponent,GalleryComponent,SearchComponent,FacetsComponent,MobileFacetsComponent,CarouselComponent,
    KeysPipe, 
		DateFormatPipe, 
		ObjectsLengthPipe, 
		ContainsPipe, 
		ObjectContainsPipe, 
		FacetContainsPipe,
		FacetAnimationPipe,
		TimeFrameContainsPipe,
		LocalePipe,
		ObjectFilterPipe,
		LimitPipe,
		ShowingPipe,
		LabelPipe,
		EventsDatePipe,
		MobileFacetContainsPipe,
		MediaIconPipe,
		LanguageSpokenPipe,
		FacetCheckedPipe
  ],
  imports: [
    BrowserModule,MaterialModule,FormsModule,BrowserAnimationsModule, NgxCarouselModule,
    HttpClientModule,InfiniteScrollModule,Ng4LoadingSpinnerModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule {}
