import { Region } from "../region/region.model";
import { State } from "./state.model";

describe('Model: State', () => {

  it('should initialize all properties correctly', () => {
    const region = new Region('region_code', 'region_name');
    const state = new State('state_code', 'state_name', region);

    expect(state.code).toEqual('state_code');
    expect(state.name).toEqual('state_name');
    expect(state.region).toEqual(region);
  })
});