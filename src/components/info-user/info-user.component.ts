import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../Model/Interfaces/User';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/Users.service';
import { Avatar } from '../../Model/Interfaces/avatar.interface';
import { AvatarsComponent } from '../avatars/avatars.component';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [AvatarsComponent, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  user: User | null = null;
  userId: string | null = null; 
  imageUrl: string = 'https://via.placeholder.com/150';
  showAvatars: boolean = false;
  form: FormGroup;
  isReadOnly: boolean = true;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  arrayStars = Array(10);
  starPath: string = 'assets/icons/star.png';
  selectedStars: number = 0;

  selectStar(starNumber: number) {
    this.selectedStars = starNumber;
    console.log(`Selected star: ${starNumber}`);
  }

  constructor() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id'); 
    console.log("Captured userId from route:", this.userId);

    if (this.userId) {
      this.loadUserData(this.userId); 
    } else {
      console.error("User ID not found in route");
      this.router.navigate(['/login']);
    }
  }

  private loadUserData(id: string) {
    this.usersService.findUserById(id).subscribe({
      next: (user: User) => {
        console.log("User found:", user);
        this.user = user;
        this.populateForm(user); 
        this.imageUrl = user.img || this.imageUrl; 
      },
      error: (error: Error) => {
        console.error("User not found:", error);
        this.router.navigate(['/login']);
      }
    });
  }

  private populateForm(user: User) {
    this.form.patchValue({
      username: user.username,
      email: user.email,
      password: '' 
    });
  }

  toggleAvatarSelection() {
    this.showAvatars = !this.showAvatars;
  }

  onAvatarSelected(avatar: Avatar) {
    this.imageUrl = avatar.url;
    localStorage.setItem('profileImage', avatar.url);
    this.showAvatars = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.imageUrl = imageUrl;
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  eliminateUser(id: string | null) {
    if (!id) {
      console.error("Invalid user ID.");
      return;
    }

    this.usersService.deleteUser(id).subscribe({
      next: () => {
        console.log('User successfully deleted');
        this.router.navigate(['/login']);
      },
      error: (e: Error) => {
        console.error("Error deleting user:", e.message);
      }
    });
  }
}



/*export class InfoUserComponent implements OnInit {
  user: User | null = null;
  userId: string | null = null; 
  imageUrl: string = 'https://via.placeholder.com/150';
  showAvatars: boolean = false;
  form: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  arrayStars = Array(10);
  starPath: string = 'assets/icons/star.png';
  selectedStars: number = 0; // Asegúrate de inicializar selectedStars

  selectStar(starNumber: number) {
    this.selectedStars = starNumber;
    console.log(`Selected star: ${starNumber}`);
  }

  constructor() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id'); 
    console.log("Captured userId from route:", this.userId);

    if (this.userId) {
      this.loadUserData(this.userId); 
    } else {
      console.error("User ID not found in route");
      this.router.navigate(['/login']);
    }
  }

  private loadUserData(id: string) {
    this.usersService.findUserById(id).subscribe({
      next: (user: User) => {
        console.log("User found:", user);
        this.user = user;
        this.populateForm(user); 
        this.imageUrl = user.img || this.imageUrl; 
      },
      error: (error: Error) => {
        console.error("User not found:", error);
        this.router.navigate(['/login']);
      }
    });
  }

  private populateForm(user: User) {
    this.form.patchValue({
      username: user.username,
      email: user.email,
      password: '' 
    });
  }

  toggleAvatarSelection() {
    this.showAvatars = !this.showAvatars;
  }

  onAvatarSelected(avatar: Avatar) {
    this.imageUrl = avatar.url;
    localStorage.setItem('profileImage', avatar.url);
    this.showAvatars = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.imageUrl = imageUrl;
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  eliminateUser(id: string | null) {
    if (!id) {
      console.error("Invalid user ID.");
      return;
    }

    this.usersService.deleteUser(id).subscribe({
      next: () => {
        console.log('User successfully deleted');
        this.router.navigate(['/login']);
      },
      error: (e: Error) => {
        console.error("Error deleting user:", e.message);
      }
    });
  }
}*/