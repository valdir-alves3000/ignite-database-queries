import { getRepository, Repository } from "typeorm";

import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // ORM
    const user = await this.repository.findOne(
      { id: user_id },
      { relations: ["games"] }
    );

    if (!user) throw new Error("User does not exists!");

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    // Raw query
    return await this.repository.query(
      "SELECT * FROM users ORDER BY first_name"
    );
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Raw query
    return await this.repository.query(
      `SELECT * FROM  users WHERE UPPER(first_name)=UPPER('${first_name}') AND UPPER(last_name)=UPPER('${last_name}')`
    );
  }
}
