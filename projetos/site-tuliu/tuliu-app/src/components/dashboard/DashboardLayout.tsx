import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import ProfileModal from './ProfileModal';
import SettingsModal from './SettingsModal';
import SupportModal from './SupportModal';

interface DashboardLayoutProps {
  children: (section: string, onNavigate: (section: string) => void) => ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentSection, setCurrentSection] = useState('overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'support') {
      setIsSupportOpen(true);
    } else if (section === 'settings') {
      setIsSettingsOpen(true);
    } else {
      setCurrentSection(section);
    }
  }, []);

  return (
    <div style={{ display: 'flex', background: '#ffffff' }}>
      <DashboardSidebar currentSection={currentSection} onNavigate={handleNavigate} />

      <main style={{
        flex: 1,
        overflowY: 'auto',
        height: 'calc(100vh - 70px)',
      }}>
        {children(currentSection, handleNavigate)}
      </main>

      {/* Modals */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}
