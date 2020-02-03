import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'showing' }) 
export class ShowingPipe implements PipeTransform {	
	transform(value: any,  facetparam: any): string {
		if (value != undefined) {
		
			var prefix = encodeURIComponent(facetparam) + '=';
			
			var pars= value.split(/[&;]/g);
			
			for (var i= pars.length; i-- > 0;) {
				
				if (pars[i].lastIndexOf(prefix, 0) !== -1) { 
					//  console.log(pars[i].split("%20").join("+"));
					// pars[i]=pars[i].split("%20").join("+"); 
					pars.splice(i, 1);
					
				}
			}
		
			return pars.join('&');						
		}
							
		
			
			
		
			
	} 
}