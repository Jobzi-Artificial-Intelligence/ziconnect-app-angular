import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AlertService } from "./alert.service";

describe('AlertService', () => {
  let alertService: AlertService;

  const mockMatSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: MatSnackBar, useValue: mockMatSnackBar }] });

    alertService = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(alertService).toBeTruthy();
  });

  it('all function should exists', () => {
    expect(alertService.showSuccess).toBeDefined();
    expect(alertService.showError).toBeDefined();
    expect(alertService.showWarning).toBeDefined();
  });

  describe('Testing Functions', () => {
    it('showSuccess should works', () => {
      const message = 'Success Message!';

      alertService.showSuccess(message);

      //@ts-ignore
      expect(alertService._snackBar.open).toHaveBeenCalledWith(
        message, undefined, {
        duration: 1000 * alertService.durationInSeconds,
        panelClass: 'success'
      });
    });

    it('showError should works', () => {
      const message = 'Error Message!';

      alertService.showError(message);

      //@ts-ignore
      expect(alertService._snackBar.open).toHaveBeenCalledWith(
        message, undefined, {
        duration: 1000 * alertService.durationInSeconds,
        panelClass: 'danger'
      });
    });

    it('showWarning should works', () => {
      const message = 'Warning Message!';

      alertService.showWarning(message);

      //@ts-ignore
      expect(alertService._snackBar.open).toHaveBeenCalledWith(
        message, undefined, {
        duration: 1000 * alertService.durationInSeconds,
        panelClass: 'warning'
      });
    });
  });
});