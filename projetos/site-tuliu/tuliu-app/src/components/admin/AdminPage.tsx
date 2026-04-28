import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminClientsPage from './AdminClientsPage';
import ActivationRequestsPage from './ActivationRequestsPage';
import AdminFlowPage from './AdminFlowPage';

type AdminSection = 'dashboard' | 'clients' | 'activation-requests' | 'flow';

export default function AdminPage() {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');

  return (
    <AdminLayout currentSection={currentSection} onNavigate={(section) => setCurrentSection(section as AdminSection)}>
      {currentSection === 'dashboard' && <AdminDashboard />}
      {currentSection === 'activation-requests' && <ActivationRequestsPage />}
      {currentSection === 'clients' && <AdminClientsPage />}
      {currentSection === 'flow' && <AdminFlowPage />}
    </AdminLayout>
  );
}
