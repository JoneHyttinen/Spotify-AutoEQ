import { randomBytes, createHash } from "node:crypto";
import { createServer } from "node:http";
import { shell } from "electron";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

if (!CLIENT_ID) {
  throw new Error("SPOTIFY_CLIENT_ID is not configured");
}

if (!REDIRECT_URI) {
  throw new Error("SPOTIFY_REDIRECT_URI is not configured");
}

const SCOPES = ["user-read-currently-playing", "user-read-playback-state"];

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

function generateCodeVerifier(): string {
  return randomBytes(64).toString("base64url");
}

function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

function generateState(): string {
  return randomBytes(32).toString("hex");
}

export class SpotifyAuth {
  async login(): Promise<SpotifyTokenResponse> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const state = generateState();

    const authorizationUrl = new URL("https://accounts.spotify.com/authorize");

    authorizationUrl.searchParams.set("client_id", CLIENT_ID as string);

    authorizationUrl.searchParams.set("response_type", "code");

    authorizationUrl.searchParams.set("redirect_uri", REDIRECT_URI as string);

    authorizationUrl.searchParams.set("scope", SCOPES.join(" "));

    authorizationUrl.searchParams.set("state", state);

    authorizationUrl.searchParams.set("code_challenge_method", "S256");

    authorizationUrl.searchParams.set("code_challenge", codeChallenge);

    console.log("Opening Spotify authorization:", authorizationUrl.toString());

    const code = await this.waitForCallback(state, authorizationUrl.toString());

    return this.exchangeCode(code, codeVerifier);
  }

  private async waitForCallback(
    expectedState: string,
    authorizationUrl: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const server = createServer((request, response) => {
        console.log("OAuth callback:", request.url);

        if (!request.url) {
          response.statusCode = 400;
          response.end("Invalid callback");

          return;
        }

        const url = new URL(request.url, REDIRECT_URI);

        if (url.pathname !== "/callback") {
          response.statusCode = 404;
          response.end("Not found");

          return;
        }

        const error = url.searchParams.get("error");

        if (error) {
          response.end(
            "Spotify authorization was cancelled. You can close this window.",
          );

          server.close();

          reject(new Error(`Spotify authorization failed: ${error}`));

          return;
        }

        const state = url.searchParams.get("state");

        if (state !== expectedState) {
          response.statusCode = 400;
          response.end("Invalid OAuth state.");

          server.close();

          reject(new Error("Invalid OAuth state"));

          return;
        }

        const code = url.searchParams.get("code");

        if (!code) {
          response.statusCode = 400;
          response.end("Missing authorization code.");

          server.close();

          reject(new Error("Missing authorization code"));

          return;
        }

        response.setHeader("Content-Type", "text/html");

        response.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Spotify AutoEQ</title>
              </head>
              <body>
                <h1>Spotify connected!</h1>
                <p>You can close this window.</p>
              </body>
            </html>
          `);

        server.close();

        resolve(code);
      });

      server.on("error", (error) => {
        reject(error);
      });

      const redirectUrl = new URL(REDIRECT_URI as string);

      const port = Number(redirectUrl.port);

      console.log(
        `Starting OAuth callback server on ${redirectUrl.hostname}:${port}`,
      );

      server.listen(port, redirectUrl.hostname, () => {
        console.log("OAuth callback server ready");

        shell.openExternal(authorizationUrl);
      });
    });
  }

  private async exchangeCode(
    code: string,
    codeVerifier: string,
  ): Promise<SpotifyTokenResponse> {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id: CLIENT_ID as string,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI as string,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `Spotify token request failed: ${response.status} ${body}`,
      );
    }

    return response.json() as Promise<SpotifyTokenResponse>;
  }
}
