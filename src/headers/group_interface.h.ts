/**
 * Group interface
 */
 export interface Group {
  id: string;
  name: string;
};

/**
 * Argument to create a Group
 */
export interface GroupCreateReq {
  name: string;
};
