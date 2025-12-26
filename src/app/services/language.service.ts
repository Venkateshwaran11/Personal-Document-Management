import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
    code: string;
    name: string;
    flag: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
        { code: 'te', name: 'Telugu', flag: '🇮🇳' },
        { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
        { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
        { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
        { code: 'gu', name: 'Gujarati', flag: '🇮🇳' }
    ];

    private currentLangSubject!: BehaviorSubject<string>;
    currentLang$!: Observable<string>;

    constructor(private translate: TranslateService) {
        const initialLang = this.getInitialLang();
        this.currentLangSubject = new BehaviorSubject<string>(initialLang);
        this.currentLang$ = this.currentLangSubject.asObservable();

        this.translate.addLangs(this.languages.map(l => l.code));
        this.translate.use(initialLang);
    }

    getLanguages(): Language[] {
        return this.languages;
    }

    setLanguage(langCode: string) {
        this.translate.use(langCode);
        localStorage.setItem('preferredLang', langCode);
        this.currentLangSubject.next(langCode);
        // Reload page to apply some translations if needed, 
        // but ngx-translate usually handles it reactively
    }

    private getInitialLang(): string {
        const saved = localStorage.getItem('preferredLang');
        if (saved) return saved;

        const browserLang = this.translate.getBrowserLang();
        return this.languages.find(l => l.code === browserLang) ? browserLang! : 'en';
    }
}
