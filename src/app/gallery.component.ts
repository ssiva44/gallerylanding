import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

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
@Input() total:number;
@Output() finalResponse = new EventEmitter < any > ();
@Output() outParameters = new EventEmitter < string > ();
@Output() childEvent = new EventEmitter();
apiResponse: any;
resources: any;
facetposts: any[] = [];
posts: any[] = []
imagepath:any;
multimedia: any[];
pageCount:any;
backImageID: any = "";
backPageCount: any;
listClass: any;
gridClass: any;      
constructor(private http: Http)
{
    this.listClass = "";
    this.gridClass = "photo-group-item";          
}
ngOnChanges() {
    let displayUrl = window.location.href;
    let displayUrlSplit = displayUrl.split('&id=');
    if(displayUrlSplit.length>1){
        let imageID = displayUrlSplit[1].split("&");
        if(imageID.length>1){
           // let id = imageID[1].split('&');
            this.backImageID = imageID[0];
        }
    }
    this.getData(this.url);    
    if(this.backImageID!=""){
        const id=this;
         setTimeout(function() {
             if(document.getElementById(id.backImageID)!=null){
              //behavior: "smooth", block: "end",
                document.getElementById(id.backImageID).scrollIntoView();
                document.getElementById("title_"+id.backImageID).focus();
             }
         }, 0);
      }    
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
getData = function(url: string) {
    let numberOfRows:any;
    let response = this.http.get(this.url, '').map((response: Response) => {
        return response.json();
    })
    response.subscribe(
        res => {
            this.imagepath="https://wbwcfe.worldbank.org/photoarchive/api/archives/image?id=";
            let total= res.total;            
            this.resources = res["photoarchives"];   
            numberOfRows = res.rows;
            let length = Object.keys(this.resources).length;               
            let multimedia = [],
                media = [],
                index = 1;
                let showingTo, isLoadMore, facets = [];
            Object.keys(this.resources).forEach(key => {
                showingTo = 0;	isLoadMore = false;
                if (media.length < 3) {
                    if (index == length) {
                        media.push(this.resources[key]);
                        multimedia.push(media);
                    } else {
                        media.push(this.resources[key]);
                    }
                } else {
                    if (index == length) {
                        multimedia.push(media);
                        media = [];
                        media.push(this.resources[key]);
                        multimedia.push(media);
                    } else {
                        multimedia.push(media);
                        media = [];
                        media.push(this.resources[key]);
                    }
                }
                index++;
            });
            this.multimedia = multimedia;
            showingTo = numberOfRows >= total ? total : numberOfRows;
            this.backPageCount = showingTo;
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