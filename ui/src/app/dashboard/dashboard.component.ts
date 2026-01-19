import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { AnkiImportService, DeckInfo } from '../services/anki-import.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  decks: DeckInfo[] = [];
  isLoading = false;
  isDragOver = false;
  uploadProgress = 0;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private ankiImportService: AnkiImportService) {}

  ngOnInit(): void {
    this.loadDecks();
  }

  async loadDecks(): Promise<void> {
    try {
      this.decks = await this.ankiImportService.getDecks().toPromise() || [];
    } catch (error) {
      console.error('Error loading decks:', error);
      this.errorMessage = 'Failed to load decks. Please try again.';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      await this.handleFileUpload(file);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];
      await this.handleFileUpload(file);
    }
  }

  async handleFileUpload(file: File): Promise<void> {
    // Check if the file is an Anki deck
    if (!file.name.endsWith('.apkg')) {
      this.errorMessage = 'Please select a valid Anki deck file (.apkg)';
      return;
    }

    this.isLoading = true;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      // Subscribe to the observable to handle the import process
      const importObservable = this.ankiImportService.importAnkiDeck(file);

      importObservable.subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calculate upload progress percentage
            if (event.total) {
              this.uploadProgress = Math.round(100 * event.loaded / event.total);
            }
          } else if (event.type === HttpEventType.Response) {
            // Request completed successfully
            this.successMessage = 'Deck imported successfully!';
            this.loadDecks(); // Refresh the deck list
          }
        },
        error: (error) => {
          console.error('Error importing deck:', error);
          this.errorMessage = 'Failed to import deck. Please try again.';
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error importing deck:', error);
      this.errorMessage = 'Failed to import deck. Please try again.';
      this.isLoading = false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
