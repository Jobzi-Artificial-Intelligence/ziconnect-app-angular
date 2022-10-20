import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Display snackbar success message
   * @param message string message
   */
  showSuccess(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 1000 * this.durationInSeconds,
      panelClass: 'success',
    });
  }

  /**
   * Display snackbar error message
   * @param message string message
   */
  showError(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 1000 * this.durationInSeconds,
      panelClass: 'danger',
    });
  }

  /**
   * Display snackbar warning message
   * @param message string message
   */
  showWarning(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 1000 * this.durationInSeconds,
      panelClass: 'danger',
    });
  }
}
