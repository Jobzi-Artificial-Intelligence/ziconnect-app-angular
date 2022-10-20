import { AbstractControl } from "@angular/forms";

export function AutocompleteRequireMatch(control: AbstractControl) {
  const selection: any = control.value;
  if (control.value) {
    if (typeof selection === "string") {
      return { incorrect: true };
    }
  }

  return null;
}
