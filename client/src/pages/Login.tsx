import ProtectedRoute from "../components/ProtectedRoute";


function Login() {
  return (
    <ProtectedRoute>
        <div>
        <h1>Login</h1>
        {/* Aquí puedes agregar tu formulario de inicio de sesión */}
        </div>
    </ProtectedRoute>
  );
}

export default Login;