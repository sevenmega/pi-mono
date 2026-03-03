/**
 * Debug utilities for the agent.
 */
import type {
	UserMessage,
    AssistantMessage,
	Message,
	TextContent,
	ToolResultMessage,
} from "@mariozechner/pi-ai";
import type {
	AgentMessage,
} from "./types.js";

import { LogLayer } from 'loglayer';
import { LogFileRotationTransport } from '@loglayer/transport-log-file-rotation';
import { serializeError } from "serialize-error";

const fileTransport = new LogFileRotationTransport({
	filename: "./logs/agent.log"
});

export const logger = new LogLayer({
	errorSerializer: serializeError,
	transport: [fileTransport]
});

export function printAgentMessage(
	msg: AgentMessage
) {
	logger.debug(`  role = ${msg.role}, length = ${msg.content.length}`);
    if (msg.role === "assistant") {
        for (const block of msg.content) {
            if (block.type === "toolCall") {
                logger.debug(`    toolCall = ${block.id}, name = ${block.name}, arguments = ${JSON.stringify(block.arguments)}`);
            } else if (block.type === "text") {
                logger.debug(`    text = ${block.text}`);
            } else if (block.type === "thinking") {
                logger.debug(`    text = ${block.thinking}`);
            } else {
                logger.debug(`    unknown block type ${block.type}`);
            }
        }
    } else if (msg.role === "toolResult") {
        for (const block of msg.content) {
            if (block.type === "text") {
                logger.debug(`    text = ${block.text}`);
            } else {
                logger.debug(`    unknown block type ${block.type}`);
            }
        }
    } else {
	    for (const block of msg.content) {
		    logger.debug(`    text = ${block.text}`);
	    }
    }
}

export function printAgentMessageArray(
	desc: string,
	msgs: AgentMessage[],
) {
	logger.debug(`message: ${desc}`);
	for (const m of msgs) {
		printAgentMessage(m);
	}
}
