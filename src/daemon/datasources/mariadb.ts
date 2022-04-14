import mariadb from 'mariadb';

class SQLDB {
  private pool?: mariadb.Pool;
  private conn?: mariadb.PoolConnection;
  constructor(
    private opts: mariadb.PoolConfig,
  ) {}
  
  connect = async () => {
    this.pool = mariadb.createPool(this.opts);
    this.pool.execute('use nanocl');
    this.conn = await this.pool.getConnection();
  }

  query = (query: string | mariadb.QueryOptions, value?: any) => {
    if (!this.conn) throw new Error('Error no connection enable please call .connect() method');
    return this.conn.query(query, value);
  }

  close = async () => {
    await this.conn?.end();
    await this.pool?.end();
  }
}

const sqldb = new SQLDB({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
});

export type SqlDB = InstanceType<typeof SQLDB>;

export default sqldb;
