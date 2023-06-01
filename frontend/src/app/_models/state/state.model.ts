import { Region } from "../region/region.model";

export class State {
  code: String;
  name: String;
  region: Region;

  constructor(code: String, name: String, region: Region) {
    this.code = code;
    this.name = name;
    this.region = region;
  }
}
