import mariadb from 'mariadb';

class SQLDB {
  private pool: mariadb.Pool;
  private conn?: mariadb.PoolConnection;

  constructor(opts: mariadb.PoolConfig) {
    this.pool = mariadb.createPool(opts);
  }

  connect = async () => {
    this.conn = await this.pool.getConnection();
  }

  query = (query: string | mariadb.QueryOptions, value?: any) => {
    if (!this.conn) throw new Error('Error no connection enable please call .connect() method');
    return this.conn.query(query, value);
  }
}

const sqldb = new SQLDB({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
});

export default sqldb;
