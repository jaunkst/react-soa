// Valid query operators. If its not in this enum a DTO
// will reject any data at validation time that defines them.
export enum VALID_QUERY_OPERATORS {
  EQ = '=',
  GT = '>',
  LT = '<',
  GTE = '>=',
  LTE = '<=',
  NOT = '!=',
}

// This enum is also used in DTO validators .
export enum ORDER_BY {
  ASC = 'ASC',
  DESC = 'DESC',
}
