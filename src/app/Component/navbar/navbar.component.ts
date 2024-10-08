import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceAuthService } from '../../service/service-auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  selectedCompany: any = null; // Store the selected company
  companies: any[] = []; // Store the list of companies

  constructor(
    private router: Router,
    private serviceAuthService: ServiceAuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCompanies();

    // Check if a company ID is passed via route params
    this.route.params.subscribe(params => {
      const companyId = params['id'];
      if (companyId) {
        this.getCompanyById(companyId); // Load the company if an ID is provided
      } else {
        this.selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || 'null');
      }
    });
  }

  loadCompanies() {
    this.serviceAuthService.getAllCompanies().subscribe((data: any) => {
      this.companies = data; // Store the list of companies
     
    }, error => {
      console.error('Error loading companies:', error);
      this.toastr.error('Failed to load companies.');
    });
  }

  getCompanyById(id: string) {
    this.serviceAuthService.getCompanyById(id).subscribe((data: any) => {
      this.selectedCompany = data; // Store the selected company
      localStorage.setItem('selectedCompany', JSON.stringify(data)); // Store selected company in local storage
      this.toastr.success('Company details loaded!');
    }, error => {
      console.error('Error loading company by ID:', error);
      this.toastr.error('Failed to load company details.');
    });
  }

  goToCompanyProfile() {
    if (this.selectedCompany && this.selectedCompany._id) {
      this.router.navigate(['/company-profile', this.selectedCompany._id]); // Navigate to the selected company profile
    } else {
      console.error('No selected company available to navigate to.');
    }
  }
}