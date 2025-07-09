import type { Node } from '@xyflow/react';

export type BaseNodeData = {
  title: string;
  description: string;
  iconPath: string;
  configuration: unknown;
};
export type MessageNodeConfig = {
  messageText: string;
};

export type TriggerNodeConfig = {
  triggerType: 'manual' | 'schedule';
  cron?: string;
};

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

export type CustomNodeUnion = MessageNode | TriggerNode;
export type NodeConfigMap = { message: MessageNodeConfig; trigger: TriggerNodeConfig };
export type CustomNodeTypes = keyof NodeConfigMap;
