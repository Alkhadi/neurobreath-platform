export {};

declare global {
  type TurnstileRenderOptions = {
    sitekey: string;
    action?: string;
    theme?: "auto" | "light" | "dark";
    size?: "normal" | "compact";
    callback?: (token: string) => void;
    "error-callback"?: () => void;
    "expired-callback"?: () => void;
  };

  interface TurnstileApi {
    render(container: HTMLElement, options: TurnstileRenderOptions): string;
    reset(widgetId?: string): void;
    remove(widgetId: string): void;
  }

  interface Window {
    turnstile?: TurnstileApi;
    __turnstileScriptPromise?: Promise<void>;
  }
}
