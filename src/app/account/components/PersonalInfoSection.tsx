'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface PersonalInfoSectionProps {
  user: {
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    state?: string;
  };
  onDataUpdated: () => void;
}

export default function PersonalInfoSection({
  user,
  onDataUpdated,
}: PersonalInfoSectionProps) {
  const { updateUser } = useAuth();
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [newUsername, setNewUsername] = React.useState(user.name);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setNewUsername(user.name);
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
    setPostalCode(user.postalCode || '');
    setCity(user.city || '');
    setState(user.state || '');

    async function loadProfile() {
      try {
        const res = await fetch(`/api/account/profile?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setFirstName(data.user.firstName || '');
          setLastName(data.user.lastName || '');
          setPhone(data.user.phone || '');
          setAddress(data.user.address || '');
          setPostalCode(data.user.postalCode || '');
          setCity(data.user.city || '');
          setState(data.user.state || '');
        }
      } catch {
        // ignore
      }
    }

    loadProfile();
  }, [user]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setMessage({ type: 'error', text: 'Användarnamn kan inte vara tomt' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/account/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, newUsername }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Misslyckades att uppdatera användarnamn');
      }

      const data = await res.json();
      if (updateUser) {
        updateUser({ ...user, name: data.name });
      }
      setMessage({ type: 'success', text: 'Användarnamn uppdaterat framgångsrikt!' });
      setIsEditingUsername(false);
      onDataUpdated();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Lösenorden matchar inte' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Lösenordet måste vara minst 6 tecken' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/account/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Misslyckades att uppdatera lösenord');
      }

      setMessage({ type: 'success', text: 'Lösenord uppdaterat framgångsrikt!' });
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div
          className={`rounded-2xl p-4 text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Email Section */}
      <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Din e-postadress</h2>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-muted-foreground">E-post</label>
          <div className="p-4 bg-muted/30 rounded-xl text-foreground font-medium">{user.email}</div>
          <p className="text-xs text-muted-foreground mt-2">Din e-postadress kan inte ändras</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Kontakt & adress</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          try {
            const res = await fetch('/api/account/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                firstName,
                lastName,
                phone,
                address,
                postalCode,
                city,
                state,
              }),
            });

            if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || 'Misslyckades att uppdatera profilen');
            }

            const data = await res.json();
            if (updateUser) {
              updateUser({
                ...user,
                name: data.user.name || user.name,
                firstName: data.user.firstName || '',
                lastName: data.user.lastName || '',
                phone: data.user.phone || '',
                address: data.user.address || '',
                postalCode: data.user.postalCode || '',
                city: data.user.city || '',
                state: data.user.state || '',
              });
            }

            setMessage({ type: 'success', text: 'Din profil har sparats.' });
            onDataUpdated();
          } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
          } finally {
            setIsLoading(false);
          }
        }} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Förnamn</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Förnamn"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Efternamn</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Efternamn"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Telefonnummer</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+46 70 123 45 67"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Gatuadress</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Exempelgatan 1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Postnummer</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123 45"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Ort</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Stockholm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Län / stat</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Stockholm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sparar...' : 'Spara profil'}
            </button>
            <p className="text-sm text-muted-foreground">Dina uppgifter sparas för snabbare checkout och bättre service.</p>
          </div>
        </form>
      </div>

      {/* Username Section */}
      <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Användarnamn</h2>
        {!isEditingUsername ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted-foreground">Ditt användarnamn</label>
              <div className="p-4 bg-muted/30 rounded-xl text-foreground font-medium">{user.name}</div>
            </div>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Ändra användarnamn
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateUsername} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted-foreground">Nytt användarnamn</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ange nytt användarnamn"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sparar...' : 'Spara'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingUsername(false);
                  setNewUsername(user.name);
                }}
                className="px-6 py-3 rounded-xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Lösenord</h2>
        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            Ändra lösenord
          </button>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted-foreground">Nuvarande lösenord</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ange ditt nuvarande lösenord"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted-foreground">Nytt lösenord</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ange nytt lösenord"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted-foreground">Bekräfta lösenord</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Bekräfta nytt lösenord"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sparar...' : 'Spara lösenord'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-6 py-3 rounded-xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
