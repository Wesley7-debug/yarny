import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import debounce from "../utils/debounce";
import authStore from "../store/authStore";
import AuthImagePattern from "../components/reuseable/AuthImageern";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, isRegistering } = authStore();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    nickname: false,
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);

  // Validate all fields and return errors object
  const validateFields = () => {
    const errs = { name: "", nickname: "", email: "", password: "" };

    if (!formData.name.trim()) {
      errs.name = "Name is required";
    }

    if (!formData.nickname.trim()) {
      errs.nickname = "Nickname is required";
    } else if (isNicknameAvailable === false) {
      errs.nickname = "Nickname is taken";
    }

    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      errs.email = "Invalid email address";
    }

    if (!formData.password) {
      errs.password = "Password is required";
    } else {
      // Password strength rules
      if (formData.password.length < 8) {
        errs.password = "Password must be at least 8 characters";
      } else if (!/[a-z]/.test(formData.password)) {
        errs.password = "Password must include lowercase letters";
      } else if (!/[A-Z]/.test(formData.password)) {
        errs.password = "Password must include uppercase letters";
      } else if (!/[0-9]/.test(formData.password)) {
        errs.password = "Password must include numbers";
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        errs.password = "Password must include special characters";
      }
    }

    return errs;
  };

  // Debounced nickname availability check
  const checkNickname = async (nickname) => {
    if (!nickname.trim()) {
      setIsNicknameAvailable(null);
      return;
    }
    setCheckingNickname(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/auth/check-nickname?nickname=${nickname}`
      );
      const { available } = await res.json();
      setIsNicknameAvailable(available);
    } catch (err) {
      console.error(err);
      setIsNicknameAvailable(null);
    }
    setCheckingNickname(false);
  };

  const debouncedCheck = useCallback(debounce(checkNickname, 500), []);

  useEffect(() => {
    debouncedCheck(formData.nickname.trim());
  }, [formData.nickname, debouncedCheck]);

  // Password strength calculation for progress bar
  const getPasswordStrength = () => {
    const pw = formData.password;
    let score = 0;
    if (!pw) return { score, label: "" };

    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    let label = "";
    if (score <= 2) label = "Bad";
    else if (score === 3) label = "Good";
    else if (score === 4) label = "Nice";
    else if (score === 5) label = "Strong";

    return { score, label };
  };

  const { score: passwordScore, label: passwordLabel } = getPasswordStrength();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Mark field touched on first input
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // For nickname, reset nickname availability on change
    if (name === "nickname") {
      setIsNicknameAvailable(null);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Mark field as touched on blur if not already
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    // Validate single field on blur
    const validationErrors = validateFields();
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();

    if (Object.values(validationErrors).some((err) => err)) {
      setErrors(validationErrors);
      // mark all fields as touched to show errors
      setTouched({
        name: true,
        nickname: true,
        email: true,
        password: true,
      });
      return;
    }

    try {
      await signUp(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        "", // bio empty for now, adjust if you want
        formData.nickname.trim()
      );
      navigate("/VerifyAccount");
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-white text-black overflow-hidden">
      <div className="hidden lg:block">
        <AuthImagePattern
          title="Welcome !"
          subtitle="Sign up to explore and see amazing things in yarny."
        />
      </div>
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center transition-colors">
                <img src="./yarny.png" className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome to YARNY!</h1>
              <p className="">Create your account</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-medium ">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 " />
                </div>
                <input
                  type="text"
                  name="name"
                  className={`input input-bordered w-full pl-10 py-2 border-black focus:border-purple-500 ${
                    touched.name && errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Nickname */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-medium ">Nickname</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 " />
                </div>
                <input
                  type="text"
                  name="nickname"
                  className={`input input-bordered w-full pl-10 py-2 border-black focus:border-purple-500 ${
                    touched.nickname && errors.nickname
                      ? "border-red-500"
                      : isNicknameAvailable === true
                      ? "border-green-500"
                      : ""
                  }`}
                  placeholder="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {checkingNickname && (
                <p className="text-sm text-gray-400 mt-1">Checking...</p>
              )}
              {touched.nickname && errors.nickname && (
                <p className="text-sm text-red-500 mt-1">{errors.nickname}</p>
              )}
              {isNicknameAvailable && !errors.nickname && (
                <p className="text-sm text-green-400 mt-1">
                  Nickname is available
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-medium ">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 " />
                </div>
                <input
                  type="email"
                  name="email"
                  className={`input input-bordered w-full pl-10 py-2 border-black focus:border-purple-500 ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium ">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none py-2 border-black">
                  <Lock className="h-5 w-5 " />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`input input-bordered w-full pl-10 pr-10 py-2 border-black focus:border-purple-500 ${
                    touched.password && errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {/* Password strength bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className={`h-2 rounded ${
                        passwordScore <= 2
                          ? "bg-red-500"
                          : passwordScore === 3
                          ? "bg-yellow-400"
                          : passwordScore === 4
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${(passwordScore / 5) * 100}%` }}
                    />
                  </div>
                  <p
                    className={`text-sm mt-1 font-semibold ${
                      passwordScore <= 2
                        ? "text-red-500"
                        : passwordScore === 3
                        ? "text-yellow-500"
                        : passwordScore === 4
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordLabel}
                  </p>
                </div>
              )}
              {touched.password && errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="w-full flex items-center justify-center">
              <button
                type="submit"
                className="bg-purple-600 border-black hover:bg-purple-700 py-2 px-3 rounded-lg flex items-center justify-center gap-2"
                disabled={
                  isRegistering ||
                  isNicknameAvailable === false ||
                  Object.values(errors).some((e) => e)
                }
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing up…
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-400">
              Have an account?{" "}
              <Link to="/login" className="text-purple-400 font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
