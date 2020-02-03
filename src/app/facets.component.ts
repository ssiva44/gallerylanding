import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Component({
  selector: 'facets',
  templateUrl: './facets.component.html',
  animations: [    	
	trigger('facetFadeInOut', [
		state('load', style({ height: "0px", display: "none" })),
		state('in', style({ height: "0px", display: "none" })),
		state('out', style({ height: "*", display: "block" })),
		transition("in => out", animate(200)),
		transition("out => in", animate(200)),
		transition("out => load", animate(200)),
		transition("load => out", animate(200))
	])
]

})
export class FacetsComponent{
	@Input() facetParameters: string;
	@Input() facetsjson:any;
	@Output() outParameters = new EventEmitter<string>();
	@Output() selectedFacets = new EventEmitter<any>();
	facets: any = [];
	collapseFacets: any[] = [];
	limitFacets: any[] = [];
	selectedFacetItems: any[];
	facetposts:any[] = [];
	keywords:any;
	country:any;
	decade:any;
	region:any;
	facetjson:any;
	constructor(private http:Http){ }
	ngOnInit() {
	
	}
	ngOnChanges(change: SimpleChange) {	
		this.facetposts = this.facetsjson;
		setTimeout(() => {console.log(this.facetposts)},0);
		this.selectedFacetItems = [];
		let parameters :any;
		if(this.facetParameters !== undefined) {  
			let removeparams=this.removeURLParameter(this.facetParameters, 'qterm');     	       
			 parameters = removeparams.split('&');
			if(parameters!="") {  
			for(let i=0; i < parameters.length; i++) {
				let key = parameters[i].split('=')[0];
				let value = parameters[i].split('=')[1];
				if (value != '' && value!=undefined) {
					this.selectedFacetItems[key] = value.split('+').join(' ');
				}								
			}
	 	 }
		}
		this.selectedFacets.emit(this.selectedFacetItems); 
		this.facetposts.forEach((facet, index) => {
			if (this.selectedFacetItems.hasOwnProperty(facet.facetName)) {
				this.collapseFacets.push(facet.facetName);
			}
		});
	   }
		public onCollapse(index) {
			let i = this.collapseFacets.indexOf(index, 0);
			if (i > -1) {
			   this.collapseFacets.splice(i, 1);
			} else {
				this.collapseFacets.push(index);
			}
		};

		public onSeeMore(index) {
			this.limitFacets.push(index);		
		};
	
		public onSeeLess(index) {
			let i = this.limitFacets.indexOf(index, 0);
			if (i > -1) {
			   this.limitFacets.splice(i, 1);
			}				
		};
		
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
		
		
}
        
          
              
       
     

