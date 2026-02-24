import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { t } from '@/lib/i18n';
import { AuthRepo } from '@/repos';

const LoginPage = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const { setSession } = useAuthStore();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const db = getDB();
  const workspace = db ? Object.values(db.workspaces.byId).find(w => w.slug === workspaceSlug && w.status === 'active') : undefined;

  if (!workspace) return <div className="flex min-h-screen items-center justify-center bg-background"><p>Not found</p></div>;

  const handleEmailSubmit = async () => {
    const res = await AuthRepo.loginEmailStart(email);
    if (res.success) setStep('otp');
  };

  const handleOtpSubmit = async () => {
    const res = await AuthRepo.loginEmailVerify(email, otp);
    if (res) {
      const updatedDb = getDB();
      if (updatedDb?.session) { setSession(updatedDb.session); navigate(`/w/${workspace.slug}`); }
    } else {
      setError('User not found. Try: super@livingintruth.app');
    }
  };

  const handleGoogleLogin = async () => {
    const res = await AuthRepo.loginGoogle('super@livingintruth.app');
    if (res) {
      const updatedDb = getDB();
      if (updatedDb?.session) { setSession(updatedDb.session); navigate(`/w/${workspace.slug}`); }
    }
  };

  const mockUsers = db ? Object.values(db.users.byId) : [];

  return (
    <PublicLayout workspace={workspace}>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-2xl font-bold text-foreground">{t('nav.login', language)}</h1>
          {step === 'email' ? (
            <div className="mt-6 space-y-4">
              <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary">
                {t('auth.loginWith', language)} Google (Mock)
              </button>
              <div className="flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('auth.email', language)} className="w-full rounded-input border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
              <button onClick={handleEmailSubmit} className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Continue with Email</button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">{t('auth.enterOtp', language)} (any code works)</p>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" className="w-full rounded-input border border-border bg-surface px-4 py-3 text-sm text-foreground" />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button onClick={handleOtpSubmit} className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Verify</button>
            </div>
          )}
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Quick login (mock users):</p>
            <div className="mt-2 space-y-1">
              {mockUsers.map(u => (
                <button key={u.id} onClick={async () => {
                  await AuthRepo.loginGoogle(u.email);
                  const d = getDB();
                  if (d?.session) { setSession(d.session); navigate(`/w/${workspace.slug}`); }
                }} className="block w-full text-left text-xs text-primary hover:underline">
                  {u.displayName} ({u.email})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
