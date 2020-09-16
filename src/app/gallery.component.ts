import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// var _ = require('lodash');
import * as _ from "lodash";
// import 'rxjs/add/observable/forkJoin';
// import 'rxjs/add/operator/map';
import * as $ from "jquery";
@Component({
    selector: 'gallery',
    templateUrl: './gallery.component.html',
    providers: []
})
export class GalleryComponent {
@Input() url: string;
@Input() keys: string;	
@Input() pageSize: string;
@Input() detailPath:string;
@Output() loading = new EventEmitter<boolean>();

@Input() total:number;
@Output() finalResponse = new EventEmitter < any > ();
@Output() outParameters = new EventEmitter < string > ();
@Output() childEvent = new EventEmitter();
@Input() facetParameters: string;

apiResponse: any;
resources: any;
facetposts: any[] = [];
posts: any[] = []
imagepath:any;
multimedia: any=[];
pageCount:any;
backImageID: any = "";
backPageCount: any;
listClass: any;
gridClass: any;      
array = [];
initialValue = 0;
throttle = 300;
isBack:boolean=true;
scrollDistance = 1;
scrollUpDistance = 2;
direction = '';
totalCount:number=0;
stratindex=0;
IsScrollTriggered:boolean=true;
params:any;
constructor(private http: HttpClient,private spinnerService: Ng4LoadingSpinnerService)
{
    this.listClass = "";
    this.gridClass = "photo-group-item";          
}
ngOnInit() {
    let displayUrl1 = window.location.href;
    let displayUrlSplit1 = displayUrl1.split('&id=');
    if(displayUrlSplit1.length>1){
        let imageID = displayUrlSplit1[1].split("&");
        if(imageID.length>1){
            this.backImageID = imageID[0];
        }
    }
    let displayUrl = window.location.href
    let displayUrlSplit = displayUrl.split('?');
    if(displayUrlSplit.length>1){
      let displaySplit = displayUrl.split('&id');
      let PageCount:any =[];
     if(displaySplit.length>1){
        PageCount = displaySplit[1].split("pC=");
        if(PageCount.length>1){
          let totalpages = PageCount[1].split('&');
          if(totalpages[0]!=""){
              this.isBack=false;
            this.initialValue = parseInt(totalpages[0]);
          }
        }
     }
    }
    this.getData(this.url,true); 
    let decodedUrl=decodeURI(this.url);
    let api=decodedUrl.split("os=")[0];
    const id=this;
    let parameters = this.addParam();
    let $window = $(window);
    let $document = $(document);
    let defaultheight = 1000;
    let parameter:any;
    $window.scroll(function () {
        let height = $document.height() - defaultheight;
        if ($window.scrollTop() + $window.height() > height) {
            if (id.IsScrollTriggered) {
                var totalcycle=0;
                if(id.initialValue!=0){
                  totalcycle = Math.ceil(id.totalCount / id.initialValue) * id.initialValue;
                }else{
                  totalcycle = id.totalCount;
                }
                if (id.totalCount > id.initialValue) {
                    id.stratindex = id.stratindex + id.initialValue;
                    if (id.stratindex < totalcycle) {
                        if(!id.isBack){
                            id.initialValue = id.initialValue;
                            id.isBack=true;
                        }
                        else{
                            id.initialValue = id.initialValue+15;
                        }
                        let url;
                        var displayUrl = window.location.href
                        var displayUrlSplit = displayUrl.split('?');
                            if(displayUrlSplit.length>1){
                                    parameter = displayUrlSplit[1].split('&id');
                                    displayUrlSplit[1] = parameter[0];
                                url = api+"os="+id.initialValue+"&rows=15&srt=cataloged&order=desc&"+displayUrlSplit[1];
                            }
                            else{
                                url = api+"os="+id.initialValue+"&rows=15&srt=cataloged&order=desc";
                            }
                        id.getData(url,false);
                    }
              
             }
            }
        }
    });
     
    
      
}

getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}
ngOnChanges() {
    if(this.backImageID!=""){
        const id=this;
         setTimeout(function() {
             if(document.getElementById(id.backImageID)!=null){
              //behavior: "smooth", block: "end",
              document.getElementById("title_"+id.backImageID).focus();
                document.getElementById(id.backImageID).scrollIntoView({behavior: "smooth"});
                
             }
         }, 0);
      }  
}
public addParam(){
    let parameters = [];
    if (this.facetParameters != '' &&  this.facetParameters != undefined) {       
      this.facetParameters.split('&').forEach(query => {
        let term  = query.split('=');               
        if (term[0]== 'qterm' || term[0]=='wbg_topics' || term[0]=='wbg_country'|| term[0] =='wbg_region' || term[0] =='wbg_decade')  {
          parameters.push({
            key : term[0],
            value : term[1]
          }); 
        }        
      });    
    }
    return parameters;
  }

navigateURL(){
    
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
getData = function(url: string,isloading:boolean) {
   if(isloading){
        this.multimedia=[]
    }
    const id=this;
    let numberOfRows:any;
    this.loading.emit(true);
    this.IsScrollTriggered=false;
    this.http.get(url).subscribe(
        res => {
            this.imagepath="https://wbwcfe.worldbank.org/photoarchive/api/archives/image?id=";
            let total= res.total;
            this.totalCount = total;            
            this.resources = res["photoarchives"]; 
            numberOfRows = res.os+res.rows;
            let length = Object.keys(this.resources).length;  
           // let multimedias:any = []
              let  media = [],
                index = 1;
                let showingTo, isLoadMore, facets = [];
            Object.keys(this.resources).forEach(key => {
                showingTo = 0;	isLoadMore = false;
                if (media.length < 3) {
                    if (index == length) {
                        media.push(this.resources[key]);
                        this.multimedia.push(media);
                    } else {
                        media.push(this.resources[key]);
                    }
                } else {
                    if (index == length) {
                        this.multimedia.push(media);
                        media = [];
                        media.push(this.resources[key]);
                        this.multimedia.push(media);
                    } else {
                        this.multimedia.push(media);
                        media = [];
                        media.push(this.resources[key]);
                    }
                }
                index++;
                this.IsScrollTriggered=true;
               
            });
            this.loading.emit(false);
            showingTo = numberOfRows >= total ? total : numberOfRows;
            this.backPageCount = showingTo;
            let displayUrl = window.location.href;
           let displayUrlSplit = displayUrl.split('?');
           if(displayUrlSplit[1]!=null && displayUrlSplit[1]!=""){
            let displaySplit = displayUrlSplit[1].split('&id');
                if(displaySplit[0]!=null){
                    this.params = "&"+displaySplit[0];
                }
                else{
                    this.params = "&"+displayUrlSplit[1];
                }
           }
           
            isLoadMore = numberOfRows >= total ? false : true;	
            this.finalResponse.emit({ total: total, showingTo: showingTo,isLoadMore: isLoadMore, loading: false});
        });
    }  
    public getSortBy(event) {
        this.outParameters.emit(event);
    }
    public getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    public getPageSize(name, url) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));	    
    }
    
}