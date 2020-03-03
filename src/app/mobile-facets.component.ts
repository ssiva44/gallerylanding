import { Component, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FacetsComponent } from './facets.component';
@Component({  
selector: 'mobilefacets', 	
templateUrl: './mobile-facets.component.html',
providers: [],
animations: [    	
	trigger('refineFadeInOut', [
		state('true', style({ height: "0px", display: "none", opacity: 0 })),
		state('false', style({ height: "*", display: "block", opacity: 1 })),
		transition("* => *", animate(300))
	]),
	trigger('flyInOut', [
		state('in', style({transform: 'translateX(0)'})),
		transition('void => *', [
			style({transform: 'translateX(-100%)'}),//
			animate(100)
		]),
		transition('* => void', [
			animate(100, style({transform: 'translateX(100%)'}))
		])
	])
]
})

export class MobileFacetsComponent {
	@ViewChild(FacetsComponent)
  private parentfacet: FacetsComponent;
@Input() isCollapsed: boolean=true;
@Input() facetParameters: any;
@Input() facetsjson:any;
@Output() isCollapsedOut = new EventEmitter<boolean>();
@Output() selectedFacet = new EventEmitter<any>();
@Output() outFacet = new EventEmitter<any>();
@Output() deselectedFacet = new EventEmitter<any>();
@Output() outParameters = new EventEmitter<string>();
seeMore: string = 'SeeMore';
seeLess: string = 'SeeLess';
selectedFacetItems: any[] = [];
selectedItems: any[] = [];
limitFacets:any[]=[];
facetName: string;
facetsNames: any = [];
searchPlaceholder: string;
facets: any = [];	
search: string;
isFacets: boolean = true
facetposts:any[] = [];
keywords:any;
country:any;
decade:any;
region:any;
isAllFacets: boolean = false;
constructor(private http:HttpClient){
	this.facetsNames = {
		'Topics' : 'wbg_topics',
		'Country' : 'wbg_country',
		'Region' : 'wbg_region',
		'Year' : 'wbg_year'
	}
	

}
ngOnChanges() {	
	// if(this.facetParameters!=undefined && this.facetParameters!="" && this.facetParameters!=null){
	// 	this.facetParameters=this.facetParameters.split("%20").join("+");
	// }
	this.facetposts = this.facetsjson;
}
public getSelectedFacets(selectedFacets) {
	
this.selectedFacetItems = selectedFacets;
this.selectedItems=[];
Object.keys(this.selectedFacetItems).forEach(term => {

	if (term.indexOf('qterm') !=-1  || term.indexOf('wbg_topics') !=-1 ||  term.indexOf('wbg_country') !=-1 || term.indexOf('wbg_region') !=-1  || term.indexOf('wbg_year') !=-1)  {
	this.selectedFacetItems[term].split('%5E').forEach((val) => {
		let keyValue=term;
		if(this.selectedItems!=null){
			let indexFilters = this.selectedItems.findIndex(function(text) {return text.key === term;});
			if(indexFilters!=-1){
				keyValue ='';
			}
		}
			if(val!=undefined){
				this.selectedItems.push({
					key : keyValue,
					header: term,
					value : decodeURIComponent(val)
				  }); 
			}
	  }); 
	}
  });
				
}
public onFacetItem(facet, itemName,isChecked) {
	this.outFacet.emit({ facet: facet, itemName: itemName });
}
public onSeeMore(index) {
	this.limitFacets.push(index);		
};
public test(){
	alert('hi');
}
public onSeeLess (index) {
	let i = this.limitFacets.indexOf(index, 0);
	if (i > -1) {
		this.limitFacets.splice(i, 1);
	}				
};

public onSelectFacetName(facetName) {
  	
	this.facetName = facetName;
	this.isAllFacets = true;
	this.isFacets = false;    
}
public onDeselectFacetItem(facet) {
	
	this.collapseAll();
	this.deselectedFacet.emit(facet);
	
}
public onBack() {	
	this.search = '';
	this.isFacets = true;
	this.isAllFacets = false;
}

public collapseAll() {
	this.isCollapsed = true;
	this.isAllFacets = false;
	this.isFacets = true;
	this.isCollapsedOut.emit(this.isCollapsed);
}
public uniqueArray(array) {
	return array.filter(function(elem, pos, arr) {
		return arr.indexOf(elem) == pos;
	});
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
