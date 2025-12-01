import React from 'react';
import { useAuth } from './AuthProvider';

const Header: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the login link!');
      setShowLogin(false);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#0f0a1f] to-transparent backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {APP_TITLE}
            </h1>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#how-it-works" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              Pricing
            </a>
            <a href="#resources" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              Resources
            </a>
            <a href="#contact" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Right: Live Badge + Auth */}
          <div className="flex items-center space-x-3">
            {/* Live Market Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs font-medium border border-emerald-400/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-200">Live</span>
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-all border border-white/10 hover:border-white/20"
                >
                  Sign Out
                </button>
              </div>
            ) : showLogin ? (
              <form onSubmit={handleLogin} className="flex items-center space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="text-white bg-white/10 placeholder-white/40 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-white/10 backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition-all shadow-lg shadow-orange-500/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
