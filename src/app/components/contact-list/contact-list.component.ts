import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService, Contact } from '../../services/contact.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactDialogComponent } from './contact-dialog.component';

@Component({
    selector: 'app-contact-list',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, FormsModule, TranslateModule, ContactDialogComponent],
    templateUrl: './contact-list.component.html',
    styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
    contacts: Contact[] = [];
    isLoading = true;
    searchQuery = '';

    constructor(private contactService: ContactService, private dialog: MatDialog) { }

    ngOnInit() {
        this.loadContacts();
    }

    loadContacts() {
        this.isLoading = true;
        this.contactService.getContacts().subscribe({
            next: (data) => {
                this.contacts = data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    get filteredContacts() {
        return this.contacts.filter(c =>
            c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            c.mobileNumber.includes(this.searchQuery)
        );
    }

    addContact() {
        const dialogRef = this.dialog.open(ContactDialogComponent, {
            width: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.contactService.addContact(result).subscribe(() => this.loadContacts());
            }
        });
    }

    editContact(contact: Contact) {
        const dialogRef = this.dialog.open(ContactDialogComponent, {
            width: '400px',
            data: contact
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.contactService.updateContact(contact._id!, result).subscribe(() => this.loadContacts());
            }
        });
    }

    deleteContact(id: string) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contactService.deleteContact(id).subscribe(() => this.loadContacts());
        }
    }
}
