import type {SqlDB} from '../datasources/mariadb';

class UserService {
  sqlDB: SqlDB;

  constructor(sqlDB: SqlDB) {
    this.sqlDB = sqlDB;
  }

  login = (user: UserLoginReq) => {
    this.sqlDB.query(`SELECT * from user WHERE name = :name AND password = :password`, {
      name: user.name,
      password: user.passwd,
    })
  }
}
