import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileConversionService { 

  constructor(private http: HttpClient) {}

  async convertToBase64(filePath: string): Promise<string | ArrayBuffer | null> {
    const blob = await firstValueFrom(this.http.get(filePath, { responseType: 'blob' }));

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string; 
        // Assuming reader.result is already in correct 'data:image/jpeg;base64, ...' format
        resolve(base64data.substring(base64data.indexOf(',') + 1)); // Extract only the Base64 data
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }
}