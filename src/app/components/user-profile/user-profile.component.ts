import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, ImageCropperComponent, TranslateModule],
    template: `
    <div class="profile-modal">
        <div class="profile-header" *ngIf="!imageChangedEvent">
            <div class="avatar-container">
                <img [src]="data.profileImage || ('https://ui-avatars.com/api/?name=' + data.username + '&background=2563eb&color=fff&bold=true&size=128')" 
                     class="large-avatar" alt="Avatar">
                <button class="edit-avatar-btn" (click)="fileInput.click()" [disabled]="isUploading" [title]="'APP.PROFILE.CHANGE_PHOTO' | translate">
                    <mat-icon>{{ isUploading ? 'sync' : 'camera_alt' }}</mat-icon>
                </button>
            </div>
            <input type="file" #fileInput style="display: none" (change)="onFileSelected($event)" accept="image/*">
            
            <h2>{{ data.username }}</h2>
            <span class="role-badge" [class.admin]="data.role === 'admin'">{{ data.role }}</span>
        </div>

        <!-- Cropper Section -->
        <div class="cropper-section" *ngIf="imageChangedEvent">
            <h3>{{ 'APP.PROFILE.CROP_TITLE' | translate }}</h3>
            <image-cropper
                [imageChangedEvent]="imageChangedEvent"
                [maintainAspectRatio]="true"
                [aspectRatio]="1 / 1"
                format="webp"
                (imageCropped)="imageCropped($event)"
                [roundCropper]="true"
                style="max-height: 300px;"
            ></image-cropper>
            
            <div class="cropper-actions">
                <button mat-button (click)="cancelCrop()">{{ 'APP.PROFILE.CANCEL' | translate }}</button>
                <button mat-flat-button color="primary" (click)="saveCroppedImage()" [disabled]="isUploading">
                    <mat-icon *ngIf="isUploading" class="spin">sync</mat-icon>
                    {{ (isUploading ? 'APP.PROFILE.SAVING' : 'APP.PROFILE.SAVE_PHOTO') | translate }}
                </button>
            </div>
        </div>
        
        <div class="profile-body" *ngIf="!imageChangedEvent">
            <div class="info-item">
                <mat-icon>email</mat-icon>
                <div class="details">
                    <label>{{ 'APP.PROFILE.EMAIL' | translate }}</label>
                    <p>{{ data.email || ('APP.PROFILE.NOT_PROVIDED' | translate) }}</p>
                </div>
            </div>
            
            <div class="info-item">
                <mat-icon>verified_user</mat-icon>
                <div class="details">
                    <label>{{ 'APP.PROFILE.STATUS' | translate }}</label>
                    <p>{{ 'APP.PROFILE.VERIFIED' | translate }}</p>
                </div>
            </div>
        </div>

        <div class="profile-footer" *ngIf="!imageChangedEvent">
            <button mat-flat-button color="primary" (click)="close()">{{ 'APP.PROFILE.CLOSE' | translate }}</button>
        </div>
    </div>
  `,
    styles: [`
    .profile-modal {
        padding: 1rem;
        min-width: 320px;
    }
    .profile-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
        text-align: center;
    }
    .avatar-container {
        position: relative;
        margin-bottom: 1rem;
    }
    .large-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #f8fafc;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        object-fit: cover;
    }
    .edit-avatar-btn {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, background-color 0.2s;
    }
    .edit-avatar-btn:hover:not(:disabled) {
        transform: scale(1.1);
        background-color: var(--primary-dark, #1e40af);
    }
    .edit-avatar-btn:disabled {
        opacity: 0.7;
        cursor: wait;
    }
    .edit-avatar-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
    }
    h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-main);
    }
    .role-badge {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        background: #e2e8f0;
        padding: 4px 12px;
        border-radius: 20px;
        margin-top: 0.5rem;
        color: var(--text-muted);
    }
    .role-badge.admin {
        background: #dbeafe;
        color: #1e40af;
    }

    /* Cropper Styles */
    .cropper-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0;
    }
    .cropper-section h3 {
        margin: 0;
        text-align: center;
        color: var(--text-main);
    }
    .cropper-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    .spin {
        animation: rotate 2s linear infinite;
    }
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .profile-body {
        margin-bottom: 1rem;
    }
    .info-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        align-items: center;
    }
    .info-item mat-icon {
        color: #64748b;
    }
    .details label {
        display: block;
        font-size: 0.75rem;
        color: #94a3b8;
        font-weight: 600;
        margin-bottom: 2px;
    }
    .details p {
        margin: 0;
        color: var(--text-main);
        font-weight: 500;
    }
    .profile-footer {
        display: flex;
        justify-content: center;
    }
  `]
})
export class UserProfileComponent {
    isUploading = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    croppedImageBase64: any = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<UserProfileComponent>,
        private authService: AuthService
    ) { }

    onFileSelected(event: any) {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.objectUrl || event.base64;
        this.croppedImageBase64 = event.base64;
    }

    cancelCrop() {
        this.imageChangedEvent = '';
        this.croppedImage = '';
        this.croppedImageBase64 = '';
    }

    saveCroppedImage() {
        if (!this.croppedImageBase64) return;

        this.isUploading = true;
        this.authService.updateProfile({ profileImage: this.croppedImageBase64 }).subscribe({
            next: (updatedUser) => {
                this.data.profileImage = this.croppedImageBase64;
                this.isUploading = false;
                this.cancelCrop();
            },
            error: (err) => {
                console.error(err);
                this.isUploading = false;
                alert('Failed to update profile image');
            }
        });
    }

    close() {
        this.dialogRef.close();
    }
}
