import { FunctionDeclaration, Type } from '@google/genai';

/**
 * Tool to send emails via Gmail.
 * In a real-world scenario, this would interface with the Gmail API.
 * For this interface, we trigger a mailto: action or mock the transmission.
 */
export const gmailSendEmailTool: FunctionDeclaration = {
  name: 'gmail_send_email',
  description: 'Sends an email to a recipient with a subject and body content. Use this when the user asks to send an email or message via Gmail.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      recipient: {
        type: Type.STRING,
        description: 'The email address of the recipient.',
      },
      subject: {
        type: Type.STRING,
        description: 'The subject line of the email.',
      },
      body: {
        type: Type.STRING,
        description: 'The main content/body of the email.',
      },
    },
    required: ['recipient', 'subject', 'body'],
  },
};

/**
 * Tool for Home Assistant / IoT control.
 */
export const homeAssistantTool: FunctionDeclaration = {
  name: 'home_assistant_control',
  description: 'Controls smart home devices like lights, thermostats, and locks.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      device: {
        type: Type.STRING,
        description: 'The name or ID of the device (e.g., "living room light").',
      },
      action: {
        type: Type.STRING,
        description: 'The action to perform (e.g., "turn_on", "turn_off", "dim", "set_temp").',
      },
      value: {
        type: Type.STRING,
        description: 'Optional value for the action (e.g., "72 degrees" or "50% brightness").',
      },
    },
    required: ['device', 'action'],
  },
};

/**
 * Tool for searching local or cloud file systems (MCP FileSystem).
 */
export const fileSearchTool: FunctionDeclaration = {
  name: 'file_system_search',
  description: 'Searches for files by name or content keywords within the accessible file system.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'The search term or filename to look for.',
      },
    },
    required: ['query'],
  },
};
