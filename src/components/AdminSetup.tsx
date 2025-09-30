// Admin setup component for creating the first admin user
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { AuthService } from "../services/authService";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    if (password.length < 6) {
      setMessage({
        text: "La contraseña debe tener al menos 6 caracteres",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      await AuthService.createAdminUser(email.trim(), password);
      setMessage({
        text: "Usuario administrador creado exitosamente. Ya puedes iniciar sesión.",
        type: "success",
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Configuración Inicial
          </h1>
          <p className="text-gray-300">Crea tu cuenta de administrador</p>
        </div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "error"
                ? "bg-red-500/20 border border-red-500/30"
                : "bg-green-500/20 border border-green-500/30"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                message.type === "error" ? "text-red-200" : "text-green-200"
              }`}
            >
              {message.text}
            </p>
          </motion.div>
        )}

        {/* Setup form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email de Administrador
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="admin@lombok.com"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-400 mt-1">
              Debe ser uno de los emails autorizados en la configuración
            </p>
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          {/* Confirm password field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !email.trim() ||
              !password.trim() ||
              !confirmPassword.trim()
            }
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creando usuario...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Crear Administrador</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Solo necesitas hacer esto una vez
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSetup;
