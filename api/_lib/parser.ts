import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { query } = parse(req.url || '/', true);
    const { rs, r, l, rh, lh } = (query || {});

    const result = () => {
      switch (flatten(rs)) {
        case "r":
          return `${r} の勝ち！`
        case "l":
          return `${l} の勝ち！`
        default:
          return "あいこ！"
      }
    }

    const parsedRequest: ParsedRequest = {
        result: result(),
        playerName: flattenAndDecode(l),
        playerHand: parseHand(lh),
        opponentName: flattenAndDecode(r),
        opponentHand: parseHand(rh),
    };
    return parsedRequest;
}

const parseHand = (value: string | string[] | undefined): string => {
  switch (value) {
    case "r":
      return "✊"
    case "p":
      return "🖐"
    case "s":
      return "✌"
    default:
      return "✊"
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
