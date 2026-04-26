import { useState } from 'react';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminClientsPage from './AdminClientsPage';

type AdminSection = 'dashboard' | 'clients';

export default function AdminPage() {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');

  return (
    <AdminLayout currentSection={currentSection} onNavigate={(section) => setCurrentSection(section as AdminSection)}>
      {currentSection === 'dashboard' && <AdminDashboard />}
      {currentSection === 'clients' && <AdminClientsPage />}
    </AdminLayout>
  );
}
