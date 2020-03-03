import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({  
	selector: 'search', 	
	templateUrl: './search.component.html',
	providers: []
})

export class SearchComponent {
	@Input() url: string;
	searchValue:string = '';	
	paramsValue:any=[];	
	placeholder: string;
	@Input() qterm: string;	
	searchText:string='';
	@Output() outParameters = new EventEmitter<string>();
	@Input() facetParameters: string;
	constructor() {
		this.placeholder = 'Enter Search Term';
	}
	ngOnChanges() {	
		let displayUrlSplit:any = [];
		if(this.qterm !=null){
		    displayUrlSplit = this.qterm.split('?');
		}
		if(displayUrlSplit.length>1){
			this.qterm = displayUrlSplit[0];
		}
		this.searchValue = this.qterm == '' || this.qterm == undefined ? '' : this.qterm;
	}
	public onSearch() {
		let queryParams="";
		let parameters = this.addParam();
		queryParams = parameters;
        if(parameters!=""){
			queryParams = parameters;
		}
		else{
			queryParams ='qterm=' + this.searchValue;
		}
		this.outParameters.emit(queryParams);
		this.searchText = this.searchValue;	
		location.reload();			
	}
	public addParam(){
		let parameters = '';
		let params =[];
		let isqterm:any;
		if(Array.isArray(this.paramsValue)){
			isqterm = this.paramsValue[0]
		}
		else{
			isqterm = this.paramsValue;
		}
		if (this.paramsValue != '' &&  this.paramsValue != undefined && isqterm.indexOf('&')!=-1) {
			params = isqterm.split('&');
			params.forEach(query => {
				let term  = query.split('=');               
				if (term[0]=='wbg_topics' || term[0]=='wbg_country'|| term[0] =='wbg_region' || term[0] =='wbg_year')  {
					parameters += term[0]+"="+term[1]+"&"
				}      
				if (term[0]== 'qterm'){
					parameters += "qterm="+this.searchValue+"&"
				}  
			});
		}  
		else{
			if(this.searchValue!=""){ 
				if(isqterm.indexOf('qterm')!=-1){
					parameters += "qterm="+this.searchValue+"&"
				}
				else{
					parameters += this.paramsValue+"&qterm="+this.searchValue+"&"
				}
				
			}
		}
		  if(parameters!='' && parameters.indexOf('&')>-1){ 
			parameters = parameters.substring(0,parameters.length-1)
		}
		isqterm='';
		return parameters;
	  }
}
