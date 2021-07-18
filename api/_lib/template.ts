
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const noto = readFileSync(`${__dirname}/../_fonts/NotoSansJP-Bold.otf`).toString('base64');

const ORIGIN = process.env.VERCEL_ENV === "development" ? "http://localhost:3000" : `https://${process.env.VERCEL_URL}`

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = 'black';
    // let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        // radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Noto';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${noto})  format("opentype");
    }

    body {
        font-family: 'Noto', sans-serif;
        background: ${background};
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    .player-wrapper {
        width: 90vw;
        margin: 0 auto;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: space-between;
        justify-items: center;
    }
    .player {
      width: 1000px;
      padding: 0 50px;
    }

    .logo {
        margin: 0 75px;
    }

    .spacer {
        margin: 150px;
    }

    .hand .emoji {
        margin-top: 80px;
        height: 2em;
        width: 2em;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Noto', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.4;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
    const {
      result,
      playerName, opponentName,
      playerHand, opponentHand
    } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss("light", "96px")}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="heading">${emojify(marked(result))}
            </div>
            <div class="spacer">
            <div class="player-wrapper">
              <div class="player">
                <div class="heading">${sanitizeHtml(playerName)}</div>
                <div class="heading hand">${emojify(
                  sanitizeHtml(playerHand)
                )}</div>
              </div>
              <div class="heading">VS</div>
              <div class="player">
                <div class="heading">${sanitizeHtml(opponentName)}</div>
                <div class="heading hand">${emojify(
                  sanitizeHtml(opponentHand)
                )}</div>
              </div>
            </div>
            <img style="margin-right: 100px;" width="600px" height="100%" src="${ORIGIN}/kabuking.png" />
        </div>
    </body>
</html>`
}
