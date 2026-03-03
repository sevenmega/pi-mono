/**
 * Debug utilities for the agent.
 */

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
	for (const c of msg.content) {
		logger.debug(`    text = ${c.text}`);
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
