import { registerRootComponent } from 'expo';
import Index from './app/index';

export default function App() {
  return <Index />;
}

registerRootComponent(App);
