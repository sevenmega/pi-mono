/**
 * Debug utilities for the pi-ai.
 */
import type {
	UserMessage,
    AssistantMessage,
	Message,
	TextContent,
	ToolResultMessage,
} from "./types.js";

import { LogLayer } from 'loglayer';
import { LogFileRotationTransport } from '@loglayer/transport-log-file-rotation';
import { serializeError } from "serialize-error";

const fileTransport = new LogFileRotationTransport({
	filename: "./logs/ai.log"
});

export const logger_ai = new LogLayer({
	errorSerializer: serializeError,
	transport: [fileTransport]
});

export function printMessage(
	msg: Message
) {
	logger_ai.debug(`  role = ${msg.role}, length = ${msg.content.length}`);
    if (msg.role === "assistant") {
        for (const block of msg.content) {
            if (block.type === "toolCall") {
                logger_ai.debug(`    toolCall = ${block.id}, name = ${block.name}, arguments = ${JSON.stringify(block.arguments)}`);
            } else if (block.type === "text") {
                logger_ai.debug(`    text = ${block.text}`);
            } else if (block.type === "thinking") {
                logger_ai.debug(`    text = ${block.thinking}`);
            } else {
                logger_ai.debug(`    unknown block type ${block.type}`);
            }
        }
    } else if (msg.role === "toolResult") {
        for (const block of msg.content) {
            if (block.type === "text") {
                logger_ai.debug(`    text = ${block.text}`);
            } else {
                logger_ai.debug(`    unknown block type ${block.type}`);
            }
        }
    } else {
	    for (const block of msg.content) {
		    logger_ai.debug(`    text = ${block.text}`);
	    }
    }
}

export function printMessageArray(
	desc: string,
	msgs: Message[],
) {
	logger_ai.debug(`message: ${desc}`);
	for (const m of msgs) {
		printMessage(m);
	}
}
