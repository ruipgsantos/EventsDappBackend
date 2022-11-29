import Repository from "./repository";
import { User } from "@prisma/client";

export default class UserRepository extends Repository {
  public async getOrCreateUser(address: string): Promise<User> {
    const user = await this.getUser(address);

    //user already exists
    if (user) return user;

    //user does not exist and has no space associated
    return this.onboardUser(address);
  }

  private async onboardUser(address: string): Promise<User> {
    return await this.execute<User>(async (): Promise<User> => {
      return this._prismaClient.user.create({
        data: { address, Space: { create: { name: address, location: "" } } },
      });
    });
  }

  //TODO: enforce wallet address type
  public async getUser(address: string): Promise<User> {
    return this.execute<User>(async () => {
      return this._prismaClient.user.findUnique({
        where: { address },
      });
    });
  }

  public async createUser(user: User): Promise<User> {
    return this.execute<User>(async () => {
      return this._prismaClient.user.create({
        data: user,
      });
    });
  }

  public async updateUser(user: User): Promise<User> {
    return this.execute<User>(async () => {
      return this._prismaClient.user.update({
        where: { id: user.id },
        data: user,
      });
    });
  }
}
