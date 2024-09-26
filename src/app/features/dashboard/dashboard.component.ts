import { Component, OnInit } from '@angular/core';
import { ServiceAuthService } from '../../service/service-auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  companies: any[] = [];
  users: any[] = []; // Initialize users array
  newCompany: any = {};
  newUser: any = {
    name: '',
    email: '',
    role: '',
    companyId: '',
    password: '',
    permissions: {
      truckList: {
        create: false,
        read: false,
        update: false,
        delete: false
      }
      // Add other permissions as needed
    }
  };

  constructor(
    private serviceAuthService: ServiceAuthService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCompany();
    this.loadUsers(); // Load users on component initialization
  }


  loadCompany() {
    this.serviceAuthService.getAllCompanies().subscribe((data: any) => {
      this.companies = data;
      this.cdr.detectChanges(); // Trigger change detection
      this.toastr.success('Companies loaded successfully!'); // Success Toastr
    }, error => {
      console.error('Error loading companies:', error);
      this.toastr.error('Failed to load companies.'); // Error Toastr
    });
  }

  loadUsers() {
    this.serviceAuthService.getUsersFromAPI().subscribe((data: any) => {
      this.users = data; // Assign fetched users to the users array
      this.cdr.detectChanges(); // Trigger change detection
    }, (error: any) => { // Specify 'any' type here
      console.error('Error loading users:', error);
      this.toastr.error('Failed to load users.'); // Error Toastr
    });
  }

  
  registerNewUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.companyId) {
      this.toastr.error('Please fill all required fields.');
      return;
    }

    this.serviceAuthService.registerUser(this.newUser).subscribe((response: any) => {
      console.log('User registered successfully:', response);
      this.toastr.success('User registered successfully!');
      this.loadUsers(); // Reload users after registration
      this.resetNewUser(); // Reset form after submission
    }, (error: any) => {
      console.error('Error registering user:', error);
      this.toastr.error('Error registering user.');
    });
  }

  resetNewUser() {
    this.newUser = {
      name: '',
      email: '',
      role: '',
      companyId: '',
      password: '',
      permissions: {
        truckList: {
          create: false,
          read: false,
          update: false,
          delete: false
        }
      }
    };
  }

  editUser(user: any) {
    // Logic to edit the user
    console.log('Editing user:', user);
    // You can open a modal or populate the newUser object for editing
  }

  deleteUser(user: any) {
    this.serviceAuthService.deleteUser(user._id).subscribe(() => {
      this.toastr.success('User deleted successfully!');
      this.loadUsers(); // Reload users after deletion
    }, (error: any) => { // Specify 'any' type here
      console.error('Error deleting user:', error);
      this.toastr.error('Error deleting user.');
    });
  }

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.newCompany[key] = file;
    }
  }

  submitForm(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.control.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });

      this.toastr.error('Please correct the highlighted fields before submitting.', 'Form Submission Error');
      return;
    }
    const formData = new FormData();
    Object.keys(this.newCompany).forEach(key => {
      formData.append(key, this.newCompany[key]);
    });

    this.serviceAuthService.createCompany(formData).subscribe((response: any) => {
      console.log('Company created successfully:', response);
      this.toastr.success('Company created successfully!');
      this.loadCompany(); // Reload companies after creation
      this.newCompany = {};
    }, (error: any) => {
      console.error('Error creating company:', error);
      this.toastr.error('Error creating company.');
    });
  }
}
