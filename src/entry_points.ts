export const EntryPoints = {
  background: { input: 'src/background/index.ts', output: 'background.js' },
  inject: { input: 'src/client/inject.ts', output: 'inject.js' },
  client: { input: 'src/client/client.ts', output: 'client.js' },
};
