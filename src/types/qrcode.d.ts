// Minimal types for the parts of `qrcode` the site uses: the BackPorch Facebook kit
// (src/pages/backporch/FacebookKit.tsx) and the Gala "Join me" post maker
// (src/pages/galaJoinMe/post.ts). The package ships no declarations.
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
    create(text: string, options?: Pick<QRCodeOptions, 'errorCorrectionLevel'>): {
      modules: { size: number; get(row: number, col: number): number | boolean };
    };
  };
  export default QRCode;
}
