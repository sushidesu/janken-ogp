import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { playerName, opponentName, playerHand, opponentHand } = (query || {});

    const arr = (pathname || '/').slice(1).split('.');
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        playerName: flattenAndDecode(playerName),
        playerHand: parseHand(playerHand),
        opponentName: flattenAndDecode(opponentName),
        opponentHand: parseHand(opponentHand),
        text: decodeURIComponent(text),
    };
    return parsedRequest;
}

const parseHand = (value: string | string[] | undefined): string => {
  switch (value) {
    case "rock":
      return "✊"
    case "paper":
      return "🖐"
    case "scissors":
      return "✌"
    default:
      return "?"
  }
}

const flattenAndDecode = (value: string | string[] | undefined): string => {
  return decodeURIComponent(flatten(value) ?? "")
}

const flatten = (value: string | string[] | undefined): string | undefined => {
  if (typeof value === "string") {
    return value
  } else if (Array.isArray(value) && value.length){
    return value[0]
  } else {
    return undefined
  }
}
