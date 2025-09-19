import 'react-native-reanimated'; // ✅ must be the very first import
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
