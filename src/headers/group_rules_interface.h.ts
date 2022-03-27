/**
 * Group Rule interface
 */
 export interface GroupRule {
  id: string;
  group_name: string;
};

/**
 * Argument required to create a GroupRule
 */
export interface GroupRuleCreateReq {
  group_name: string;
  method: string;
  path: string;
  is_restricted_scope: boolean;
};
