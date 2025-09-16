import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  

  private apiUrl = 'http://localhost:4200/api'; // URL ของ API ที่ใช้ตรวจสอบตัวตน
  private authTokenKey = 'auth_token'; // ชื่อ key ที่ใช้เก็บ token ใน localStorage

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับ login
  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    return this.http.post<any>(`${this.apiUrl}/auth.json`, loginPayload)
      .pipe(
        tap(response => {
          // เก็บ token ลงใน localStorage
          localStorage.setItem(this.authTokenKey, response.token);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  // ฟังก์ชันสำหรับ logout
  logout(): void {
    localStorage.removeItem(this.authTokenKey); // ลบ token ออกจาก localStorage
  }

  // ฟังก์ชันตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.authTokenKey); // ตรวจสอบว่ามี token หรือไม่
  }

  // ฟังก์ชันสำหรับ get token
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // ฟังก์ชันเพื่อใช้ในการเพิ่ม authorization header ในการเรียก API
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }
  
}
