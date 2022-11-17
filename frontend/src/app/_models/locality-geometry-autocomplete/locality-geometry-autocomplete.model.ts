import { City, LocalityGeometry, Region, State } from "../";
import { Deserializable } from "../deserializable.model";

export class LocalityGeometryAutocomplete
  extends LocalityGeometry
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
    Object.assign(this, new LocalityGeometry().deserialize(input));

    this.code = input.id;
    this.name = input.name;

    if (this.regionId) {
      this.region = new Region(this.regionId, this.regionName);
    }

    if (this.stateId && this.region) {
      this.state = new State(this.stateId, this.stateName, this.region)
    }

    if (this.cityId && this.state) {
      this.city = new City(this.cityId.toString(), this.cityName.toString(), this.state);
    }

    return this;
  }

  get getText() {
    let names = [] as Array<string>;
    if (this.cityName && this.cityName.length > 0) {
      names.push(this.cityName.toString());
    }

    if (this.stateName && this.stateName.length > 0) {
      names.push(this.stateName.toString());
    }

    if (this.regionName && this.regionName.length > 0) {
      names.push(this.regionName.toString());
    }

    console.log(names);

    return names.join(', ');
  }
}
