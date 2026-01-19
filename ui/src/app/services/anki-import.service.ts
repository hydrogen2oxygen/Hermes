import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface DeckInfo {
  id: string;
  name: string;
  description?: string;
  cardCount: number;
  lessonCount: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AnkiImportService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  importAnkiDeck(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/import/anki`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getDecks(): Observable<DeckInfo[]> {
    return this.http.get<{decks: DeckInfo[]}>(`${this.apiUrl}/decks`).pipe(
      map(response => response.decks || []),
      catchError(error => {
        console.error('Error fetching decks:', error);
        return of([]);
      })
    );
  }

  checkDatabaseStatus(): Observable<boolean> {
    return this.http.get<{status: boolean}>(`${this.apiUrl}/health`).pipe(
      map(response => response.status),
      catchError(error => {
        console.error('Error checking database status:', error);
        return of(false);
      })
    );
  }
}
