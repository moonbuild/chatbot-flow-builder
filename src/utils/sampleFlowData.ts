import type { CustomNodeUnion } from '../types/nodes/nodes-metadata';

// for testing purposes, if you are removing node, remove edge connection too

// Sample node/edge data that will load initially if localstorage is empty
const sampleNodes: CustomNodeUnion[] = [
  {
    id: '1',
    type: 'message',
    position: { x: 0, y: 100 },
    data: {
      type: 'message',
      title: 'Send Message',
      description: 'Hello I am Mourya Pranay',
      iconPath: '/node-icons/whatsapp.svg',
      configuration: {
        messageText: 'Hello I am Mourya Pranay, a Full Stack Developer',
      },
    },
  },
  {
    id: '2',
    type: 'message',
    position: { x: 0, y: 200 },
    data: {
      type: 'message',
      title: 'Send Message',
      description: 'How does the UI look?',
      iconPath: '/node-icons/whatsapp.svg',
      configuration: {
        messageText: 'How does the UI look?',
      },
    },
  },
];

const sampleEdges = [
  {
    id: 'e1',
    source: '1',
    target: '2',
  },
];

export { sampleNodes, sampleEdges };
