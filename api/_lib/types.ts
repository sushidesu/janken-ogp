export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    result: string,
    playerName: string
    opponentName: string
    playerHand: string
    opponentHand: string
}
