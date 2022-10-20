import { State } from "./state.model";

export class City {
  code: string;
  name: string;
  state: State;

  constructor(code: string, name: string, state: State) {
    this.code = code;
    this.name = name;
    this.state = state;
  }
}
