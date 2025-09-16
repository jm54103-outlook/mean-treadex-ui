import { Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { AuthenService } from '../../services/authen.service';


@Component({
  selector: 'app-login',
  imports: [   
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule // ใช้สำหรับฟอร์มแบบ Reactive
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})


export class LoginComponent implements OnInit {    
  loginForm! : FormGroup; 
  private e="jm54103@outlook.co.th";

  constructor(private fb: FormBuilder
    ,private authService: AuthenService 
    ,private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });    

    this.loginForm.controls['email'].setValue(this.e);
  }

  
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onEnter(currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    if (nextInput) {
      nextInput.focus(); // เลื่อนโฟกัสไปที่ input ถัดไป
    }
  }

  onEnterNextButton(currentInput: HTMLInputElement, matButton: MatButton): void {
    if (matButton) {
      matButton.focus(); // เลื่อนโฟกัสไปที่ button ถัดไป
    }
  }

  onEnterLogin(): void{
    console.log('onEnterLogin()');
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Login Data:', formData);
      console.log('email:', formData.email);
      console.log('password:', formData.password);
      // You can call an API here to handle login

      
      this.authService.login(formData.email, formData.password).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
          // Redirect ไปยังหน้าหลักหลังจาก login สำเร็จ
          this.router.navigate(['/home']);
        },
        error: (err) => {
          let errorMessage = 'Login failed. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
