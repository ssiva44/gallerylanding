import { Component,ViewChild,OnInit ,Input} from '@angular/core';
import { URLSearchParams, } from '@angular/http';
import { Http,Response } from '@angular/http';
import { GalleryComponent } from './gallery.component';

import {  ElementRef, Inject, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'gallerysearch',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [style({opacity:0}), animate(500, style({opacity:1}))]),
      transition('* => void', [animate(500, style({opacity:0}))])
    ]),		
  ]	
})
export class AppComponent {
  @ViewChild(GalleryComponent)
  private gallery: GalleryComponent;
  facetsjson:any;
  imageposts:any[]=[];
  descposts:any[]=[];
  linkposts:any[]=[];
  @Input() descriptionObject:any;
  @Input() imagepathObject:any;
  @Input() linkpathObject:any;
//url: string="http://wbwcfe.worldbank.org/photoarchive/api/archives/search?query=%7b%22term%22:%7b%22operator%22:%22operatorAnd%22,%22subqueries%22:%5b%7b%22operator%22:%22matchUnparsedQueryString%22,%22values%22:%5b%22worldbank%22%5d%7d,%7b%22field%22:%22WBG%20Eligible%20for%20Public%20Release%22,%22operator%22:%22equalValue%22,%22values%22:%5b%22yes%22%5d%7d,%20%7b%22field%22:%22For%20Public%20Download%22,%22operator%22:%22equalValue%22,%22values%22:%5b%22Yes%22%5d%7d%5d%7d,%22startingIndex%22:0,%22pageSize%22:15,%22sortOptions%22:%7b%22field%22:%22Cataloged%22,%22order%22:%22desc%22%7d%7d";
  queryParameter: string;	
  url: string;
  detailPath: string;	
  inputUrl: string;
  isFacetsCollapsed: boolean = false;
  sideBarArrow: string;
  listClass: any;
  facetParameters: string;
  gridClass: any;
  paramVal: any;
  ModifiedUrl:string;
  showingFrom: number;
  showingTo: number;
  total: number;
  wcmMode: string;
  loading: boolean;
  pageSize: number;
  initialpageSize: number=15;
  isScrollToTop: boolean = false;	
  isLoadMore: boolean;
  onLoad: boolean = false;
  showingResults: string = 'ShowingResults';
  decodedUrl:any;
  api:any;host:any;
  qterm: string; ref: string;
  facets: any;
  isCollapsed: boolean = true;
  displayParameters:string;
  inputParameters: string;
  keyword_excat:any;Fkey:any;Fvalue:any;
  selectedFacetItems: any[];
  queryparams:any[];
  refineBy: string = 'RefineBy';	
  facetjson:any[] = [];	field:any;value:any;
  keys: string = '&keys=Today,Past7Days,PastMonth,PastYear,RefineBy,TimeFrame,SpecificDateRange,StartDate,EndDate,SeeMore,SeeLess,SortBy,ShowingResults,Date,addtocalendar,Upcoming,Past,BestMatch,job_title,alphabetical,NoResultsMsgFuture,NoResultsMsgPast';
  facetsNames: any = {};
  facetLabels: any = {};
  constructor(private element: ElementRef ,private http:Http, eRef:ElementRef) {				
  this.wcmMode = 'wcmmode=disabled';
  this.descriptionObject=eRef.nativeElement.getAttribute('descriptionObject');
  this.imagepathObject=eRef.nativeElement.getAttribute('imagepathObject');
  this.linkpathObject = eRef.nativeElement.getAttribute('linkpathObject');
  this.url = eRef.nativeElement.getAttribute('url');
  this.imagepathObject=JSON.parse(this.imagepathObject);
  this.descriptionObject=JSON.parse(this.descriptionObject);
  this.linkpathObject = JSON.parse(this.linkpathObject);
  let resources=this.imagepathObject['images'];
  for(var key in resources) {
    if(resources.hasOwnProperty(key)) {
      this.imageposts.push(resources[key]);
    } 
  }
  let  descresources = this.descriptionObject["description"];
  for(var keyval in descresources) {
    if(descresources.hasOwnProperty(keyval)) {
      this.descposts.push(descresources[keyval]);  
    }
  }
  let  linkresources = this.linkpathObject["link"];
  for(var keylink in linkresources) {
    if(linkresources.hasOwnProperty(keylink)) {
    this.linkposts.push(linkresources[keylink]);  
    }
  }
  let decodedUrl=decodeURI(this.url);
  let api=decodedUrl.split("=json")[0];
  this.showingFrom = 1;	
  let response = this.http.get(api+"=json&fct=wbg_country,wbg_year,wbg_topics,wbg_region&rows=0", '').map((response: Response) => {
    
    return response.json();
  });
  let facets = []
  response.subscribe(
    res => {
    
    let facetAttribute = res["photoarchives"]["facets"];
     let facetLabels = {
      'wbg_topics' : 'WBG Topics',
      'wbg_country' : 'WBG Country',
      'wbg_region' : 'WBG Region',
      'wbg_year' : 'WBG Decade'
      }
  Object.keys(facetAttribute).forEach(key => {
    let facetsAllValues=[];
    Object.keys(facetAttribute[key]).forEach(keys => {
      facetsAllValues.push(facetAttribute[key][keys].label);
    })
    facets.push({
      facetLabel: facetLabels[key],
      facetName: key,
      facetItems: facetsAllValues       
    });   
  }); 
  this.facetsjson = facets
     
  });  
}

ngOnInit() {
  this.sideBarArrow =  'fa fa-angle-left' ;
  this.detailPath = this.element.nativeElement.getAttribute('detailPath');
  let currentUrl = window.location.href;   
  let searchParameters = currentUrl.split('?');
  if(searchParameters[1]!=undefined){
    if (searchParameters[1].indexOf(this.wcmMode) !== -1) {
      searchParameters[1] = this.removeURLParameter(searchParameters[1], this.wcmMode.split('=')[0]);
    }
    if (searchParameters[1].indexOf('cq_ck=') !== -1) {
      searchParameters[1] = this.removeURLParameter(searchParameters[1], 'cq_ck');
    }
    this.facetParameters=searchParameters[1];
  }   
  this.qterm = this.getParameterByName('qterm', currentUrl);
  this.ref = this.getParameterByName('ref', currentUrl);
  let parameters = this.addParam();
  let displayUrl = window.location.href
  let displayUrlSplit = displayUrl.split('?');
  if(displayUrlSplit.length>1){
    let displaySplit = displayUrl.split('&id');
    let PageCount:any =[];
   if(displaySplit.length>1){
      PageCount = displaySplit[1].split("pC=");
      if(PageCount.length>1){
        let totalpages = PageCount[1].split('&');
        this.initialpageSize = parseInt(totalpages[0]);
      }
   }
  }
  let decodedUrl=decodeURI(this.url);
    let api=decodedUrl.split("rows=")[0];
  if(parameters.length!=0){
    
     this.url= api+"rows="+this.initialpageSize+"&srt=cataloged&order=desc&"+parameters[0]["key"]+"="+parameters[0]["value"]+""; 
  }
  else{
     this.url= api+"rows="+this.initialpageSize+"&srt=cataloged&order=desc"; 
  }
}

ngOnChanges() {
  this.listClass = "";
  this.gridClass = "";
}
public updateParameter(parameter: any)
{
  this.onLoad = true;		
  this.loading = true;
  this.paramVal=parameter.split("=")[1];
  let apiUrl=decodeURI(this.url);
  this.url= apiUrl+"&qterm="+this.paramVal+"";
  let displayUrl = window.location.href;
  let displayUrlSplit = displayUrl.split('?');
  window.history.pushState('', '', displayUrlSplit[0] + '?' + parameter);
}
public udpatedValues(value: any) 
{		
  this.total = value.total;
  this.showingTo = value.showingTo;
  this.isLoadMore = value.isLoadMore;
}
public changeView(view) {
  if (view == 'grid') {
    this.listClass = "photogallery-card";
    this.gridClass = "grid-group-item photogallery-card-item";
  } else  {
    this.listClass = "";
    this.gridClass = "photo-group-item";      
  }
}  
public updateFacetsCollapsed(facetsCollapsed: any) {    	
  this.isFacetsCollapsed = facetsCollapsed;
  this.sideBarArrow = this.sideBarArrow == 'fa fa-angle-left' ? 'fa fa-angle-right' : 'fa fa-angle-left';		
}

public loadMore() {	
  this.loading = true;	
 let parameters = this.addParam();
 this.initialpageSize= this.initialpageSize+15;
 let decodedUrl=decodeURI(this.url);
    let api=decodedUrl.split("rows=")[0];
 if(parameters.length!=0){
  this.url= api+"rows="+this.initialpageSize+"&srt=cataloged&order=desc&"+parameters[0]["key"]+"="+parameters[0]["value"]+""; 
}
else{
  this.url =  api+"rows="+this.initialpageSize+"&srt=cataloged&order=desc";
}
}

public addParam(){
  let parameters = [];
  if (this.facetParameters != '' &&  this.facetParameters != undefined) {       
    this.facetParameters.split('&').forEach(query => {
      let term  = query.split('=');               
      if (term[0]== 'qterm' || term[0]=='wbg_topics' || term[0]=='wbg_country'|| term[0] =='wbg_region' || term[0] =='wbg_year')  {
        parameters.push({
          key : term[0],
          value : term[1]
        }); 
      }        
    });    
  }
  return parameters;
}
public onClearAll() {	
  let displayUrl = window.location.href;
  let displayUrlSplit = displayUrl.split('?');
  window.history.pushState('', '', displayUrlSplit[0]);
  location.reload();      
}
public getParameterByName(name, url) {	    
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

public removeURLParameter(url, parameter) {		
  var prefix = encodeURIComponent(parameter) + '=';
  var pars= url.split(/[&;]/g);

  for (var i= pars.length; i-- > 0;) {    
    if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
      pars.splice(i, 1);
    }
  }
  return pars.join('&');					
}

public updateIsCollapsed(collapse: any) {			
  this.isCollapsed = collapse;
}
@HostListener("window:scroll", [])
onScroll(): void {	
  if (window.scrollY > 50) {
  this.isScrollToTop = true;
  } else {
  this.isScrollToTop = false;
  }
}

public onScrollToTop() {
  window.scrollTo(0, 0);		
}

public onScrollToLoadMore() {
  document.getElementById('loadMore1').scrollIntoView(true);
}	


}
