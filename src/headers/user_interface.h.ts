/**
 * User interface
 */
declare interface User {
  id: string;
  name: string;
  passwd: string;
  groups: string[];
};

/**
 * Argument required for login
 */
declare interface UserLoginReq {
  name: string;
  passwd: string;
};

/**
 * Argument returned from login
 */
declare interface UserLoginRes {
  key: string;
};
