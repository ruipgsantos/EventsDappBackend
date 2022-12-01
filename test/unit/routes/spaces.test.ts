import request from "supertest";
import app from "../../src/app";
import { Space } from "@prisma/client";
import SpaceRepository from "../../src/db/repositories/space.repository";

//TODO: error scenarios
describe("Spaces Routes", () => {
  let mockSpace: Space = {
    id: 1000,
    location: "Mock Street 22",
    name: "Mock Space",
    userId: 2000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Returns Space", async () => {
    const getSpaceByIdSpy = jest
      .spyOn(SpaceRepository.prototype, "getSpaceById")
      .mockImplementation((id: number): Promise<Space> => {
        return new Promise<Space>((res) => {
          if (id !== mockSpace.id) throw Error();
          return res(mockSpace);
        });
      });

    await request(app)
      .get(`/spaces/${mockSpace.id}`)
      .expect(200)
      .then((response) => expect(response.body).toEqual(mockSpace));

    expect(getSpaceByIdSpy).toHaveBeenCalledTimes(1);
  });

  it("Returns updated Space", async () => {
    let mockSpace: Space = {
      id: 1000,
      location: "Mock Street 22",
      name: "Mock Space",
      userId: 2000,
    };

    const updateSpaceSpy = jest
      .spyOn(SpaceRepository.prototype, "updateSpace")
      .mockImplementation((): Promise<Space> => {
        return new Promise<Space>((res) => {
          return res(mockSpace);
        });
      });

    await request(app)
      .put(`/spaces`)
      .expect(200)
      .then((response) => expect(response.body).toEqual(mockSpace));

    expect(updateSpaceSpy).toHaveBeenCalledTimes(1);
  });
});
