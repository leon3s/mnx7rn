import path from "path";

import {Store, Model, ModelItem} from '../../src/deamon/services/store';

type ModelTest = ModelItem<{ name: string }>;

let store: Store;
let model_test: Model<ModelTest>;
let model_item: ModelTest;

describe('[STORE]', () => {
  it('invoke new Store("./test_store")', () => {
    store = new Store(path.resolve("./test_store"));
  });

  it('invoke store.mount()', async () => {
    await store.mount();
  });

  it('invoke store.model_create("test-model")', () => {
    model_test = store.model_create('test-model');
  });

  it('invoke model_test.create({name: "test"})', async () => {
    model_item = await model_test.create({
      name: 'test',
    });
    expect(model_item.id).toBeDefined();
    expect(model_item.name).toBe('test');
  });

  it('invoke model_test.find_by_id()', async () => {
    const m = await model_test.find_by_id(model_item.id);
    expect(m).toStrictEqual(model_item);
  });

  it('invoke model_test.find()', async () => {
    const model_items = await model_test.find();
    expect(model_items.length).toBe(1);
    expect(model_items[0]).toStrictEqual(model_item);
  });

  it(`invoke model_test.delete_by_id()`, async () => {
    await model_test.delete_by_id(model_item.id);
  });

  it('invoke model_test.find_by_id()', async () => {
    await model_test.find_by_id(model_item.id).catch((err) => {
      expect(err.errno).toBe(-2);
      expect(err.code).toBe('ENOENT');
      expect(err.syscall).toBe('open');
    });
  });

  it('invoke store.umount()', async () => {
    await store.umount();
  })
});
