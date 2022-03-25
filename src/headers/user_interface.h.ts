/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  passwd: string;
  groups: string[];
};

/**
 * Argument required for login
 */
export interface UserLoginReq {
  name: string;
  passwd: string;
};

/**
 * Argument returned from login
 */
export interface UserLoginRes {
  key: string;
};
