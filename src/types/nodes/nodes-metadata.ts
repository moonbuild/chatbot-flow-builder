import type { Node } from '@xyflow/react';

/**
 * Common fields shared by all custom node types.
 * `configuration` is left generic to be overridden based on type.
 */

export type BaseNodeData = {
  title: string;
  description: string;
  iconPath: string;
  configuration: unknown;
};

/** Configuration schema for message nodes */
export type MessageNodeConfig = {
  messageText: string;
};

/** Sample Configuration schema for trigger nodes */
export type TriggerNodeConfig = {
  triggerType: 'manual' | 'schedule';
  cron?: string;
};

/**
 * Node structure with typed configuration.
 * Overrides `configuration` with its Base.
 */
export type MessageNode = Node<
  Omit<BaseNodeData, 'configuration'> & {
    type: 'message';
    configuration: MessageNodeConfig;
  }
>;

export type TriggerNode = Node<
  Omit<BaseNodeData, 'configuration'> & {
    type: 'trigger';
    configuration: TriggerNodeConfig;
  }
>;

// All supported custom node types
export type CustomNodeUnion = MessageNode | TriggerNode;

// Maps node type to its specific configuration for strong typescript
export type NodeConfigMap = { message: MessageNodeConfig; trigger: TriggerNodeConfig };

// Allowed Node Types so this will be 'message' and 'trigger'
export type CustomNodeTypes = keyof NodeConfigMap;
