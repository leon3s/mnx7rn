/**
 * Group Rule interface
 */
declare interface GroupRule {
  id: string;
  group_name: string;
};

/**
 * Argument required to create a GroupRule
 */
declare interface GroupRuleCreateReq {
  group_name: string;
  method: string;
  path: string;
  is_restricted_scope: boolean;
};
