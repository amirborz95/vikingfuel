'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PersonalInfoSection from './components/PersonalInfoSection';
import OrdersSection from './components/OrdersSection';
import HistorySection from './components/HistorySection';

type TabType = 'personal' | 'orders' | 'history';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabType>('personal');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleDataUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header />
      <main className="py-20">
        <div className="container-wide">
          {!user ? (
            <div className="max-w-3xl mx-auto bg-muted/30 rounded-3xl p-10 text-center">
              <h1 className="text-4xl font-extrabold text-foreground mb-4">Logga in på ditt konto</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Du måste vara inloggad för att komma åt denna sida.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/login" className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors inline-block">
                  Logga in
                </a>
                <a href="/register" className="rounded-2xl border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors inline-block">
                  Registrera dig
                </a>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl font-extrabold text-foreground mb-8">Mina inställningar</h1>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                  <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
                      <div className="text-center">
                        <h2 className="font-bold text-foreground text-lg mb-1">{user.name}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <nav className="p-2">
                      <button
                        onClick={() => setActiveTab('personal')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          activeTab === 'personal'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        Personliga uppgifter
                      </button>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          activeTab === 'orders'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        Beställningar
                      </button>
                      <button
                        onClick={() => setActiveTab('history')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          activeTab === 'history'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        Historik
                      </button>
                    </nav>

                    <div className="border-t border-border p-4">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-600 transition-colors"
                      >
                        Logga ut
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {activeTab === 'personal' && (
                    <PersonalInfoSection
                      user={user}
                      onDataUpdated={handleDataUpdated}
                    />
                  )}
                  {activeTab === 'orders' && (
                    <OrdersSection
                      userEmail={user.email}
                      refreshTrigger={refreshTrigger}
                      onDataUpdated={handleDataUpdated}
                    />
                  )}
                  {activeTab === 'history' && (
                    <HistorySection
                      userEmail={user.email}
                      refreshTrigger={refreshTrigger}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


