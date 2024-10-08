import { Component, OnInit } from '@angular/core';
import { ServiceAuthService } from '../../service/service-auth.service';


@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.css'


})
export class FileManagerComponent implements OnInit {
  files: any[] = [];
  newFile: any = {};

  constructor(private serviceAuthService: ServiceAuthService) { }

  ngOnInit(): void {
    this.getFilesFromAPI();
  }

  getFilesFromAPI() {
    this.serviceAuthService.getFilesFromAPI()
      .subscribe((data: any) => {
        this.files = data;
      }, error => {
        console.error(error);
      });
  }
  getStars(rating: number): Array<number> {
    return new Array(rating);
  }

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.newFile[key] = file;
    } else {
      this.newFile[key] = null;
    }
  }
  
  submitForm() {
    console.log('Submitting form...');
    console.log('New File Data:', this.newFile);
    const formData = new FormData();
    Object.keys(this.newFile).forEach(key => {
      formData.append(key, this.newFile[key]);
    });
    this.serviceAuthService.createFile(formData)
      .subscribe((response: any) => {
        console.log('File created successfully:', response);
        // Optionally, refresh the file list
        this.getFilesFromAPI();
        // Clear the form after submission
        this.newFile = {};
      }, error => {
        console.error('Error creating file:', error);
      });
  }
}



