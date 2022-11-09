import { City } from "./city.model";
import { Region } from "../region/region.model";
import { State } from "../state/state.model";

describe('Model: City', () => {

  it('should initialize all properties correctly', () => {
    const region = new Region('region_code', 'region_name');
    const state = new State('state_code', 'state_name', region);
    const city = new City('city_code', 'city_name', state)

    expect(city.code).toEqual('city_code');
    expect(city.name).toEqual('city_name');
    expect(city.state).toEqual(state);
  });
});