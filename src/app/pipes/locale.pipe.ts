import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'locale' }) 
export class LocalePipe implements PipeTransform {	
	transform(value: any, label:string): string {
		
			
			if (value.indexOf("WBG ")!= -1) 
			{
					value=value.replace("WBG ","");
					
			} 
		return value;	
	} 
}