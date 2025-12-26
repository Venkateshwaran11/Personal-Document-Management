import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule, TranslateModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    users: any[] = [];
    stats: any = null;
    isLoading = true;
    activeTab: 'users' | 'stats' = 'users';

    // Processed trends
    processedDocTrend: any[] = [];
    processedContactTrend: any[] = [];

    // Editing state
    editUserId: string | null = null;
    editingUser: any = null;

    constructor(private adminService: AdminService, private router: Router) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        if (this.activeTab === 'users') {
            this.adminService.getUsers().subscribe({
                next: (data) => {
                    this.users = data;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                }
            });
        } else {
            this.adminService.getStats().subscribe({
                next: (data) => {
                    this.stats = data;
                    this.processedDocTrend = this.processTrend(data.trends?.documents);
                    this.processedContactTrend = this.processTrend(data.trends?.contacts);
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                }
            });
        }
    }

    processTrend(trendData: any[]): any[] {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const found = trendData?.find(t => t._id === dateStr);
            result.push({
                _id: dateStr,
                count: found ? found.count : 0
            });
        }
        return result;
    }

    setTab(tab: 'users' | 'stats') {
        this.activeTab = tab;
        this.loadData();
    }

    startEdit(user: any) {
        this.editUserId = user._id;
        this.editingUser = { ...user };
    }

    cancelEdit() {
        this.editUserId = null;
        this.editingUser = null;
    }

    saveUser() {
        if (!this.editingUser) return;
        this.adminService.updateUser(this.editUserId!, this.editingUser).subscribe({
            next: (updated) => {
                const index = this.users.findIndex(u => u._id === this.editUserId);
                if (index !== -1) {
                    this.users[index] = updated;
                }
                this.cancelEdit();
            },
            error: (err) => {
                console.error(err);
                if (err.error?.message) {
                    alert(err.error.message);
                } else {
                    alert('Failed to update user');
                }
            }
        });
    }

    toggleAdmin(user: any) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const msg = newRole === 'admin' ? 'APP.MAKE_ADMIN' : 'APP.REVOKE_ADMIN';

        // Using confirm here for simplicity as per plan
        if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            this.adminService.updateUser(user._id, { role: newRole }).subscribe({
                next: (updated) => {
                    const index = this.users.findIndex(u => u._id === user._id);
                    if (index !== -1) {
                        this.users[index] = updated;
                    }
                },
                error: (err) => {
                    console.error(err);
                    if (err.error?.message) {
                        alert(err.error.message);
                    }
                }
            });
        }
    }

    deleteUser(id: string) {
        if (confirm('Are you sure? This will delete the user and ALL their related data permanently.')) {
            this.adminService.deleteUser(id).subscribe({
                next: () => {
                    this.users = this.users.filter(u => u._id !== id);
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
    }

    getTrendMax(trend: any[]): number {
        if (!trend || trend.length === 0) return 1;
        return Math.max(...trend.map(t => t.count), 1);
    }

    getTrendPercentage(count: number, max: number): number {
        if (max === 0) return 0;
        return (count / max) * 100;
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}
