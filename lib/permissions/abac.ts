import { UserType, Action } from '@/types/enums';
import type { User, Permission, College, University, Section } from '@/types';
import { Resource } from './rbac';

// Attribute types for ABAC
export interface UserAttributes {
  id: string;
  role: UserType;
  email: string;
  collegeId?: string;
  universityId?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ResourceAttributes {
  id: string;
  type: string;
  ownerId?: string;
  collegeId?: string;
  universityId?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnvironmentAttributes {
  time: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

// ABAC Policy Rule
export interface ABACPolicyRule {
  id: string;
  name: string;
  description?: string;
  effect: 'ALLOW' | 'DENY';
  conditions: ABACCondition[];
  actions: Action[];
  resources: Resource[];
  priority: number; // Higher number = higher priority
}

// ABAC Condition
export interface ABACCondition {
  attribute: string; // e.g., 'user.role', 'resource.ownerId', 'environment.time'
  operator:
    | 'equals'
    | 'not_equals'
    | 'in'
    | 'not_in'
    | 'greater_than'
    | 'less_than'
    | 'contains'
    | 'regex';
  value: any;
}

// ABAC Context
export interface ABACContext {
  user: UserAttributes;
  resource?: ResourceAttributes;
  environment: EnvironmentAttributes;
  action: Action;
  resourceType: Resource;
}

// Default ABAC Policies
export const DEFAULT_ABAC_POLICIES: ABACPolicyRule[] = [
  // Users can only edit their own profile
  {
    id: 'user-edit-own-profile',
    name: 'User Edit Own Profile',
    description: 'Users can only edit their own profile information',
    effect: 'ALLOW',
    conditions: [
      { attribute: 'user.id', operator: 'equals', value: 'resource.ownerId' },
      { attribute: 'action', operator: 'equals', value: Action.EDIT },
      { attribute: 'resourceType', operator: 'equals', value: Resource.USER },
    ],
    actions: [Action.EDIT],
    resources: [Resource.USER],
    priority: 100,
  },

  // College admins can only manage their own college
  {
    id: 'college-admin-own-college',
    name: 'College Admin Own College',
    description: 'College admins can only manage their own college',
    effect: 'ALLOW',
    conditions: [
      { attribute: 'user.role', operator: 'equals', value: UserType.ADMIN },
      {
        attribute: 'user.collegeId',
        operator: 'equals',
        value: 'resource.collegeId',
      },
      {
        attribute: 'action',
        operator: 'in',
        value: [Action.VIEW, Action.EDIT, Action.CREATE],
      },
      {
        attribute: 'resourceType',
        operator: 'in',
        value: [Resource.COLLEGE, Resource.SECTION, Resource.STATISTIC],
      },
    ],
    actions: [Action.VIEW, Action.EDIT, Action.CREATE],
    resources: [Resource.COLLEGE, Resource.SECTION, Resource.STATISTIC],
    priority: 90,
  },

  // Super admins can manage all colleges in their university
  {
    id: 'superadmin-university-colleges',
    name: 'Super Admin University Colleges',
    description: 'Super admins can manage all colleges in their university',
    effect: 'ALLOW',
    conditions: [
      {
        attribute: 'user.role',
        operator: 'equals',
        value: UserType.SUPERADMIN,
      },
      {
        attribute: 'user.universityId',
        operator: 'equals',
        value: 'resource.universityId',
      },
      {
        attribute: 'action',
        operator: 'in',
        value: [Action.VIEW, Action.EDIT, Action.CREATE, Action.DELETE],
      },
      {
        attribute: 'resourceType',
        operator: 'in',
        value: [Resource.COLLEGE, Resource.SECTION, Resource.STATISTIC],
      },
    ],
    actions: [Action.VIEW, Action.EDIT, Action.CREATE, Action.DELETE],
    resources: [Resource.COLLEGE, Resource.SECTION, Resource.STATISTIC],
    priority: 80,
  },

  // Time-based access (e.g., only during business hours)
  {
    id: 'business-hours-access',
    name: 'Business Hours Access',
    description: 'Some actions are only allowed during business hours',
    effect: 'ALLOW',
    conditions: [
      {
        attribute: 'environment.time',
        operator: 'greater_than',
        value: '09:00',
      },
      { attribute: 'environment.time', operator: 'less_than', value: '17:00' },
      {
        attribute: 'action',
        operator: 'in',
        value: [Action.CREATE, Action.EDIT, Action.DELETE],
      },
    ],
    actions: [Action.CREATE, Action.EDIT, Action.DELETE],
    resources: [Resource.COLLEGE, Resource.SECTION, Resource.STATISTIC],
    priority: 50,
  },

  // Deny access to inactive users
  {
    id: 'deny-inactive-users',
    name: 'Deny Inactive Users',
    description: 'Inactive users cannot perform any actions',
    effect: 'DENY',
    conditions: [
      { attribute: 'user.isActive', operator: 'equals', value: false },
    ],
    actions: Object.values(Action),
    resources: Object.values(Resource),
    priority: 200,
  },
];

// ABAC Permission Checker
export class ABACPermissionChecker {
  private policies: ABACPolicyRule[];

  constructor(policies: ABACPolicyRule[] = DEFAULT_ABAC_POLICIES) {
    this.policies = policies.sort((a, b) => b.priority - a.priority); // Sort by priority
  }

  /**
   * Evaluate permission based on ABAC context
   */
  evaluate(context: ABACContext): boolean {
    // Find applicable policies
    const applicablePolicies = this.policies.filter(policy =>
      this.isPolicyApplicable(policy, context)
    );

    // Evaluate policies in priority order
    for (const policy of applicablePolicies) {
      if (this.evaluatePolicy(policy, context)) {
        return policy.effect === 'ALLOW';
      }
    }

    // Default deny if no policy matches
    return false;
  }

  /**
   * Check if policy is applicable to the context
   */
  private isPolicyApplicable(
    policy: ABACPolicyRule,
    context: ABACContext
  ): boolean {
    // Check if action matches
    if (!policy.actions.includes(context.action)) {
      return false;
    }

    // Check if resource type matches
    if (!policy.resources.includes(context.resourceType)) {
      return false;
    }

    return true;
  }

  /**
   * Evaluate a single policy against the context
   */
  private evaluatePolicy(
    policy: ABACPolicyRule,
    context: ABACContext
  ): boolean {
    return policy.conditions.every(condition =>
      this.evaluateCondition(condition, context)
    );
  }

  /**
   * Evaluate a single condition against the context
   */
  private evaluateCondition(
    condition: ABACCondition,
    context: ABACContext
  ): boolean {
    const attributeValue = this.getAttributeValue(condition.attribute, context);
    const conditionValue = this.resolveValue(condition.value, context);

    switch (condition.operator) {
      case 'equals':
        return attributeValue === conditionValue;
      case 'not_equals':
        return attributeValue !== conditionValue;
      case 'in':
        return (
          Array.isArray(conditionValue) &&
          conditionValue.includes(attributeValue)
        );
      case 'not_in':
        return (
          Array.isArray(conditionValue) &&
          !conditionValue.includes(attributeValue)
        );
      case 'greater_than':
        return this.compareValues(attributeValue, conditionValue) > 0;
      case 'less_than':
        return this.compareValues(attributeValue, conditionValue) < 0;
      case 'contains':
        return String(attributeValue).includes(String(conditionValue));
      case 'regex':
        return new RegExp(String(conditionValue)).test(String(attributeValue));
      default:
        return false;
    }
  }

  /**
   * Get attribute value from context
   */
  private getAttributeValue(attribute: string, context: ABACContext): any {
    const parts = attribute.split('.');

    if (parts[0] === 'user') {
      return this.getNestedValue(context.user, parts.slice(1));
    } else if (parts[0] === 'resource' && context.resource) {
      return this.getNestedValue(context.resource, parts.slice(1));
    } else if (parts[0] === 'environment') {
      return this.getNestedValue(context.environment, parts.slice(1));
    } else if (parts[0] === 'action') {
      return context.action;
    } else if (parts[0] === 'resourceType') {
      return context.resourceType;
    }

    return undefined;
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string[]): any {
    return path.reduce((current, key) => current?.[key], obj);
  }

  /**
   * Resolve value (handle references like 'resource.ownerId')
   */
  private resolveValue(value: any, context: ABACContext): any {
    if (typeof value === 'string' && value.startsWith('resource.')) {
      const attribute = value.replace('resource.', '');
      return this.getNestedValue(context.resource, attribute.split('.'));
    }
    return value;
  }

  /**
   * Compare two values for greater/less than operations
   */
  private compareValues(a: any, b: any): number {
    if (a === b) return 0;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  /**
   * Add a new policy
   */
  addPolicy(policy: ABACPolicyRule): void {
    this.policies.push(policy);
    this.policies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove a policy by ID
   */
  removePolicy(policyId: string): void {
    this.policies = this.policies.filter(policy => policy.id !== policyId);
  }

  /**
   * Get all policies
   */
  getPolicies(): ABACPolicyRule[] {
    return [...this.policies];
  }
}

// Utility functions for ABAC
export const createABACChecker = (policies?: ABACPolicyRule[]) => {
  return new ABACPermissionChecker(policies);
};

export const createUserAttributes = (
  user: User,
  college?: College,
  university?: University
): UserAttributes => {
  return {
    id: user.id,
    role: user.role,
    email: user.email,
    collegeId: college?.id,
    universityId: university?.id,
    createdAt: user.createdAt,
    isActive: true, // You might want to add this field to your User model
  };
};

export const createResourceAttributes = (
  resource: any,
  resourceType: Resource,
  ownerId?: string
): ResourceAttributes => {
  return {
    id: resource.id,
    type: resourceType,
    ownerId,
    collegeId: resource.collegeId || resource.collageId,
    universityId: resource.universityId,
    isPublic: resource.isPublic || false,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
};

export const createEnvironmentAttributes = (
  ipAddress?: string,
  userAgent?: string,
  location?: string
): EnvironmentAttributes => {
  return {
    time: new Date(),
    ipAddress,
    userAgent,
    location,
  };
};
