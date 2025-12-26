import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-doc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, TranslateModule],
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnChanges {
  @Input() editData: any = null;
  @Output() docAdded = new EventEmitter<any>();
  @Output() docUpdated = new EventEmitter<any>();

  uploadForm: FormGroup;
  isLoading = false;
  selectedFileBase64: string | null = null;

  docTypes = ['Aadhar', 'PAN', 'Passport', 'VoterID', 'Driving License', 'Ration Card', 'University', 'Insurance', 'Other'];

  constructor(private fb: FormBuilder, private docService: DocumentService) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      type: ['Aadhar', Validators.required],
      docNumber: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && this.editData) {
      this.uploadForm.patchValue({
        title: this.editData.title,
        type: this.editData.type,
        docNumber: this.editData.docNumber
      });
      this.selectedFileBase64 = this.editData.fileUrl || null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.isLoading = true;
      const formData = {
        ...this.uploadForm.value,
        fileUrl: this.selectedFileBase64
      };

      if (this.editData) {
        this.docService.updateDocument(this.editData._id, formData).subscribe({
          next: (updatedDoc: any) => {
            this.isLoading = false;
            this.docUpdated.emit({ ...this.editData, ...formData });
            this.resetForm();
          },
          error: (err: any) => {
            console.error(err);
            this.isLoading = false;
            alert('Failed to update document');
          }
        });
      } else {
        this.docService.addDocument(formData).subscribe({
          next: (newDoc: any) => {
            this.isLoading = false;
            this.docAdded.emit(newDoc);
            this.resetForm();
          },
          error: (err: any) => {
            console.error(err);
            this.isLoading = false;
            alert('Failed to add document');
          }
        });
      }
    }
  }

  resetForm() {
    this.uploadForm.reset({ type: 'Aadhar' });
    this.selectedFileBase64 = null;
  }
}
