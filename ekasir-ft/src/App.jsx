import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ShiftProvider } from './context/ShiftContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ShiftProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ShiftProvider>
      </NotificationProvider>
    </AuthProvider >
  );
}

export default App;