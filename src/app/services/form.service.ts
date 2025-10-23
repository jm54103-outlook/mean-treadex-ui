import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
  // ฟังก์ชันที่ดึงค่าโดยใช้ key แบบ dynamic
  public getValue<T>(model: T, key: keyof T) {
    return model[key];
  }
  public setValue<T>(model: T, key: keyof T, value:any){
    model[key]=value;
  }

  public formatTHDate(date:Date)
  {
    if(date==null || date == undefined)
    {
      return '';
    }
    else
    {
        let options: Intl.DateTimeFormatOptions = {
          day: "2-digit"
         ,month: "2-digit"
         ,year: "numeric"        
      };    
      return date.toLocaleString('th',options);
    }
  }  
  
  public formatTHTime(time:Date){
    if(time==null || time == undefined)
    {
      return '';
    }
    else
    {
        let options: Intl.DateTimeFormatOptions = {
          hour: "2-digit" 
         ,minute: "2-digit"
      };    
      return time.toLocaleString('th',options);
    }
  }   

}
