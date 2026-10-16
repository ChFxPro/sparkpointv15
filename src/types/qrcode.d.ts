// Minimal types for the parts of `qrcode` the BackPorch Facebook kit uses
// (src/pages/backporch/FacebookKit.tsx). The package ships no declarations.
declare module 'qrcode' {
  interface QRCodeOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    color?: { dark?: string; light?: string };
  }
  const QRCode: {
    toCanvas(canvas: HTMLCanvasElement, text: string, options?: QRCodeOptions): Promise<void>;
    toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
    toString(text: string, options?: QRCodeOptions & { type?: 'svg' | 'utf8' | 'terminal' }): Promise<string>;
  };
  export default QRCode;
}
