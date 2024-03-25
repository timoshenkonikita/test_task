import { Injectable } from '@angular/core';
import { IMeasure } from '../../models/measure.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  private apiUrl

  constructor(private http: HttpClient) { this.apiUrl = "http://localhost:8080/measure" }

  getAllMeasures(): Observable<IMeasure[]> {
    return this.http.get<IMeasure[]>(`${this.apiUrl}/`);
  }

  getMeasureByID(id: number): Observable<IMeasure> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<IMeasure>(url);
  }

  createMeasure(measure: IMeasure): Observable<IMeasure> {
    console.log(measure)
    return this.http.post<IMeasure>(`${this.apiUrl}/`, measure);
  }

  updateMeasure(measure: IMeasure): Observable<IMeasure> {
    const url = `${this.apiUrl}/${measure.id}`;
    return this.http.put<IMeasure>(url, measure);
  }

  deleteMeasure(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
