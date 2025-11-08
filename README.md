Dette er en intern prototype bygget i [Next.js](https://nextjs.org) for å demonstrere rammeverket «NA Frame». Prosjektet viser hvordan redaksjonelle og kommersielle komponenter kan hentes fra et Google-regneark og presenteres i et modulbasert grensesnitt.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren for å se løsningen.

Du kan starte tilpasninger ved å endre `app/page.js` eller widgetene under `src/app/widgets`. Siden oppdateres automatisk når du lagrer filene.

## Hva prosjektet inneholder

- `TNT Carousel`-widget som henter og formaterer innhold fra Google Sheets.
- Eksempeloppsett av komponenter som kan brukes i Namdalsavisas digitale produkter.
- En enkel konfigurasjon for å teste ulike widgets lokalt.

## Om NA Frame

NA Frame er et eksperimentelt designsystem som samler gjenbrukbare byggeklosser for annonsering, sponsing og historiefortelling. Målet er å gi redaksjonen og kommersielle team et felles rammeverk som gjør det raskere å bygge nye flater med konsistent design og god ytelse.
