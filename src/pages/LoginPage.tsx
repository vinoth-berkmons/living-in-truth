import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getDB } from '@/lib/db';
import { PublicLayout } from '@/components/PublicLayout';
import { useLanguageStore, useAuthStore } from '@/stores';
import { t } from '@/lib/i18n';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { AuthRepo } from '@/repos';

interface LoginPageProps {
  initialMode?: 'login' | 'signup';
}

const LoginPage = ({ initialMode = 'login' }: LoginPageProps) => {
  const workspace = useWorkspace();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguageStore();
  const { setSession } = useAuthStore();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState(initialMode);

  const redirectTo = searchParams.get('redirect') || '/';
  const db = getDB();

  const handleSuccess = () => {
    const updatedDb = getDB();
    if (updatedDb?.session) {
      setSession(updatedDb.session);
      navigate(redirectTo);
    }
  };

  const handleEmailSubmit = async () => {
    const res = await AuthRepo.loginEmailStart(email);
    if (res.success) setStep('otp');
  };

  const handleOtpSubmit = async () => {
    const res = await AuthRepo.loginEmailVerify(email, otp);
    if (res) {
      handleSuccess();
    } else {
      setError('User not found. Try: super@livingintruth.app');
    }
  };

  const handleGoogleLogin = async () => {
    const res = await AuthRepo.loginGoogle('super@livingintruth.app');
    if (res) handleSuccess();
  };

  const mockUsers = db ? Object.values(db.users.byId) : [];
  const isSignup = mode === 'signup';

  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isSignup ? 'Create Account' : t('nav.login', language)}
          </h1>
          {step === 'email' ? (
            <div className="mt-6 space-y-4">
              <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary">
                {t('auth.loginWith', language)} Google (Mock)
              </button>
              <div className="flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('auth.email', language)} className="w-full rounded-input border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
              <button onClick={handleEmailSubmit} className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                {isSignup ? 'Sign Up with Email' : 'Continue with Email'}
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">{t('auth.enterOtp', language)} (any code works)</p>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" className="w-full rounded-input border border-border bg-surface px-4 py-3 text-sm text-foreground" />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button onClick={handleOtpSubmit} className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Verify</button>
            </div>
          )}

          {/* Toggle between login/signup */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>Already have an account? <Link to={`/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} onClick={() => setMode('login')} className="text-primary hover:underline">Sign In</Link></>
            ) : (
              <>Don't have an account? <Link to={`/signup${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} onClick={() => setMode('signup')} className="text-primary hover:underline">Sign Up</Link></>
            )}
          </p>

          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Quick login (mock users):</p>
            <div className="mt-2 space-y-1">
              {mockUsers.map(u => (
                <button key={u.id} onClick={async () => {
                  await AuthRepo.loginGoogle(u.email);
                  handleSuccess();
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
