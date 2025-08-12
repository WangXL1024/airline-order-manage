import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../core/services/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon'; // Add this import
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    FormsModule,
    NzIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})


export class Login {
  // 组件逻辑保持不变
  username = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {}

  handleLogin(): void {
    if (!this.username || !this.password) {
      this.message.warning('请输入用户名和密码');
      return;
    }

    this.loading = true;
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.message.success('登录成功');
        this.router.navigate(['/order-list']);
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err.message || '登录失败');
      }
    });
  }
}