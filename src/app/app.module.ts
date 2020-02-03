import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GalleryComponent } from './gallery.component';
import { SearchComponent } from './search.component';
import { FormsModule} from '@angular/forms';
import { HttpModule,Http} from '@angular/http';
import { FacetsComponent } from './facets.component';
import {MobileFacetsComponent} from './mobile-facets.component';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import {HttpClientModule} from '@angular/common/http';
import { CarouselComponent } from './carousel.component';
import { MaterialModule } from './material.module';
import { KeysPipe, DateFormatPipe, ObjectsLengthPipe, ContainsPipe, ObjectContainsPipe, FacetContainsPipe, FacetAnimationPipe, TimeFrameContainsPipe, LocalePipe, ObjectFilterPipe, LimitPipe, ShowingPipe, LabelPipe, EventsDatePipe, MobileFacetContainsPipe, MediaIconPipe, LanguageSpokenPipe } from "./pipes/index";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
		LanguageSpokenPipe
  ],
  imports: [
    BrowserModule,MaterialModule,FormsModule,HttpModule,BrowserAnimationsModule, NgxCarouselModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
