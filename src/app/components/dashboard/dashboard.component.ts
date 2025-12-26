import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { DocumentListComponent } from '../document-list/document-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService, Language } from '../../services/language.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DocumentListComponent,
    ContactListComponent,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    UserProfileComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any;
  languages: Language[] = [];
  currentLang$: Observable<string>;
  activeView: 'docs' | 'contacts' = 'docs';

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.currentLang$ = this.languageService.currentLang$;
    this.languages = this.languageService.getLanguages();
    this.authService.currentUser$.subscribe(userData => {
      this.user = userData;
    });
  }

  changeLanguage(langCode: string) {
    this.languageService.setLanguage(langCode);
  }

  switchView(view: 'docs' | 'contacts') {
    this.activeView = view;
  }

  showProfile() {
    this.dialog.open(UserProfileComponent, {
      data: this.user,
      width: '400px'
    });
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
