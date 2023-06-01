import { Region } from "./region.model";

describe('Model: Region', () => {

  it('should initialize all properties correctly', () => {
    const region = new Region('region_code', 'region_name');

    expect(region.code).toEqual('region_code');
    expect(region.name).toEqual('region_name');
  })
});