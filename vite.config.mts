import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Matches production. The site is served from the apex custom domain (see the CNAME
// step in .github/workflows/deploy.yml), so every deployed build uses base '/'.
//
// This used to default to '/sparkpointv15/' — the GitHub Pages *project* URL
// (chfxpro.github.io/sparkpointv15/) from before the custom domain existed. Because CI
// sets PUBLIC_BASE=/ explicitly, that default only ever applied to local builds, which
// meant `npm run build` silently produced something production never ships: assets
// referenced at /sparkpointv15/... that the prerenderer's root-serving preview server
// could not load, so React never booted and all ~88 pages serialized as the same empty
// SPA shell — while the build still exited 0. (scripts/prerender.mjs now hard-fails on
// that, but matching prod here is what stops it happening in the first place.)
//
// If you ever need to serve from the raw project URL again — e.g. the custom domain or
// its DNS has to come off — build with an explicit override instead of editing this:
//   PUBLIC_BASE=/sparkpointv15/ npm run build
// (public/404.html's `repoSegment` shim exists for that same scenario and is a no-op on
// the apex domain.)
const defaultBase = '/';
// Apex, matching production and the CNAME written by .github/workflows/deploy.yml.
// Every other origin default in the repo already resolves to the apex — src/lib/siteOrigin.ts,
// scripts/replace-site-origin.js and scripts/prerender.mjs — so this was the lone outlier at
// 'https://www.yoursparkpoint.org'. CI sets SITE_ORIGIN/PUBLIC_ORIGIN/VITE_SITE_ORIGIN
// explicitly, so the old value only reached local builds, where it silently produced
// canonical/OG URLs on a hostname the site does not canonically serve.
const defaultSiteOrigin = 'https://yoursparkpoint.org';

if (!process.env.VITE_SITE_ORIGIN) {
  process.env.VITE_SITE_ORIGIN = process.env.SITE_ORIGIN ?? process.env.PUBLIC_ORIGIN ?? defaultSiteOrigin;
}

export default defineConfig({
  base: process.env.PUBLIC_BASE ?? defaultBase,

  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png': path.resolve(__dirname, './src/assets/ec17a6fe91f3b0bf97249c7bd911f4723893563c.png'),
        'figma:asset/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png': path.resolve(__dirname, './src/assets/e4e8c9f59f3a2b2ee1533f1f427ca4a4cb3693a5.png'),
        'figma:asset/e3f8a2b021eb0d337580338dd10e709a1762494c.png': path.resolve(__dirname, './src/assets/e3f8a2b021eb0d337580338dd10e709a1762494c.png'),
        'figma:asset/ce8cfb7a67e4c9db354c1d7021333b647621f8d5.png': path.resolve(__dirname, './src/assets/ce8cfb7a67e4c9db354c1d7021333b647621f8d5.png'),
        'figma:asset/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png': path.resolve(__dirname, './src/assets/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png'),
        'figma:asset/c88e8fd418fa5de2d8271a01eff7835b8bc45301.png': path.resolve(__dirname, './src/assets/c88e8fd418fa5de2d8271a01eff7835b8bc45301.png'),
        'figma:asset/c4e1406ca17d5d9941f67714b4ad381639235894.png': path.resolve(__dirname, './src/assets/c4e1406ca17d5d9941f67714b4ad381639235894.png'),
        'figma:asset/c468599141a487a1168ff53b1f6de665f3b4be9d.png': path.resolve(__dirname, './src/assets/c468599141a487a1168ff53b1f6de665f3b4be9d.png'),
        'figma:asset/bfacc09e892a84383df5476044a4c68f27340b81.png': path.resolve(__dirname, './src/assets/bfacc09e892a84383df5476044a4c68f27340b81.png'),
        'figma:asset/bef0024c7f7aa5cba807241e9b1a543393d1afd6.png': path.resolve(__dirname, './src/assets/bef0024c7f7aa5cba807241e9b1a543393d1afd6.png'),
        'figma:asset/ba6e37fd64adba4fcc3b0218dcd2bb192cb23802.png': path.resolve(__dirname, './src/assets/ba6e37fd64adba4fcc3b0218dcd2bb192cb23802.png'),
        'figma:asset/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png': path.resolve(__dirname, './src/assets/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png'),
        'figma:asset/acc45b75e300283fd839e68a5d16299f663b13b6.png': path.resolve(__dirname, './src/assets/acc45b75e300283fd839e68a5d16299f663b13b6.png'),
        'figma:asset/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.png': path.resolve(__dirname, './src/assets/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.png'),
        'figma:asset/9c661c719237d099265f1fb1d61cc2e4d16fcc41.png': path.resolve(__dirname, './src/assets/9c661c719237d099265f1fb1d61cc2e4d16fcc41.png'),
        'figma:asset/90544aa933b2c117f40fb5271f7b12942198041b.png': path.resolve(__dirname, './src/assets/90544aa933b2c117f40fb5271f7b12942198041b.png'),
        'figma:asset/804331be6917486c365a5471a09f615ba2d0f66b.png': path.resolve(__dirname, './src/assets/804331be6917486c365a5471a09f615ba2d0f66b.png'),
        'figma:asset/7c67e828e47be75e27ecc6de02db283be5ae7589.png': path.resolve(__dirname, './src/assets/7c67e828e47be75e27ecc6de02db283be5ae7589.png'),
        'figma:asset/63f606372ec6e500e9a7547d300fb9f0d31dae7e.png': path.resolve(__dirname, './src/assets/63f606372ec6e500e9a7547d300fb9f0d31dae7e.png'),
        'figma:asset/6188b8c6c445b647b8e4e9b74a1010513b0cc4b6.png': path.resolve(__dirname, './src/assets/6188b8c6c445b647b8e4e9b74a1010513b0cc4b6.png'),
        'figma:asset/5b0388c9542f078a58f8b6be96161b02480d4b7d.png': path.resolve(__dirname, './src/assets/5b0388c9542f078a58f8b6be96161b02480d4b7d.png'),
        'figma:asset/5a36f7b11c9d0bf970613a37a28b121b31918d77.png': path.resolve(__dirname, './src/assets/5a36f7b11c9d0bf970613a37a28b121b31918d77.png'),
        'figma:asset/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png': path.resolve(__dirname, './src/assets/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png'),
        'figma:asset/5463509e242f1244d018bbff5b9c9fc1831a9b2f.png': path.resolve(__dirname, './src/assets/5463509e242f1244d018bbff5b9c9fc1831a9b2f.png'),
        'figma:asset/3c1537cde524e7172c827aa2411c2c759ae68ece.png': path.resolve(__dirname, './src/assets/3c1537cde524e7172c827aa2411c2c759ae68ece.png'),
        'figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png': path.resolve(__dirname, './src/assets/35bb889d1f4d0b05ae6753439b58199640858447.png'),
        'figma:asset/2f54cc163c056ac592d9e429a8920f74d0a98f56.png': path.resolve(__dirname, './src/assets/2f54cc163c056ac592d9e429a8920f74d0a98f56.png'),
        'figma:asset/28635c221385162e7318f9ca720b599fe97a1bb5.png': path.resolve(__dirname, './src/assets/28635c221385162e7318f9ca720b599fe97a1bb5.png'),
        'figma:asset/238168330742171cebb538968793e34afcac231e.png': path.resolve(__dirname, './src/assets/238168330742171cebb538968793e34afcac231e.png'),
        'figma:asset/20c2a905251c86d5a4f9333b83199204b6928c7d.png': path.resolve(__dirname, './src/assets/20c2a905251c86d5a4f9333b83199204b6928c7d.png'),
        'figma:asset/183c96a680c45035b0835db81082bdb93af69f97.png': path.resolve(__dirname, './src/assets/183c96a680c45035b0835db81082bdb93af69f97.png'),
        'figma:asset/16ed15b2e7cab4039cf2d9fb007333306f37886c.png': path.resolve(__dirname, './src/assets/16ed15b2e7cab4039cf2d9fb007333306f37886c.png'),
        'figma:asset/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.png': path.resolve(__dirname, './src/assets/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.png'),
        'figma:asset/08d6097996fec1db647eccd1343a8e7ebf420b7b.png': path.resolve(__dirname, './src/assets/08d6097996fec1db647eccd1343a8e7ebf420b7b.png'),
        'figma:asset/0835779aef52124bf5c00840473e8285f8e0f937.png': path.resolve(__dirname, './src/assets/0835779aef52124bf5c00840473e8285f8e0f937.png'),
        'figma:asset/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png': path.resolve(__dirname, './src/assets/081f67bc0043a989fd3bbe690f2bc36895e2ae29.png'),
        'figma:asset/046ca85659860578eeeab6a45f52700c54c519a3.png': path.resolve(__dirname, './src/assets/046ca85659860578eeeab6a45f52700c54c519a3.png'),
        'figma:asset/03643ed23c45475ef78b3e0f363a5b886b5679a9.png': path.resolve(__dirname, './src/assets/03643ed23c45475ef78b3e0f363a5b886b5679a9.png'),
        'figma:asset/006b84f90bae2616433d7bda85278d8264e4e33c.png': path.resolve(__dirname, './src/assets/006b84f90bae2616433d7bda85278d8264e4e33c.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });
