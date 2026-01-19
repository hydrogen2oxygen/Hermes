import { TestBed } from '@angular/core/testing';

import { AnkiImportService } from './anki-import.service';

describe('AnkiImportService', () => {
  let service: AnkiImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnkiImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
