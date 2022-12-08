import { User, Space } from "@prisma/client";
import Repository from "./repository";

export default class SpaceRepository extends Repository {
  public async getSpaces(): Promise<Space[]> {
    return this.execute<Space[]>(async () => {
      return await this._prismaClient.space.findMany({
        orderBy: {
          name: "asc",
        },
      });
    });
  }

  public async getSpaceById(id: number): Promise<Space> {
    return this.execute<Space>(async () => {
      return await this._prismaClient.space.findUnique({
        where: { id },
      });
    });
  }

  public async updateSpace(space: Space): Promise<Space> {
    return this.execute<Space>(async () => {
      return await this._prismaClient.space.update({
        where: { id: space.id },
        data: { ...space },
      });
    });
  }
}
