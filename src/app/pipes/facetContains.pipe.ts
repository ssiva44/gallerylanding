import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'facetContains', pure: false }) 
export class FacetContainsPipe implements PipeTransform { 
	transform(value: any, facetItems: any, facetName: any, limitFacets: any, index: number): any {		
		let objects = [];		
		let i = 0;
			
		//value.sort((a, b) => a.label.localeCompare(b.label)); 
		
		// console.log(facetItems);
		// console.log("name"+facetName);
		// console.log(value);
		if(facetItems.hasOwnProperty(facetName)) {
					
			if (facetItems[facetName].trim() == '') {
				
				Object.keys(value).forEach( key => {
					if (limitFacets.indexOf(index) > -1) {
							console.log(value[key])					
						objects.push(value[key]);
						
					} else {						
						if (i < 6) {
							objects.push(value[key]);	
						}			
						i++;
					}								
				});
			} else {
				
				Object.keys(value).forEach( key => {					
					if(decodeURI(facetItems[facetName]).trim() == value[key].trim()) {								
						objects.push(value[key]);
					} 								
				});
			}								
		} else {			
			Object.keys(value).forEach( key => {
				if (limitFacets.indexOf(index) > -1) {						
					objects.push(value[key]);
				} else {						
					if (i < 6) {
						objects.push(value[key]);	
					}			
					i++;
				}								
			});
		}
		
						
		return objects;
	} 
}