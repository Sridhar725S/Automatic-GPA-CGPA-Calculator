import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClickService {
  private baseUrl = 'https://automatic-gpa-cgpa-calculator.onrender.com/api';

  constructor(private http: HttpClient) { }

  trackClick(type: 'GPA' | 'CGPA' | 'Auto_GPA') {
    return this.http.post(`${this.baseUrl}/clicks/${type}`, {});
  }

  getClickCounts() {
    return this.http.get(`${this.baseUrl}/clicks`);
  }
}
