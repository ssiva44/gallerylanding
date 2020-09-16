import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';


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
	
	selectedFace: any = {};
	facetposts:any[] = [];
	keywords:any;
	country:any;
	decade:any;
	region:any;
	facetjson:any;
	placeholder: string;
	finalValue:any[]=[];
	finalFacets:string="";
	constructor(private http:HttpClient){ }
	ngOnInit() {
	
	}
	ngOnChanges(change: SimpleChange) {	
		this.facetposts = this.facetsjson;
		if(this.facetposts!=undefined){
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
		
		this.facets = this.facetposts;
		if (this.facets != undefined) {
			this.selectedFacetItems = this.facets.length == 0 ? [] : this.selectedFacetItems;
			let facetName = "";
			for(let i=0; i < this.facets.length; i++) {	        		
				facetName = this.facets[i].facetName;
				
				if (this.facetParameters.indexOf(facetName) > -1) {
					this.collapseFacets.push(facetName);
				}				
			}
		}		
		this.selectedFace=this.selectedFacetItems;
		this.selectedFacets.emit(this.selectedFacetItems); 
		this.placeholder = 'Search';
	}
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
		public onSelectFacetItem(facet, itemName) {
			this.limitFacets = [];
			this.selectedFacetItems[facet.trim()] = itemName.trim();
			itemName = itemName.replace('&', '%26');
			if(this.facetParameters === undefined || this.facetParameters === '') {    		
				this.outParameters.emit(facet.trim() + '=' + itemName.split(' ').join('+'));
			} else {
				let modifiedUrl = this.removeURLParameter(this.facetParameters, facet);    		
				
				if (modifiedUrl === '') {
					this.outParameters.emit(modifiedUrl + facet.trim() + '=' + itemName.split(' ').join('+'));
				} else {
					if( modifiedUrl.charAt( 0 ) === '&' )
						modifiedUrl = modifiedUrl.slice( 1 );
					this.outParameters.emit(modifiedUrl + '&' + facet.trim() + '=' + itemName.split(' ').join('+'));
				}    		
			}    	
			this.selectedFacets.emit(this.selectedFacetItems);     		
		};
		
		public onDeselectFacetItem(facet) {
			this.limitFacets = [];
			if(this.selectedFacetItems.hasOwnProperty(facet)) {			
				delete this.selectedFacetItems[facet];
			}				
			this.outParameters.emit(facet + '=');
			this.selectedFacets.emit(this.selectedFacetItems); 
		}
		
		public onFacetItem(facet, itemName) {
		let parameters :any;
		if(this.facetParameters !== undefined) {  
			//let removeparams=this.removeURLParameter(this.facetParameters, 'qterm');     	       
			 parameters = this.facetParameters.split('&');
			 let oldValues=[];
			if(parameters!="") {  
			for(let i=0; i < parameters.length; i++) {
				let key = parameters[i].split('=')[0];
				let value = parameters[i].split('=')[1];
				if(value!=null&&value != '' && value!=undefined){
					if(value.split('%5E').length>1){
						value.split('%5E').forEach((val) => {
							oldValues.push(val);
						});
					}
					else{
						oldValues.push(value);
					}
					this.selectedFace[key] = oldValues;
					oldValues=[];
				}
			}
		  }
		}
			let finalFacets = '';
			if (this.selectedFace.hasOwnProperty(facet)) {
				let facetItems = this.selectedFace[facet]; 
				let index = facetItems.indexOf(encodeURIComponent(itemName));
				
				if (index > -1) 								
					facetItems.splice (index, 1);
				else
					facetItems.push(encodeURIComponent(itemName));
				
				this.selectedFace[facet] = facetItems;
			} else {
				this.selectedFace[facet] = [encodeURIComponent(itemName)];
			}		
						
			Object.keys(this.selectedFace).forEach((facetName) => {
				if (facetName== 'qterm' || facetName=='wbg_topics' || facetName=='wbg_country'|| facetName =='wbg_region' || facetName =='wbg_decade')  {
				let facetItems = this.selectedFace[facetName];			
				if (facetItems.length != 0) {
					finalFacets = finalFacets == '' ? facetName + '=' + facetItems.join('%5E') : finalFacets + '&' + facetName + '=' + facetItems.join('%5E');	
				}	
			   }					
			});	
			
			this.facetParameters='';
			this.facetParameters =	finalFacets;

			this.finalFacets  = finalFacets;
			
		};

goCheckedValue(){
	this.selectedFacets.emit(this.selectedFace); 
	this.outParameters.emit(this.finalFacets);
}
public onClearAll() {	
	let displayUrl = window.location.href;
	let displayUrlSplit = displayUrl.split('?');
	window.history.pushState('', '', displayUrlSplit[0]);
	location.reload();      
  }		
}
        
          
              
       
     

