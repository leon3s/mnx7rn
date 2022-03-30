/**
 * Group interface
 */
declare interface Group {
  id: string;
  name: string;
};

/**
 * Argument to create a Group
 */
declare type GroupCreateReq = {
  name: string;
};
