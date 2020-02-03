import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'timeFrameContains', pure: false}) 
export class TimeFrameContainsPipe implements PipeTransform { 
	transform(value: any, facetName: string, facetValue: string): any {			
		 
		// if (value == '' || value == undefined) {
		// 	return facetName + '=' + facetValue.split(' ').join('+');
		// } else {
		// 	return value + '&' + facetName + '=' + facetValue.split(' ').join('+');
		// }
		if(value =! '' || value!= undefined) {
			return  facetName + '=' + facetValue.split(' ').join('+');
		}		
	}  
}