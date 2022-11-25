import { City, LocalityMap, Region, State } from "..";
import { Deserializable } from "../deserializable.model";

export class LocalityMapAutocomplete
  extends LocalityMap
  implements Deserializable {
  code: string;
  name: string;

  city?: City;
  state?: State;
  region?: Region;

  constructor() {
    super();
    this.code = '';
    this.name = '';
  }

  deserialize(input: any): this {
    Object.assign(this, new LocalityMap().deserialize(input));

    this.code = input.id;
    this.name = input.name;

    if (this.regionCode) {
      this.region = new Region(this.regionCode, this.regionName);
    }

    if (this.stateCode && this.region) {
      this.state = new State(this.stateCode, this.stateName, this.region)
    }

    if (this.municipalityCode && this.state) {
      this.city = new City(this.municipalityCode.toString(), this.municipalityName.toString(), this.state);
    }

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
