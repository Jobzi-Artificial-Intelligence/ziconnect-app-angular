import { City, LocalityMap, Region, State } from "..";
import { Deserializable } from "../deserializable.model";

export class LocalityMapAutocomplete
  extends LocalityMap
  implements Deserializable {
  code: string;
  name: string;

  constructor() {
    super();
    this.code = '';
    this.name = '';
  }

  deserialize(input: any): this {
    Object.assign(this, new LocalityMap().deserialize(input));

    this.code = input.id;
    this.name = input.name;

    return this;
  }

  get getText() {
    let names = [] as Array<string>;
    if (this.municipalityName && this.municipalityName.length > 0) {
      names.push(this.municipalityName.toString());
    }

    if (this.stateName && this.stateName.length > 0) {
      names.push(this.stateName.toString());
    }

    if (this.regionName && this.regionName.length > 0) {
      names.push(this.regionName.toString());
    }

    return names.join(', ');
  }
}
