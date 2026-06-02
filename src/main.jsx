import { RootLayout } from '@core/components/root-layout';
import { GameContextProvider } from '@feature/game/context/game-context';
import { AboutPage } from '@routes/about-page';
import { CreateGamePage } from '@routes/create-game-page';
import { HomePage } from '@routes/home-page';
import { PlayerPage } from '@routes/player-page';
import { SpectatePage } from '@routes/spectate-page';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')).render(
  <GameContextProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path={'about'} element={<AboutPage />} />
          <Route path={'player'} element={<PlayerPage />} />
          <Route path={'games/create'} element={<CreateGamePage />} />
          <Route path={'spectate/:gameId'} element={<SpectatePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GameContextProvider>
);