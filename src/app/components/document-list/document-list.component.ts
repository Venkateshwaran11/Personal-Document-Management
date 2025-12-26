import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { DocCardComponent } from '../doc-card/doc-card.component';
import { UploadDocComponent } from '../upload-doc/upload-doc.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, DocCardComponent, UploadDocComponent, MatIconModule, TranslateModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  isLoading = true;
  showUploadModal = false;
  editingDoc: any = null; // Track which doc is being edited

  groupBy: 'none' | 'type' | 'date' = 'none';

  constructor(private docService: DocumentService) { }

  ngOnInit() {
    this.loadDocuments();
  }

  setGroupBy(mode: 'none' | 'type' | 'date') {
    this.groupBy = mode;
  }

  get groupedDocuments(): { title: string, docs: any[], colorClass?: string }[] {
    if (this.groupBy === 'none') {
      return [{ title: 'All Documents', docs: this.documents }];
    }

    if (this.groupBy === 'type') {
      const groups: { [key: string]: any[] } = {};
      this.documents.forEach(doc => {
        const type = doc.type || 'Other';
        if (!groups[type]) groups[type] = [];
        groups[type].push(doc);
      });

      return Object.keys(groups).map(type => ({
        title: type,
        docs: groups[type],
        colorClass: type.toLowerCase()
      }));
    }

    if (this.groupBy === 'date') {
      const groups: { [key: string]: any[] } = {};
      this.documents.forEach(doc => {
        const date = new Date(doc.createdAt).toLocaleDateString(); // e.g., 12/26/2025
        if (!groups[date]) groups[date] = [];
        groups[date].push(doc);
      });

      // Sort dates descending
      return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => ({
        title: `Uploaded on ${date}`,
        docs: groups[date]
      }));
    }

    return [];
  }

  loadDocuments() {
    this.isLoading = true;
    this.docService.getDocuments().subscribe({
      next: (docs: any) => {
        this.documents = docs;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load docs', err);
        this.isLoading = false;
      }
    });
  }

  onDocAdded(newDoc: any) {
    this.documents.unshift(newDoc);
    this.closeModal();
  }

  onDocUpdated(updatedDoc: any) {
    const index = this.documents.findIndex(d => d._id === updatedDoc._id);
    if (index !== -1) {
      this.documents[index] = updatedDoc;
    }
    this.closeModal();
  }

  onDelete(id: string) {
    this.docService.deleteDocument(id).subscribe(() => {
      this.documents = this.documents.filter(d => d._id !== id);
    });
  }

  onEdit(doc: any) {
    this.editingDoc = doc;
    this.showUploadModal = true;
  }

  openUpload() {
    this.editingDoc = null;
    this.showUploadModal = true;
  }

  closeModal() {
    this.showUploadModal = false;
    this.editingDoc = null;
  }
}
