import { useForm, Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthLayout from '#components/layouts/auth_layout'
import { Github, ArrowLeft } from 'lucide-react'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.5 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 }
  }
}

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/login')
  }

  function loginWithGithub() {
    window.location.href = '/oauth/github/redirect'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          variants={modalVariants}
          className="w-full max-w-sm bg-[#1a1f2d]/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl relative"
        >
          <Link
            href="/"
            className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>

          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-mono text-white">{'</>'}</span>
              <h1 className="text-2xl font-medium text-white">JS Challenge</h1>
              <h2 className="text-xl font-medium text-white/80">Connexion</h2>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={data.email}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Email"
                    onChange={e => setData('email', e.target.value)}
                  />
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left"
                    >
                      {errors.email}
                    </motion.div>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    value={data.password}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Mot de passe"
                    onChange={e => setData('password', e.target.value)}
                  />
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm mt-2 text-left"
                    >
                      {errors.password}
                    </motion.div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-transparent text-white text-sm font-medium hover:text-white/90 transition-colors disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1a1f2d] px-2 text-white/40">Ou continuer avec</span>
              </div>
            </div>

            <button
              onClick={loginWithGithub}
              className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

Login.layout = (page: any) => <AuthLayout>{page}</AuthLayout>
