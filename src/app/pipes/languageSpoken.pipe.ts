import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'languageSpoken' }) 
export class LanguageSpokenPipe implements PipeTransform {	
	transform(value: any): string {
		
		if (value != undefined) {
			
			value=value.split("%20").join("+");								
		}				
		return value;
	} 
}