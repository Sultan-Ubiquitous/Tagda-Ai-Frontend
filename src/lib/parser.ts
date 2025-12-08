import { Step, ParsedAction, StepType } from "@/types";

/**
 * Robust XML parser for agent actions that converts XML structure into actionable steps
 * Handles file creation and shell script execution commands
 */
export function parseAgentActionsToSteps(xmlContent: string): Step[] {
  if (!xmlContent || typeof xmlContent !== 'string') {
    throw new Error('Invalid input: xmlContent must be a non-empty string');
  }

  const steps: Step[] = [];
  let stepId = 1;

  // Remove any leading/trailing whitespace and normalize newlines
  const normalizedXml = xmlContent.trim().replace(/\r\n/g, '\n');

  // Extract all agentAction tags - handles both self-closing and regular tags
  // This regex captures: type attribute, optional filePath, and content between tags
  const actionRegex = /<agentAction\s+type=["']([^"']+)["'](?:\s+filePath=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/agentAction>|<AgentAction\s+type=["']([^"']+)["'](?:\s+filePath=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/AgentAction>/gi;

  let match;
  const actions: ParsedAction[] = [];

  // Extract all actions from XML
  while ((match = actionRegex.exec(normalizedXml)) !== null) {
    // Handle both lowercase and uppercase variants
    const type = match[1] || match[4];
    const filePath = match[2] || match[5];
    const content = match[3] || match[6];

    if (type && content !== undefined) {
      actions.push({
        type: type.toLowerCase().trim(),
        filePath: filePath?.trim(),
        content: content.trim()
      });
    }
  }

  if (actions.length === 0) {
    console.warn('No agent actions found in XML content');
    return steps;
  }

  // Process each action into a Step
  for (const action of actions) {
    try {
      const step = convertActionToStep(action, stepId);
      if (step) {
        steps.push(step);
        stepId++;
      }
    } catch (error) {
      console.error(`Error processing action at index ${stepId - 1}:`, error);
      // Continue processing other actions even if one fails
    }
  }

  return steps;
}

/**
 * Converts a parsed action object into a Step object
 */
function convertActionToStep(action: ParsedAction, id: number): Step | null {
  const { type, filePath, content } = action;

  // Decode HTML entities and clean up content
  const cleanedContent = decodeHtmlEntities(content);

  switch (type) {
    case 'file': {
      if (!filePath) {
        console.error('File action missing filePath attribute');
        return null;
      }

      const fileName = extractFileName(filePath);
      
      return {
        id,
        title: `Create "${fileName}"`,
        description: `Create file at ${filePath}`,
        type: StepType.CreateFile,
        status: 'pending',
        code: cleanedContent,
        path: filePath
      };
    }

    case 'shell': {
      const command = cleanedContent.trim();
      
      if (!command) {
        console.error('Shell action has empty command');
        return null;
      }

      // Extract meaningful title from command
      const title = generateShellCommandTitle(command);
      
      return {
        id,
        title,
        description: `Execute: ${command}`,
        type: StepType.RunScript,
        status: 'pending',
        code: command
      };
    }

    default: {
      console.warn(`Unknown action type: ${type}`);
      return null;
    }
  }
}

/**
 * Decodes HTML entities like &quot;, \n, etc.
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  // Handle common escape sequences
  let decoded = text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  return decoded;
}

/**
 * Extracts the file name from a file path
 */
function extractFileName(filePath: string): string {
  if (!filePath) return 'unknown';
  
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
}

/**
 * Generates a human-readable title for shell commands
 */
function generateShellCommandTitle(command: string): string {
  const trimmedCommand = command.trim();
  
  // Handle npm commands specially
  if (trimmedCommand.startsWith('npm install')) {
    const packages = trimmedCommand
      .replace(/npm\s+install\s+/, '')
      .replace(/--save-dev\s+/, '')
      .replace(/--save\s+/, '')
      .replace(/-D\s+/, '')
      .replace(/-S\s+/, '')
      .trim();
    
    if (packages) {
      return `Install ${packages}`;
    }
    return 'Install dependencies';
  }

  if (trimmedCommand.startsWith('npm')) {
    const npmCommand = trimmedCommand.split(' ')[1] || 'command';
    return `Execute npm ${npmCommand}`;
  }

  // Handle yarn commands
  if (trimmedCommand.startsWith('yarn add')) {
    const packages = trimmedCommand.replace(/yarn\s+add\s+/, '').trim();
    return `Install ${packages}`;
  }

  if (trimmedCommand.startsWith('yarn')) {
    const yarnCommand = trimmedCommand.split(' ')[1] || 'command';
    return `Execute yarn ${yarnCommand}`;
  }

  // Handle git commands
  if (trimmedCommand.startsWith('git')) {
    const gitCommand = trimmedCommand.split(' ')[1] || 'command';
    return `Execute git ${gitCommand}`;
  }

  // Generic case - limit length for readability
  if (trimmedCommand.length > 50) {
    return `Execute ${trimmedCommand.substring(0, 47)}...`;
  }

  return `Execute ${trimmedCommand}`;
}

/**
 * Validates if a string contains valid XML structure
 */
export function isValidXml(xmlContent: string): boolean {
  if (!xmlContent || typeof xmlContent !== 'string') {
    return false;
  }

  // Check for basic XML structure
  const hasOpeningTag = /<agentAction|<AgentAction/i.test(xmlContent);
  const hasClosingTag = /<\/agentAction>|<\/AgentAction>/i.test(xmlContent);

  return hasOpeningTag && hasClosingTag;
}

/**
 * Helper function to extract raw actions without converting to steps
 * Useful for debugging or custom processing
 */
export function extractRawActions(xmlContent: string): ParsedAction[] {
  const normalizedXml = xmlContent.trim().replace(/\r\n/g, '\n');
  const actionRegex = /<agentAction\s+type=["']([^"']+)["'](?:\s+filePath=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/agentAction>|<AgentAction\s+type=["']([^"']+)["'](?:\s+filePath=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/AgentAction>/gi;

  const actions: ParsedAction[] = [];
  let match;

  while ((match = actionRegex.exec(normalizedXml)) !== null) {
    const type = match[1] || match[4];
    const filePath = match[2] || match[5];
    const content = match[3] || match[6];

    if (type && content !== undefined) {
      actions.push({
        type: type.toLowerCase().trim(),
        filePath: filePath?.trim(),
        content: decodeHtmlEntities(content.trim())
      });
    }
  }

  return actions;
}

// Example usage:
/*
const xmlInput = `
<agentArtifact id="project-import" title="Project Files">
  <agentAction type="file" filePath="src/App.tsx">
    import React from 'react';\n\nfunction App() {\n  return <div>Hello</div>;\n}\n\nexport default App;
  </agentAction>
  <agentAction type="shell">
    npm install --save-dev vite
  </agentAction>
</agentArtifact>
`;

const steps = parseAgentActionsToSteps(xmlInput);
console.log(steps);
*/