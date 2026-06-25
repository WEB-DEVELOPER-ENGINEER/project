// Global type declarations for Google Translate
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: any, elementId: string) => void;
        InlineLayout?: {
          SIMPLE: number;
          HORIZONTAL: number;
          VERTICAL: number;
        };
        [key: string]: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export {};