import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({  
	selector: 'search', 	
	templateUrl: './search.component.html',
	providers: []
})

export class SearchComponent {
	@Input() url: string;
	searchValue:string = '';	
	placeholder: string;
	@Input() qterm: string;	
	searchText:string='';
	@Output() outParameters = new EventEmitter<string>();
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
		this.outParameters.emit('qterm=' + this.searchValue);
		this.searchText = this.searchValue;	
		location.reload();			
	}
}
